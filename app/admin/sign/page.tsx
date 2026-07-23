'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { type Address, keccak256 } from 'viem'
import { useWallet } from '@/context/WalletContext'
import { FACTORY_ADDRESS, SIGNER_1_ADDRESS, SIGNER_2_ADDRESS, FACTORY_ABI } from '@/lib/contracts'

interface Proposal { id: bigint; bytecodeHash: `0x${string}`; label: string; executed: boolean }

function shortenHash(h: string) { return `${h.slice(0, 10)}…${h.slice(-8)}` }

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-[#0f1923] rounded-xl bg-[#060d14] shadow-[0_0_0_1px_rgba(200,155,0,0.03),inset_0_1px_0_rgba(255,255,255,0.02)] ${className}`}>
      {children}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-600">{children}</p>
}

export default function SignPage() {
  const { address, walletClient, publicClient, connect, isConnecting } = useWallet()
  const [proposals, setProposals]             = useState<Proposal[]>([])
  const [loading, setLoading]                 = useState(true)
  const [statuses, setStatuses]               = useState<Record<string, string>>({})
  const [pending, setPending]                 = useState<Record<string, boolean>>({})
  const [deployedAddresses, setDeployedAddresses] = useState<Record<string, Address>>({})

  const isSigner2 = address?.toLowerCase() === SIGNER_2_ADDRESS.toLowerCase()

  const loadProposals = useCallback(async () => {
    setLoading(true)
    try {
      const count = await publicClient.readContract({ address: FACTORY_ADDRESS, abi: FACTORY_ABI, functionName: 'proposalCount' }) as bigint
      const ids = Array.from({ length: Number(count) }, (_, i) => BigInt(i))
      const results = await Promise.all(ids.map(id =>
        publicClient.readContract({ address: FACTORY_ADDRESS, abi: FACTORY_ABI, functionName: 'getProposal', args: [id] })
          .then(r => { const [bytecodeHash, label, executed] = r as [`0x${string}`, string, boolean]; return { id, bytecodeHash, label, executed } })
      ))
      setProposals(results.reverse())
      const logs = await publicClient.getLogs({
        address: FACTORY_ADDRESS,
        event: { type: 'event', name: 'ContractDeployed', inputs: [
          { name: 'proposalId', type: 'uint256', indexed: true },
          { name: 'deployed',   type: 'address', indexed: true },
          { name: 'label',      type: 'string',  indexed: false },
        ]},
        fromBlock: 0n,
      })
      const map: Record<string, Address> = {}
      logs.forEach(l => { map[String(BigInt(l.topics[1] ?? '0x0'))] = `0x${l.topics[2]?.slice(26)}` as Address })
      setDeployedAddresses(map)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [publicClient])

  useEffect(() => { loadProposals() }, [loadProposals])
  useEffect(() => {
    const unwatch = publicClient.watchContractEvent({ address: FACTORY_ADDRESS, abi: FACTORY_ABI, eventName: 'ProposalCreated', onLogs: () => loadProposals() })
    return () => unwatch()
  }, [publicClient, loadProposals])

  async function handleApprove(p: Proposal) {
    if (!walletClient || !address) return
    const key = String(p.id)
    setPending(prev => ({ ...prev, [key]: true }))
    setStatuses(prev => ({ ...prev, [key]: 'Sign the EIP-712 message in your wallet…' }))
    try {
      const sig = await walletClient.signTypedData({
        account: address,
        domain: { name: 'MultisigFactory', version: '2', chainId: BigInt(process.env.NEXT_PUBLIC_CHAIN_ID!), verifyingContract: FACTORY_ADDRESS },
        types: { DeployContract: [
          { name: 'signer1', type: 'address' }, { name: 'signer2', type: 'address' },
          { name: 'bytecodeHash', type: 'bytes32' }, { name: 'labelHash', type: 'bytes32' },
          { name: 'nonce', type: 'uint256' }, { name: 'chainId', type: 'uint256' },
        ]},
        primaryType: 'DeployContract',
        message: {
          signer1: SIGNER_1_ADDRESS as Address, signer2: SIGNER_2_ADDRESS as Address,
          bytecodeHash: p.bytecodeHash, labelHash: keccak256(new TextEncoder().encode(p.label)) as `0x${string}`,
          nonce: p.id, chainId: BigInt(process.env.NEXT_PUBLIC_CHAIN_ID!),
        },
      })
      setStatuses(prev => ({ ...prev, [key]: 'Submitting co-signature on-chain…' }))
      const tx = await walletClient.writeContract({ address: FACTORY_ADDRESS, abi: FACTORY_ABI, functionName: 'approve', args: [p.id, sig], account: address, chain: null })
      setStatuses(prev => ({ ...prev, [key]: 'Waiting for confirmation…' }))
      const receipt = await publicClient.waitForTransactionReceipt({ hash: tx })
      const log = receipt.logs.find(l => l.topics.length >= 3)
      const deployed = log ? `0x${log.topics[2]?.slice(26)}` as Address : null
      if (deployed) setDeployedAddresses(m => ({ ...m, [key]: deployed }))
      setStatuses(prev => ({ ...prev, [key]: `Deployed at ${deployed ?? 'unknown'}` }))
      loadProposals()
    } catch (e: unknown) {
      setStatuses(prev => ({ ...prev, [key]: `Error: ${e instanceof Error ? e.message : String(e)}` }))
    } finally { setPending(prev => ({ ...prev, [key]: false })) }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-5">
      <Link href="/admin/dashboard" className="text-[10px] font-mono text-zinc-700 hover:text-zinc-400 transition-colors tracking-widest uppercase">
        ← Dashboard
      </Link>

      {!address ? (
        <Card className="p-8 text-center space-y-4">
          <p className="text-zinc-600 font-mono text-sm">Connect Signer 2&apos;s wallet to co-sign.</p>
          <button onClick={connect} disabled={isConnecting}
            className="bg-[#C89B00] hover:bg-[#A07A00] text-black text-xs font-mono font-bold px-4 py-2 rounded-lg disabled:opacity-50 transition-colors tracking-wider uppercase">
            {isConnecting ? 'Connecting…' : 'Connect Wallet'}
          </button>
        </Card>
      ) : !isSigner2 ? (
        <Card className="p-5 border-red-900/50 space-y-1">
          <p className="text-red-400 font-mono text-sm font-semibold">⊘ Wrong wallet — only Signer 2 can co-sign</p>
          <p className="text-[10px] font-mono text-red-600">Expected: {SIGNER_2_ADDRESS}</p>
          <p className="text-[10px] font-mono text-red-600">Connected: {address}</p>
        </Card>
      ) : loading ? (
        <div className="text-center py-16">
          <p className="text-[10px] font-mono text-zinc-700 tracking-widest uppercase animate-pulse">Loading proposals…</p>
        </div>
      ) : proposals.length === 0 ? (
        <Card className="p-10 text-center space-y-2">
          <p className="text-zinc-600 font-mono text-sm">No proposals found.</p>
          <p className="text-[10px] font-mono text-zinc-700">
            Ask Signer 1 to go to{' '}
            <Link href="/admin/propose" className="text-[#C89B00] hover:underline">/admin/propose</Link>
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {proposals.map(p => {
            const key      = String(p.id)
            const deployed = deployedAddresses[key]
            return (
              <Card key={key} className={p.executed ? 'border-emerald-900/40' : ''}>
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono font-semibold text-zinc-200">{p.label}</p>
                      <p className="text-[10px] font-mono text-zinc-600 mt-0.5">Proposal #{key}</p>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border tracking-widest uppercase ${
                      p.executed
                        ? 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50 shadow-[0_0_8px_rgba(52,211,153,0.1)]'
                        : 'bg-[#C89B00]/8 text-[#C89B00] border-[#C89B00]/20'
                    }`}>
                      {p.executed ? '⊙ Deployed' : '◌ Pending'}
                    </span>
                  </div>

                  <div className="space-y-2 bg-[#020509] border border-[#0f1923] rounded-lg p-3">
                    {[
                      { label: 'Bytecode hash', value: shortenHash(p.bytecodeHash) },
                      { label: 'Signer 1',      value: `${SIGNER_1_ADDRESS.slice(0,10)}…` },
                      { label: 'Signer 2 (you)', value: `${SIGNER_2_ADDRESS.slice(0,10)}…` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between gap-2 text-[10px] font-mono">
                        <span className="text-zinc-600">{label}</span>
                        <span className="text-zinc-400">{value}</span>
                      </div>
                    ))}
                  </div>

                  {deployed && (
                    <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-lg p-3 space-y-1 shadow-[0_0_12px_rgba(52,211,153,0.05)]">
                      <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">⊙ Deployed</p>
                      <p className="font-mono text-xs text-emerald-500 break-all">{deployed}</p>
                      <a href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/address/${deployed}`}
                        target="_blank" rel="noreferrer"
                        className="text-[10px] font-mono text-[#C89B00] hover:underline">
                        View on Basescan ↗
                      </a>
                    </div>
                  )}

                  {!p.executed && (
                    <>
                      <div className="bg-[#020509] border border-[#0f1923] rounded-lg p-3 space-y-1.5">
                        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Verify before signing</p>
                        <ul className="text-[10px] font-mono text-zinc-600 list-disc list-inside space-y-1">
                          <li>Label matches what Signer 1 told you</li>
                          <li>Bytecode hash matches the compiled output you both agreed on</li>
                        </ul>
                      </div>
                      <button onClick={() => handleApprove(p)} disabled={pending[key]}
                        className="w-full bg-[#C89B00] hover:bg-[#A07A00] disabled:opacity-30 text-black font-mono font-bold py-3 rounded-lg transition-colors text-sm tracking-wider uppercase">
                        {pending[key] ? statuses[key] : 'Co-sign & Deploy'}
                      </button>
                    </>
                  )}

                  {statuses[key] && !pending[key] && (
                    <p className={`text-xs font-mono ${statuses[key].startsWith('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
                      {statuses[key]}
                    </p>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
