'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { createWalletClient, createPublicClient, custom, http, type Address, type WalletClient, type PublicClient } from 'viem'
import { appChain } from '@/lib/chain'

interface WalletContextType {
  address: Address | null
  walletClient: WalletClient | null
  publicClient: PublicClient
  connect: () => Promise<void>
  disconnect: () => void
  isConnecting: boolean
}

const publicClient = createPublicClient({
  chain: appChain,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL),
})

const WalletContext = createContext<WalletContextType | null>(null)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<Address | null>(null)
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      alert('MetaMask not found. Please install it.')
      return
    }
    setIsConnecting(true)
    try {
      const client = createWalletClient({
        chain: appChain,
        transport: custom(window.ethereum),
      })

      // Ask MetaMask to switch to / add Base mainnet
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x2105', // 8453 in hex
            chainName: 'Base',
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://mainnet.base.org'],
            blockExplorerUrls: ['https://basescan.org'],
          }],
        })
      } catch {
        // Already added or user rejected — continue anyway
      }

      const [addr] = await client.requestAddresses()
      setAddress(addr)
      setWalletClient(client)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAddress(null)
    setWalletClient(null)
  }, [])

  // Reconnect on page reload if already authorized
  useEffect(() => {
    if (!window.ethereum) return
    window.ethereum.request({ method: 'eth_accounts' }).then((res) => {
      const accounts = res as string[]
      if (accounts.length > 0) {
        const client = createWalletClient({
          chain: appChain,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          transport: custom(window.ethereum as any),
        })
        setAddress(accounts[0] as Address)
        setWalletClient(client)
      }
    })
  }, [])

  return (
    <WalletContext.Provider value={{ address, walletClient, publicClient, connect, disconnect, isConnecting }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within WalletProvider')
  return ctx
}
