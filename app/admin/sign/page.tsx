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
    <div className={`border border-[#0e1b35] rounded-xl bg-[#091222] shadow-[0_0_0_1px_rgba(21,46,116,0.06),inset_0_1px_0_rgba(255,255,255,0.02)] ${className}`}>
      {children}
    </div>
  )
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
      <Link href="/admin/dashboard" className="text-[10px] font-sans text-[#3a527a] hover:text-[#a8c0e8] transition-colors tracking-widest uppercase">
        ← Dashboard
      </Link>

      {!address ? (
        <Card className="p-8 text-center space-y-4">
          <p className="text-[#4a6585] font-sans text-sm">Connect Signer 2&apos;s wallet to co-sign.</p>
          <button onClick={connect} disabled={isConnecting}
            className="bg-[#152e74] hover:bg-[#0d1e52] text-white text-xs font-sans font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50 transition-colors tracking-wide">
            {isConnecting ? 'Connecting…' : 'Connect Wallet'}
          </button>
        </Card>
      ) : !isSigner2 ? (
        <Card className="p-5 border-red-900/50 space-y-1">
          <p className="text-red-400 font-sans text-sm font-semibold">⊘ Wrong wallet — only Signer 2 can co-sign</p>
          <p className="text-[10px] font-mono text-red-600">Expected: {SIGNER_2_ADDRESS}</p>
          <p className="text-[10px] font-mono text-red-600">Connected: {address}</p>
        </Card>
      ) : loading ? (
        <div className="text-center py-16">
          <p className="text-[10px] font-mono text-[#3a527a] tracking-widest uppercase animate-pulse">Loading proposals…</p>
        </div>
      ) : proposals.length === 0 ? (
        <Card className="p-10 text-center space-y-2">
          <p className="text-[#4a6585] font-sans text-sm">No proposals found.</p>
          <p className="text-[10px] font-sans text-[#3a527a]">
            Ask Signer 1 to go to{' '}
            <Link href="/admin/propose" className="text-[#5b8dee] hover:underline">/admin/propose</Link>
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {proposals.map(p => {
            const key      = String(p.id)
            const deployed = deployedAddresses[key]

            // The latest pending proposal is the active one — anything older that's
            // still unexecuted is redacted (superseded by a newer version).
            const latestPendingId = proposals.find(x => !x.executed)?.id
            const isRedacted = !p.executed && p.id !== latestPendingId

            return (
              <Card key={key} className={
                p.executed    ? 'border-emerald-900/40' :
                isRedacted    ? 'border-[#0e1b35] opacity-50' :
                'border-[#152e74]/30'
              }>
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-display font-bold ${isRedacted ? 'text-[#3a527a] line-through' : 'text-[#e4eeff]'}`}>
                        {p.label}
                      </p>
                      <p className="text-[10px] font-mono text-[#3a527a] mt-0.5">Proposal #{key}</p>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border tracking-widest uppercase ${
                      p.executed
                        ? 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50 shadow-[0_0_8px_rgba(52,211,153,0.1)]'
                        : isRedacted
                          ? 'bg-[#0e1b35] text-[#3a527a] border-[#0e1b35]'
                          : 'bg-[#152e74]/10 text-[#C89B00] border-[#C89B00]/20'
                    }`}>
                      {p.executed ? '⊙ Deployed' : isRedacted ? '— Redacted' : '◌ Pending'}
                    </span>
                  </div>

                  {isRedacted ? (
                    <p className="text-[11px] font-sans text-[#3a527a]">
                      This proposal has been replaced by a newer version below. No action needed here.
                    </p>
                  ) : (
                    <>
                      <div className="space-y-2 bg-[#060c1a] border border-[#0e1b35] rounded-lg p-3">
                        {[
                          { label: 'Bytecode hash',  value: shortenHash(p.bytecodeHash) },
                          { label: 'Signer 1',        value: `${SIGNER_1_ADDRESS.slice(0,10)}…` },
                          { label: 'Signer 2 (you)',  value: `${SIGNER_2_ADDRESS.slice(0,10)}…` },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex justify-between gap-2 text-[10px] font-mono">
                            <span className="text-[#3a527a]">{label}</span>
                            <span className="text-[#7a95c0]">{value}</span>
                          </div>
                        ))}
                      </div>

                      {deployed && (
                        <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-lg p-3 space-y-1 shadow-[0_0_12px_rgba(52,211,153,0.05)]">
                          <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">⊙ Deployed</p>
                          <p className="font-mono text-xs text-emerald-500 break-all">{deployed}</p>
                          <a href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/address/${deployed}`}
                            target="_blank" rel="noreferrer"
                            className="text-[10px] font-mono text-[#5b8dee] hover:underline">
                            View on Basescan ↗
                          </a>
                        </div>
                      )}

                      {!p.executed && (
                        <>
                          <div className="bg-[#060c1a] border border-[#0e1b35] rounded-lg p-3 space-y-1.5">
                            <p className="text-[10px] font-sans font-semibold text-[#4a6585] uppercase tracking-wide">Before signing</p>
                            <ul className="text-[10px] font-sans text-[#3a527a] list-disc list-inside space-y-1">
                              <li>Confirm the label matches what Signer 1 shared with you</li>
                              <li>Bytecode hash should match the agreed compiled output</li>
                            </ul>
                          </div>
                          <button onClick={() => handleApprove(p)} disabled={pending[key]}
                            className="w-full bg-[#C89B00] hover:bg-[#A07A00] disabled:opacity-30 text-black font-sans font-bold py-3 rounded-lg transition-colors text-sm tracking-wide">
                            {pending[key] ? statuses[key] : 'Co-sign & Deploy'}
                          </button>
                        </>
                      )}

                      {statuses[key] && !pending[key] && (
                        <p className={`text-xs font-mono ${statuses[key].startsWith('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
                          {statuses[key]}
                        </p>
                      )}
                    </>
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
