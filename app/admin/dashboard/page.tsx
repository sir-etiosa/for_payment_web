'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { formatUnits, parseUnits, type Address } from 'viem'
import { useWallet } from '@/context/WalletContext'
import {
  FACTORY_ADDRESS, FOR_TOKEN_ADDRESS, USDC_ADDRESS,
  SIGNER_1_ADDRESS, SIGNER_2_ADDRESS,
  FACTORY_ABI, SWAP_ABI, ERC20_ABI,
} from '@/lib/contracts'

interface ContractDeployedEvent {
  proposalId: bigint
  deployed: Address
  label: string
}

interface SwapEvent {
  user: Address
  usdcIn: bigint
  forOut: bigint
}

function shortenAddr(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

function explorerLink(addr: string) {
  return `${process.env.NEXT_PUBLIC_EXPLORER_URL}/address/${addr}`
}

export default function AdminDashboard() {
  const { address, walletClient, publicClient, connect, disconnect, isConnecting } = useWallet()

  const [deployedSwaps, setDeployedSwaps] = useState<ContractDeployedEvent[]>([])
  const [selectedSwap, setSelectedSwap] = useState<Address | null>(null)
  const [swapPaused, setSwapPaused] = useState(false)
  const [forLiquidity, setForLiquidity] = useState<bigint>(0n)
  const [usdcBal, setUsdcBal] = useState<bigint>(0n)
  const [recentSwaps, setRecentSwaps] = useState<SwapEvent[]>([])
  const [usdcInput, setUsdcInput] = useState('')
  const [swapStatus, setSwapStatus] = useState('')
  const [isTxPending, setIsTxPending] = useState(false)

  const loadSwapData = useCallback(async (swapAddr: Address) => {
    try {
      const [paused, liquidity, usdc] = await Promise.all([
        publicClient.readContract({ address: swapAddr, abi: SWAP_ABI, functionName: 'paused' }),
        publicClient.readContract({ address: swapAddr, abi: SWAP_ABI, functionName: 'forLiquidity' }),
        publicClient.readContract({ address: swapAddr, abi: SWAP_ABI, functionName: 'usdcBalance' }),
      ])
      setSwapPaused(paused as boolean)
      setForLiquidity(liquidity as bigint)
      setUsdcBal(usdc as bigint)

      const logs = await publicClient.getLogs({
        address: swapAddr,
        event: { type: 'event', name: 'Swapped', inputs: [
          { name: 'user', type: 'address', indexed: true },
          { name: 'usdcIn', type: 'uint256', indexed: false },
          { name: 'forOut', type: 'uint256', indexed: false },
        ]},
        fromBlock: 0n,
      })
      setRecentSwaps(
        logs.slice(-5).reverse().map(l => (l as unknown as { args: SwapEvent }).args)
      )
    } catch (e) { console.error(e) }
  }, [publicClient])

  useEffect(() => {
    publicClient.getLogs({
      address: FACTORY_ADDRESS,
      event: { type: 'event', name: 'ContractDeployed', inputs: [
        { name: 'proposalId', type: 'uint256', indexed: true },
        { name: 'deployed',   type: 'address', indexed: true },
        { name: 'label',      type: 'string',  indexed: false },
      ]},
      fromBlock: 0n,
    }).then((logs) => {
      const parsed = logs
        .map(l => {
          const args = (l as unknown as { args: ContractDeployedEvent }).args
          if (!args?.deployed) {
            const deployed = `0x${l.topics[2]?.slice(26)}` as Address
            return { proposalId: BigInt(l.topics[1] ?? '0'), deployed, label: 'ForSwap v1' }
          }
          return args
        })
        .filter(a => a?.deployed)
      setDeployedSwaps(parsed)
      if (parsed.length > 0) setSelectedSwap(parsed[parsed.length - 1].deployed)
    }).catch(console.error)
  }, [publicClient])

  useEffect(() => {
    if (selectedSwap) loadSwapData(selectedSwap)
  }, [selectedSwap, loadSwapData])

  async function handleSwap() {
    if (!walletClient || !address || !selectedSwap) return
    const usdcAmount = parseUnits(usdcInput, 6)
    setIsTxPending(true)
    setSwapStatus('Approving USDC…')
    try {
      const allowance = await publicClient.readContract({
        address: USDC_ADDRESS, abi: ERC20_ABI,
        functionName: 'allowance', args: [address, selectedSwap],
      }) as bigint
      if (allowance < usdcAmount) {
        const approveTx = await walletClient.writeContract({
          address: USDC_ADDRESS, abi: ERC20_ABI,
          functionName: 'approve', args: [selectedSwap, usdcAmount],
          account: address, chain: null,
        })
        setSwapStatus('Waiting for approval…')
        await publicClient.waitForTransactionReceipt({ hash: approveTx })
      }
      setSwapStatus('Swapping…')
      const swapTx = await walletClient.writeContract({
        address: selectedSwap, abi: SWAP_ABI,
        functionName: 'swap', args: [usdcAmount],
        account: address, chain: null,
      })
      setSwapStatus('Waiting for confirmation…')
      await publicClient.waitForTransactionReceipt({ hash: swapTx })
      setSwapStatus('Swap complete!')
      setUsdcInput('')
      loadSwapData(selectedSwap)
    } catch (e: unknown) {
      setSwapStatus(`Error: ${e instanceof Error ? e.message : String(e)}`)
    } finally { setIsTxPending(false) }
  }

  async function handlePause() {
    if (!walletClient || !address || !selectedSwap) return
    setIsTxPending(true)
    try {
      const tx = await walletClient.writeContract({
        address: selectedSwap, abi: SWAP_ABI,
        functionName: 'pause', account: address, chain: null,
      })
      await publicClient.waitForTransactionReceipt({ hash: tx })
      setSwapPaused(true)
    } catch (e: unknown) {
      alert(`Pause failed: ${e instanceof Error ? e.message : String(e)}`)
    } finally { setIsTxPending(false) }
  }

  const forOut = usdcInput ? parseFloat(usdcInput) * 5 : 0
  const isSigner1 = address?.toLowerCase() === SIGNER_1_ADDRESS.toLowerCase()
  const isSigner2 = address?.toLowerCase() === SIGNER_2_ADDRESS.toLowerCase()
  const isSigner = isSigner1 || isSigner2

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-zinc-600 text-sm mt-0.5">Base Mainnet · Chain {process.env.NEXT_PUBLIC_CHAIN_ID}</p>
        </div>
        {address ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono bg-[#0d1117] border border-[#1c2432] px-3 py-1.5 rounded-lg text-zinc-300">
              {isSigner1 ? '⬡ Signer 1 · ' : isSigner2 ? '⬡ Signer 2 · ' : ''}{shortenAddr(address)}
            </span>
            <button onClick={disconnect} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              Disconnect
            </button>
          </div>
        ) : (
          <button onClick={connect} disabled={isConnecting}
            className="bg-[#C89B00] hover:bg-[#A07A00] text-black text-sm font-bold px-4 py-2 rounded-lg disabled:opacity-50 transition-colors">
            {isConnecting ? 'Connecting…' : 'Connect Wallet'}
          </button>
        )}
      </div>

      {/* Signer actions */}
      {isSigner && (
        <div className="flex gap-3 border border-[#1c2432] rounded-xl p-4 bg-[#0d1117] items-center">
          <span className="text-sm text-zinc-500 mr-auto">Admin panel</span>
          {isSigner1 && (
            <Link href="/admin/propose"
              className="bg-[#C89B00] hover:bg-[#A07A00] text-black text-sm font-bold px-4 py-1.5 rounded-lg transition-colors">
              Propose Deployment
            </Link>
          )}
          {isSigner2 && (
            <Link href="/admin/sign"
              className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors">
              Sign Proposals
            </Link>
          )}
        </div>
      )}

      {/* Factory */}
      <div className="border border-[#1c2432] rounded-xl p-4 bg-[#0d1117] space-y-1">
        <p className="text-xs text-zinc-600 uppercase tracking-wider font-semibold">Factory Contract</p>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-zinc-300">{FACTORY_ADDRESS}</span>
          <a href={explorerLink(FACTORY_ADDRESS)} target="_blank" rel="noreferrer"
            className="text-xs text-[#C89B00] hover:underline shrink-0">↗</a>
        </div>
        <p className="text-sm text-zinc-500">{deployedSwaps.length} contract{deployedSwaps.length !== 1 ? 's' : ''} deployed via factory</p>
      </div>

      {/* Deployed contracts */}
      {deployedSwaps.length > 0 && (
        <div className="border border-[#1c2432] rounded-xl p-4 bg-[#0d1117] space-y-2">
          <p className="text-xs text-zinc-600 uppercase tracking-wider font-semibold">Swap Contracts</p>
          {deployedSwaps.map((s) => (
            <button key={String(s.deployed)} onClick={() => setSelectedSwap(s.deployed)}
              className={`w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                selectedSwap === s.deployed
                  ? 'border-[#C89B00]/50 bg-[#C89B00]/5'
                  : 'border-[#1c2432] hover:border-zinc-700'
              }`}>
              <div className="flex flex-col items-start min-w-0">
                <span className="text-sm font-semibold text-zinc-200">{s.label}</span>
                <span className="text-xs font-mono text-zinc-500 truncate">{s.deployed}</span>
              </div>
              <a href={explorerLink(s.deployed)} target="_blank" rel="noreferrer"
                className="ml-auto text-xs text-[#C89B00] hover:underline shrink-0 px-2 py-1 border border-[#C89B00]/30 rounded"
                onClick={e => e.stopPropagation()}>
                Basescan ↗
              </a>
            </button>
          ))}
        </div>
      )}

      {/* Swap UI */}
      {selectedSwap && (
        <div className="border border-[#1c2432] rounded-xl p-5 bg-[#0d1117] space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-600 uppercase tracking-wider font-semibold">Swap</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              swapPaused ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}>{swapPaused ? 'PAUSED' : 'ACTIVE'}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#030712] border border-[#1c2432] rounded-lg p-3">
              <p className="text-xs text-zinc-600">FOR Liquidity</p>
              <p className="text-lg font-semibold font-mono text-zinc-100">
                {parseFloat(formatUnits(forLiquidity, 18)).toLocaleString()}
              </p>
            </div>
            <div className="bg-[#030712] border border-[#1c2432] rounded-lg p-3">
              <p className="text-xs text-zinc-600">USDC Collected</p>
              <p className="text-lg font-semibold font-mono text-zinc-100">
                ${parseFloat(formatUnits(usdcBal, 6)).toLocaleString()}
              </p>
            </div>
          </div>

          <p className="text-sm text-zinc-500">Rate: <span className="text-[#C89B00] font-semibold">0.2 USDC = 1 FOR</span></p>

          {!swapPaused && address && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-600">USDC to spend</label>
                <input type="number" min="0" step="0.01"
                  value={usdcInput} onChange={e => setUsdcInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#030712] border border-[#1c2432] rounded-lg px-3 py-2 text-sm font-mono text-zinc-100 focus:outline-none focus:border-[#C89B00]/50 placeholder-zinc-700"
                />
                {usdcInput && parseFloat(usdcInput) > 0 && (
                  <p className="text-xs text-zinc-500">
                    You receive: <span className="text-[#C89B00] font-semibold">{forOut.toLocaleString()} FOR</span>
                  </p>
                )}
              </div>
              <button onClick={handleSwap}
                disabled={isTxPending || !usdcInput || parseFloat(usdcInput) <= 0}
                className="w-full bg-[#C89B00] hover:bg-[#A07A00] disabled:opacity-40 text-black font-bold py-2.5 rounded-lg transition-colors">
                {isTxPending ? swapStatus : 'Swap USDC → FOR'}
              </button>
              {swapStatus && !isTxPending && (
                <p className="text-sm text-zinc-400">{swapStatus}</p>
              )}
            </div>
          )}

          {!swapPaused && !address && (
            <p className="text-sm text-zinc-600 text-center">Connect wallet to swap.</p>
          )}
          {swapPaused && (
            <p className="text-sm text-red-400 text-center">Swaps are currently paused.</p>
          )}

          {isSigner && !swapPaused && (
            <button onClick={handlePause} disabled={isTxPending}
              className="w-full border border-red-900 text-red-500 hover:bg-red-950 disabled:opacity-40 text-sm font-semibold py-2 rounded-lg transition-colors">
              Emergency Pause (1-of-2)
            </button>
          )}
        </div>
      )}

      {deployedSwaps.length === 0 && (
        <div className="border border-[#1c2432] rounded-xl p-10 text-center space-y-3 bg-[#0d1117]">
          <p className="text-zinc-500">No swap contract deployed yet.</p>
          {isSigner1 && (
            <Link href="/admin/propose"
              className="inline-block bg-[#C89B00] hover:bg-[#A07A00] text-black text-sm font-bold px-5 py-2 rounded-lg transition-colors">
              Propose Deployment →
            </Link>
          )}
        </div>
      )}

      {/* Recent swaps */}
      {recentSwaps.length > 0 && (
        <div className="border border-[#1c2432] rounded-xl p-4 bg-[#0d1117] space-y-2">
          <p className="text-xs text-zinc-600 uppercase tracking-wider font-semibold">Recent Swaps</p>
          {recentSwaps.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-sm font-mono">
              <span className="text-zinc-500">{shortenAddr(s.user)}</span>
              <span className="text-zinc-700">·</span>
              <span className="text-zinc-300">${formatUnits(s.usdcIn, 6)} USDC</span>
              <span className="text-zinc-700">→</span>
              <span className="text-[#C89B00]">{parseFloat(formatUnits(s.forOut, 18)).toLocaleString()} FOR</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
