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

interface ContractDeployedEvent { proposalId: bigint; deployed: Address; label: string }
interface BuyEvent { buyer: Address; usdcIn: bigint; forOut: bigint }

function shortenAddr(a: string) { return `${a.slice(0,6)}…${a.slice(-4)}` }
function explorerLink(a: string) { return `${process.env.NEXT_PUBLIC_EXPLORER_URL}/address/${a}` }

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-[#0e1b35] rounded-xl bg-[#091222] shadow-[0_0_0_1px_rgba(21,46,116,0.06),inset_0_1px_0_rgba(255,255,255,0.02)] ${className}`}>
      {children}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-sans font-semibold tracking-[0.18em] uppercase text-[#3a527a]">{children}</p>
}

export default function AdminDashboard() {
  const { address, walletClient, publicClient, connect, disconnect, isConnecting } = useWallet()
  const [deployedSwaps, setDeployedSwaps] = useState<ContractDeployedEvent[]>([])
  const [selectedSwap, setSelectedSwap]   = useState<Address | null>(null)
  const [swapPaused, setSwapPaused]       = useState(false)
  const [forBal, setForBal]               = useState<bigint>(0n)
  const [usdcBal, setUsdcBal]             = useState<bigint>(0n)
  const [ethBal, setEthBal]               = useState<bigint>(0n)
  const [forPriceUSDC, setForPriceUSDC]   = useState<bigint>(200_000n)
  const [recentBuys, setRecentBuys]       = useState<BuyEvent[]>([])
  const [usdcInput, setUsdcInput]         = useState('')
  const [swapStatus, setSwapStatus]       = useState('')
  const [isTxPending, setIsTxPending]     = useState(false)

  const loadSwapData = useCallback(async (swapAddr: Address) => {
    try {
      const [paused, forBalance, usdc, eth, price] = await Promise.all([
        publicClient.readContract({ address: swapAddr, abi: SWAP_ABI, functionName: 'paused' }),
        publicClient.readContract({ address: swapAddr, abi: SWAP_ABI, functionName: 'forBalance' }),
        publicClient.readContract({ address: swapAddr, abi: SWAP_ABI, functionName: 'usdcBalance' }),
        publicClient.readContract({ address: swapAddr, abi: SWAP_ABI, functionName: 'ethBalance' }),
        publicClient.readContract({ address: swapAddr, abi: SWAP_ABI, functionName: 'forPriceUSDC' }),
      ])
      setSwapPaused(paused as boolean)
      setForBal(forBalance as bigint)
      setUsdcBal(usdc as bigint)
      setEthBal(eth as bigint)
      setForPriceUSDC(price as bigint)

      const logs = await publicClient.getLogs({
        address: swapAddr,
        event: { type: 'event', name: 'BoughtWithUSDC', inputs: [
          { name: 'buyer',   type: 'address', indexed: true  },
          { name: 'usdcIn',  type: 'uint256', indexed: false },
          { name: 'forOut',  type: 'uint256', indexed: false },
        ]},
        fromBlock: 0n,
      })
      setRecentBuys(logs.slice(-5).reverse().map(l => (l as unknown as { args: BuyEvent }).args))
    } catch (e) { console.error(e) }
  }, [publicClient])

  useEffect(() => {
    publicClient.getLogs({
      address: FACTORY_ADDRESS,
      event: { type: 'event', name: 'ContractDeployed', inputs: [
        { name: 'proposalId', type: 'uint256', indexed: true  },
        { name: 'deployed',   type: 'address', indexed: true  },
        { name: 'label',      type: 'string',  indexed: false },
      ]},
      fromBlock: 0n,
    }).then(logs => {
      const parsed = logs.map(l => {
        const args = (l as unknown as { args: ContractDeployedEvent }).args
        if (!args?.deployed) return { proposalId: BigInt(l.topics[1] ?? '0'), deployed: `0x${l.topics[2]?.slice(26)}` as Address, label: 'FORSale' }
        return args
      }).filter(a => a?.deployed)
      setDeployedSwaps(parsed)
      if (parsed.length > 0) setSelectedSwap(parsed[parsed.length - 1].deployed)
    }).catch(console.error)
  }, [publicClient])

  useEffect(() => { if (selectedSwap) loadSwapData(selectedSwap) }, [selectedSwap, loadSwapData])

  async function handleBuyWithUSDC() {
    if (!walletClient || !address || !selectedSwap) return
    const usdcAmount = parseUnits(usdcInput, 6)
    setIsTxPending(true); setSwapStatus('Approving USDC…')
    try {
      const allowance = await publicClient.readContract({ address: USDC_ADDRESS, abi: ERC20_ABI, functionName: 'allowance', args: [address, selectedSwap] }) as bigint
      if (allowance < usdcAmount) {
        const approveTx = await walletClient.writeContract({ address: USDC_ADDRESS, abi: ERC20_ABI, functionName: 'approve', args: [selectedSwap, usdcAmount], account: address, chain: null })
        setSwapStatus('Waiting for approval…')
        await publicClient.waitForTransactionReceipt({ hash: approveTx })
      }
      setSwapStatus('Buying FOR…')
      const tx = await walletClient.writeContract({ address: selectedSwap, abi: SWAP_ABI, functionName: 'buyWithUSDC', args: [usdcAmount], account: address, chain: null })
      setSwapStatus('Waiting for confirmation…')
      await publicClient.waitForTransactionReceipt({ hash: tx })
      setSwapStatus('Done!'); setUsdcInput(''); loadSwapData(selectedSwap)
    } catch (e: unknown) {
      setSwapStatus(`${e instanceof Error ? e.message : String(e)}`)
    } finally { setIsTxPending(false) }
  }

  async function handlePause() {
    if (!walletClient || !address || !selectedSwap) return
    setIsTxPending(true)
    try {
      const tx = await walletClient.writeContract({ address: selectedSwap, abi: SWAP_ABI, functionName: 'pause', account: address, chain: null })
      await publicClient.waitForTransactionReceipt({ hash: tx }); setSwapPaused(true)
    } catch (e: unknown) { alert(e instanceof Error ? e.message : String(e)) }
    finally { setIsTxPending(false) }
  }

  // Preview: usdcIn * 1e18 / forPriceUSDC
  const forOut = usdcInput && parseFloat(usdcInput) > 0 && forPriceUSDC > 0n
    ? parseFloat(usdcInput) * 1e6 / Number(forPriceUSDC)
    : 0

  const isSigner1 = address?.toLowerCase() === SIGNER_1_ADDRESS.toLowerCase()
  const isSigner2 = address?.toLowerCase() === SIGNER_2_ADDRESS.toLowerCase()
  const isSigner  = isSigner1 || isSigner2

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-[#3a527a] tracking-widest uppercase">Base Mainnet</span>
        </div>
        {address ? (
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-[#091222] border border-[#152e74]/40 px-3 py-1.5 rounded-lg text-[#C89B00]">
              {isSigner1 ? '◈ S1 · ' : isSigner2 ? '◈ S2 · ' : ''}{shortenAddr(address)}
            </span>
            <button onClick={disconnect} className="text-[10px] font-sans text-[#3a527a] hover:text-[#a8c0e8] transition-colors tracking-wide uppercase">
              Disconnect
            </button>
          </div>
        ) : (
          <button onClick={connect} disabled={isConnecting}
            className="bg-[#152e74] hover:bg-[#0d1e52] text-white text-xs font-sans font-semibold px-4 py-2 rounded-lg disabled:opacity-50 transition-colors tracking-wide">
            {isConnecting ? 'Connecting…' : 'Connect Wallet'}
          </button>
        )}
      </div>

      {/* Signer admin panel */}
      {isSigner && (
        <Card className="p-4 flex gap-3 items-center">
          <span className="text-xs font-sans text-[#4a6585] mr-auto tracking-wide uppercase font-medium">Admin Access</span>
          {isSigner1 && (
            <Link href="/admin/propose"
              className="bg-[#C89B00] hover:bg-[#A07A00] text-black text-xs font-sans font-bold px-4 py-1.5 rounded-lg transition-colors tracking-wide">
              Propose
            </Link>
          )}
          {isSigner2 && (
            <Link href="/admin/sign"
              className="border border-[#162444] hover:border-[#1e3560] text-[#7a95c0] hover:text-[#e4eeff] text-xs font-sans font-semibold px-4 py-1.5 rounded-lg transition-colors tracking-wide">
              Sign
            </Link>
          )}
        </Card>
      )}

      {/* Factory */}
      <Card className="p-4 space-y-2">
        <Label>Factory Contract</Label>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#7a95c0]">{FACTORY_ADDRESS}</span>
          <a href={explorerLink(FACTORY_ADDRESS)} target="_blank" rel="noreferrer"
            className="text-[#5b8dee] hover:text-[#7aa5f5] text-xs transition-colors shrink-0">↗</a>
        </div>
        <p className="text-xs text-[#3a527a] font-sans">{deployedSwaps.length} contract{deployedSwaps.length !== 1 ? 's' : ''} deployed</p>
      </Card>

      {/* Deployed contracts */}
      {deployedSwaps.length > 0 && (
        <Card className="p-4 space-y-2">
          <Label>Sale Contracts</Label>
          {deployedSwaps.map(s => (
            <button key={String(s.deployed)} onClick={() => setSelectedSwap(s.deployed)}
              className={`w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                selectedSwap === s.deployed
                  ? 'border-[#152e74]/50 bg-[#152e74]/8 shadow-[0_0_14px_rgba(21,46,116,0.18)]'
                  : 'border-[#0e1b35] hover:border-[#162444]'
              }`}>
              <div className="min-w-0">
                <p className="text-sm font-display font-bold text-[#e4eeff]">{s.label}</p>
                <p className="text-[10px] font-mono text-[#3a527a] truncate">{s.deployed}</p>
              </div>
              <a href={explorerLink(s.deployed)} target="_blank" rel="noreferrer"
                className="ml-auto text-[10px] font-mono text-[#5b8dee]/70 hover:text-[#5b8dee] shrink-0 px-2 py-1 border border-[#5b8dee]/20 rounded transition-colors"
                onClick={e => e.stopPropagation()}>
                Basescan ↗
              </a>
            </button>
          ))}
        </Card>
      )}

      {/* Sale panel */}
      {selectedSwap && (
        <Card className="p-5 space-y-5">
          <div className="flex items-center justify-between">
            <Label>Active Sale Contract</Label>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border tracking-widest uppercase ${
              swapPaused
                ? 'bg-red-950/50 text-red-400 border-red-900/50'
                : 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50 shadow-[0_0_8px_rgba(52,211,153,0.1)]'
            }`}>
              {swapPaused ? '⊘ Paused' : '⊙ Active'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'FOR Balance', value: parseFloat(formatUnits(forBal, 18)).toLocaleString(), unit: 'FOR' },
              { label: 'USDC Balance', value: `$${parseFloat(formatUnits(usdcBal, 6)).toLocaleString()}`, unit: '' },
              { label: 'ETH Balance', value: parseFloat(formatUnits(ethBal, 18)).toFixed(4), unit: 'ETH' },
            ].map(({ label, value, unit }) => (
              <div key={label} className="bg-[#060c1a] border border-[#0e1b35] rounded-lg p-3">
                <p className="text-[10px] font-sans font-semibold text-[#3a527a] uppercase tracking-wide">{label}</p>
                <p className="text-lg font-mono font-semibold text-[#e4eeff] mt-1">{value}</p>
                {unit && <p className="text-[10px] font-mono text-[#2d4166]">{unit}</p>}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#3a527a]">
            <span className="text-[#2d4166]">Rate</span>
            <span className="h-px flex-1 bg-[#0e1b35]" />
            <span className="text-[#5b8dee]">${(Number(forPriceUSDC) / 1e6).toFixed(2)} USDC = 1 FOR</span>
          </div>

          {!swapPaused && address && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-semibold text-[#3a527a] uppercase tracking-wide">USDC Amount</label>
                <input type="number" min="0" step="0.01"
                  value={usdcInput} onChange={e => setUsdcInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#060c1a] border border-[#0e1b35] focus:border-[#152e74]/60 rounded-lg px-3 py-2.5 text-sm font-mono text-[#e4eeff] focus:outline-none placeholder-[#2d4166] transition-colors"
                />
                {forOut > 0 && (
                  <p className="text-[10px] font-mono text-[#3a527a]">
                    Receive: <span className="text-[#C89B00]">{forOut.toLocaleString(undefined, { maximumFractionDigits: 2 })} FOR</span>
                  </p>
                )}
              </div>
              <button onClick={handleBuyWithUSDC}
                disabled={isTxPending || !usdcInput || parseFloat(usdcInput) <= 0}
                className="w-full bg-[#C89B00] hover:bg-[#A07A00] disabled:opacity-30 text-black font-sans font-bold py-2.5 rounded-lg transition-colors text-sm tracking-wide">
                {isTxPending ? swapStatus : 'BUY FOR WITH USDC'}
              </button>
              {swapStatus && !isTxPending && (
                <p className="text-xs font-mono text-[#4a6585]">{swapStatus}</p>
              )}
            </div>
          )}

          {!swapPaused && !address && (
            <p className="text-xs font-sans text-[#3a527a] text-center">Connect wallet to buy FOR.</p>
          )}
          {swapPaused && (
            <p className="text-xs font-mono text-[#4a6585] text-center">Contract is currently paused.</p>
          )}

          {isSigner1 && !swapPaused && (
            <button onClick={handlePause} disabled={isTxPending}
              className="w-full border border-[#162444] hover:border-[#1e3560] text-[#4a6585] hover:text-[#7a95c0] disabled:opacity-30 text-xs font-sans font-semibold py-2 rounded-lg transition-all tracking-wide uppercase">
              Pause Contract
            </button>
          )}
        </Card>
      )}

      {deployedSwaps.length === 0 && (
        <Card className="p-12 text-center space-y-3">
          <p className="text-[#4a6585] font-sans text-sm">No sale contract deployed yet.</p>
          {isSigner1 && (
            <Link href="/admin/propose"
              className="inline-block bg-[#C89B00] hover:bg-[#A07A00] text-black text-xs font-sans font-bold px-5 py-2 rounded-lg transition-colors tracking-wide">
              Propose Deployment →
            </Link>
          )}
        </Card>
      )}

      {/* Recent buys */}
      {recentBuys.length > 0 && (
        <Card className="p-4 space-y-3">
          <Label>Recent Purchases</Label>
          {recentBuys.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-mono border-b border-[#0a1528] last:border-0 pb-2 last:pb-0">
              <span className="text-[#4a6585]">{shortenAddr(s.buyer)}</span>
              <span className="flex-1 border-b border-dashed border-[#0e1b35] mx-1" />
              <span className="text-[#7a95c0]">${formatUnits(s.usdcIn, 6)}</span>
              <span className="text-[#2d4166]">→</span>
              <span className="text-[#5b8dee]">{parseFloat(formatUnits(s.forOut, 18)).toLocaleString()} FOR</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
