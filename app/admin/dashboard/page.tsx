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
interface SwapEvent { user: Address; usdcIn: bigint; forOut: bigint }

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
  const [deployedSwaps, setDeployedSwaps]   = useState<ContractDeployedEvent[]>([])
  const [selectedSwap, setSelectedSwap]     = useState<Address | null>(null)
  const [swapPaused, setSwapPaused]         = useState(false)
  const [forLiquidity, setForLiquidity]     = useState<bigint>(0n)
  const [usdcBal, setUsdcBal]               = useState<bigint>(0n)
  const [recentSwaps, setRecentSwaps]       = useState<SwapEvent[]>([])
  const [usdcInput, setUsdcInput]           = useState('')
  const [swapStatus, setSwapStatus]         = useState('')
  const [isTxPending, setIsTxPending]       = useState(false)

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
          { name: 'user',    type: 'address', indexed: true  },
          { name: 'usdcIn',  type: 'uint256', indexed: false },
          { name: 'forOut',  type: 'uint256', indexed: false },
        ]},
        fromBlock: 0n,
      })
      setRecentSwaps(logs.slice(-5).reverse().map(l => (l as unknown as { args: SwapEvent }).args))
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
        if (!args?.deployed) return { proposalId: BigInt(l.topics[1] ?? '0'), deployed: `0x${l.topics[2]?.slice(26)}` as Address, label: 'ForSwap v1' }
        return args
      }).filter(a => a?.deployed)
      setDeployedSwaps(parsed)
      if (parsed.length > 0) setSelectedSwap(parsed[parsed.length - 1].deployed)
    }).catch(console.error)
  }, [publicClient])

  useEffect(() => { if (selectedSwap) loadSwapData(selectedSwap) }, [selectedSwap, loadSwapData])

  async function handleSwap() {
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
      setSwapStatus('Swapping…')
      const swapTx = await walletClient.writeContract({ address: selectedSwap, abi: SWAP_ABI, functionName: 'swap', args: [usdcAmount], account: address, chain: null })
      setSwapStatus('Waiting for confirmation…')
      await publicClient.waitForTransactionReceipt({ hash: swapTx })
      setSwapStatus('Swap complete!'); setUsdcInput(''); loadSwapData(selectedSwap)
    } catch (e: unknown) {
      setSwapStatus(`Error: ${e instanceof Error ? e.message : String(e)}`)
    } finally { setIsTxPending(false) }
  }

  async function handlePause() {
    if (!walletClient || !address || !selectedSwap) return
    setIsTxPending(true)
    try {
      const tx = await walletClient.writeContract({ address: selectedSwap, abi: SWAP_ABI, functionName: 'pause', account: address, chain: null })
      await publicClient.waitForTransactionReceipt({ hash: tx }); setSwapPaused(true)
    } catch (e: unknown) { alert(`Pause failed: ${e instanceof Error ? e.message : String(e)}`) }
    finally { setIsTxPending(false) }
  }

  const forOut    = usdcInput ? parseFloat(usdcInput) * 5 : 0
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

      {/* Signer admin panel — only visible when connected as signer */}
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
          <Label>Swap Contracts</Label>
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

      {/* Swap panel */}
      {selectedSwap && (
        <Card className="p-5 space-y-5">
          <div className="flex items-center justify-between">
            <Label>Active Swap</Label>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border tracking-widest uppercase ${
              swapPaused
                ? 'bg-red-950/50 text-red-400 border-red-900/50'
                : 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50 shadow-[0_0_8px_rgba(52,211,153,0.1)]'
            }`}>
              {swapPaused ? '⊘ Paused' : '⊙ Active'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'FOR Liquidity', value: parseFloat(formatUnits(forLiquidity, 18)).toLocaleString(), unit: 'FOR' },
              { label: 'USDC Collected', value: `$${parseFloat(formatUnits(usdcBal, 6)).toLocaleString()}`, unit: '' },
            ].map(({ label, value, unit }) => (
              <div key={label} className="bg-[#060c1a] border border-[#0e1b35] rounded-lg p-3">
                <p className="text-[10px] font-sans font-semibold text-[#3a527a] uppercase tracking-wide">{label}</p>
                <p className="text-xl font-mono font-semibold text-[#e4eeff] mt-1">{value}</p>
                {unit && <p className="text-[10px] font-mono text-[#2d4166]">{unit}</p>}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#3a527a]">
            <span className="text-[#2d4166]">Rate</span>
            <span className="h-px flex-1 bg-[#0e1b35]" />
            <span className="text-[#5b8dee]">0.2 USDC = 1 FOR</span>
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
                {usdcInput && parseFloat(usdcInput) > 0 && (
                  <p className="text-[10px] font-mono text-[#3a527a]">
                    Receive: <span className="text-[#C89B00]">{forOut.toLocaleString()} FOR</span>
                  </p>
                )}
              </div>
              <button onClick={handleSwap}
                disabled={isTxPending || !usdcInput || parseFloat(usdcInput) <= 0}
                className="w-full bg-[#C89B00] hover:bg-[#A07A00] disabled:opacity-30 text-black font-sans font-bold py-2.5 rounded-lg transition-colors text-sm tracking-wide">
                {isTxPending ? swapStatus : 'SWAP USDC → FOR'}
              </button>
              {swapStatus && !isTxPending && (
                <p className="text-xs font-mono text-[#4a6585]">{swapStatus}</p>
              )}
            </div>
          )}

          {!swapPaused && !address && (
            <p className="text-xs font-sans text-[#3a527a] text-center">Connect wallet to swap.</p>
          )}
          {swapPaused && (
            <p className="text-xs font-mono text-red-500/70 text-center">⊘ Swaps paused by a signer</p>
          )}

          {isSigner && !swapPaused && (
            <button onClick={handlePause} disabled={isTxPending}
              className="w-full border border-red-900/50 text-red-500/70 hover:bg-red-950/30 hover:border-red-800 disabled:opacity-30 text-xs font-sans font-semibold py-2 rounded-lg transition-all tracking-wide uppercase">
              ⚠ Emergency Pause (1-of-2)
            </button>
          )}
        </Card>
      )}

      {deployedSwaps.length === 0 && (
        <Card className="p-12 text-center space-y-3">
          <p className="text-[#4a6585] font-sans text-sm">No swap contract deployed yet.</p>
          {isSigner1 && (
            <Link href="/admin/propose"
              className="inline-block bg-[#C89B00] hover:bg-[#A07A00] text-black text-xs font-sans font-bold px-5 py-2 rounded-lg transition-colors tracking-wide">
              Propose Deployment →
            </Link>
          )}
        </Card>
      )}

      {/* Recent swaps */}
      {recentSwaps.length > 0 && (
        <Card className="p-4 space-y-3">
          <Label>Recent Swaps</Label>
          {recentSwaps.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-mono border-b border-[#0a1528] last:border-0 pb-2 last:pb-0">
              <span className="text-[#4a6585]">{shortenAddr(s.user)}</span>
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
