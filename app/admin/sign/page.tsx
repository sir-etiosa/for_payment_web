'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { type Address, keccak256 } from 'viem'
import { useWallet } from '@/context/WalletContext'
import {
  FACTORY_ADDRESS, SIGNER_1_ADDRESS, SIGNER_2_ADDRESS, FACTORY_ABI,
} from '@/lib/contracts'

interface Proposal {
  id: bigint
  bytecodeHash: `0x${string}`
  label: string
  executed: boolean
}

function shortenHash(h: string) {
  return `${h.slice(0, 10)}…${h.slice(-8)}`
}

export default function SignPage() {
  const { address, walletClient, publicClient, connect, isConnecting } = useWallet()

  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [statuses, setStatuses] = useState<Record<string, string>>({})
  const [pending, setPending] = useState<Record<string, boolean>>({})
  const [deployedAddresses, setDeployedAddresses] = useState<Record<string, Address>>({})

  const isSigner2 = address?.toLowerCase() === SIGNER_2_ADDRESS.toLowerCase()

  const loadProposals = useCallback(async () => {
    setLoading(true)
    try {
      const count = await publicClient.readContract({
        address: FACTORY_ADDRESS, abi: FACTORY_ABI, functionName: 'proposalCount',
      }) as bigint

      const ids = Array.from({ length: Number(count) }, (_, i) => BigInt(i))
      const results = await Promise.all(
        ids.map(id =>
          publicClient.readContract({
            address: FACTORY_ADDRESS, abi: FACTORY_ABI,
            functionName: 'getProposal', args: [id],
          }).then(r => {
            const [bytecodeHash, label, executed] = r as [`0x${string}`, string, boolean]
            return { id, bytecodeHash, label, executed }
          })
        )
      )
      setProposals(results.reverse())

      const deployedLogs = await publicClient.getLogs({
        address: FACTORY_ADDRESS,
        event: {
          type: 'event', name: 'ContractDeployed',
          inputs: [
            { name: 'proposalId', type: 'uint256', indexed: true },
            { name: 'deployed',   type: 'address', indexed: true },
            { name: 'label',      type: 'string',  indexed: false },
          ],
        },
        fromBlock: 0n,
      })
      const map: Record<string, Address> = {}
      deployedLogs.forEach(l => {
        const id   = String(BigInt(l.topics[1] ?? '0x0'))
        const addr = `0x${l.topics[2]?.slice(26)}` as Address
        map[id] = addr
      })
      setDeployedAddresses(map)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [publicClient])

  useEffect(() => { loadProposals() }, [loadProposals])

  useEffect(() => {
    const unwatch = publicClient.watchContractEvent({
      address: FACTORY_ADDRESS, abi: FACTORY_ABI,
      eventName: 'ProposalCreated',
      onLogs: () => loadProposals(),
    })
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
        domain: {
          name: 'MultisigFactory',
          version: '2',
          chainId: BigInt(process.env.NEXT_PUBLIC_CHAIN_ID!),
          verifyingContract: FACTORY_ADDRESS,
        },
        types: {
          DeployContract: [
            { name: 'signer1',      type: 'address' },
            { name: 'signer2',      type: 'address' },
            { name: 'bytecodeHash', type: 'bytes32'  },
            { name: 'labelHash',    type: 'bytes32'  },
            { name: 'nonce',        type: 'uint256'  },
            { name: 'chainId',      type: 'uint256'  },
          ],
        },
        primaryType: 'DeployContract',
        message: {
          signer1:      SIGNER_1_ADDRESS as Address,
          signer2:      SIGNER_2_ADDRESS as Address,
          bytecodeHash: p.bytecodeHash,
          labelHash:    keccak256(new TextEncoder().encode(p.label)) as `0x${string}`,
          nonce:        p.id,
          chainId:      BigInt(process.env.NEXT_PUBLIC_CHAIN_ID!),
        },
      })

      setStatuses(prev => ({ ...prev, [key]: 'Submitting co-signature on-chain…' }))
      const tx = await walletClient.writeContract({
        address: FACTORY_ADDRESS, abi: FACTORY_ABI,
        functionName: 'approve', args: [p.id, sig],
        account: address, chain: null,
      })

      setStatuses(prev => ({ ...prev, [key]: 'Waiting for confirmation…' }))
      const receipt = await publicClient.waitForTransactionReceipt({ hash: tx })

      const log      = receipt.logs.find(l => l.topics.length >= 3)
      const deployed = log ? `0x${log.topics[2]?.slice(26)}` as Address : null

      if (deployed) setDeployedAddresses(m => ({ ...m, [key]: deployed }))
      setStatuses(prev => ({ ...prev, [key]: `Deployed at ${deployed ?? 'unknown'}` }))
      loadProposals()
    } catch (e: unknown) {
      setStatuses(prev => ({ ...prev, [key]: `Error: ${e instanceof Error ? e.message : String(e)}` }))
    } finally {
      setPending(prev => ({ ...prev, [key]: false }))
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <Link href="/admin/dashboard" className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors">← Dashboard</Link>

      <div>
        <h1 className="text-2xl font-bold">Sign Proposals</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Signer 2 reviews and co-signs pending proposals. Contract deploys automatically once both sign.
        </p>
      </div>

      {!address ? (
        <div className="border border-[#1c2432] rounded-xl p-8 text-center space-y-3 bg-[#0d1117]">
          <p className="text-zinc-500">Connect Signer 2&apos;s wallet.</p>
          <button onClick={connect} disabled={isConnecting}
            className="bg-[#C89B00] hover:bg-[#A07A00] text-black text-sm font-bold px-4 py-2 rounded-lg disabled:opacity-50 transition-colors">
            {isConnecting ? 'Connecting…' : 'Connect Wallet'}
          </button>
        </div>
      ) : !isSigner2 ? (
        <div className="border border-red-900 rounded-xl p-5 bg-red-950/30 space-y-1">
          <p className="text-red-400 font-semibold">Wrong wallet — only Signer 2 can co-sign</p>
          <p className="text-xs text-red-500 font-mono">Expected: {SIGNER_2_ADDRESS}</p>
          <p className="text-xs text-red-500 font-mono">Connected: {address}</p>
        </div>
      ) : loading ? (
        <div className="text-center py-12 text-zinc-600">Loading proposals…</div>
      ) : proposals.length === 0 ? (
        <div className="border border-[#1c2432] rounded-xl p-10 text-center space-y-2 bg-[#0d1117]">
          <p className="text-zinc-500">No proposals yet.</p>
          <p className="text-sm text-zinc-600">
            Ask Signer 1 to go to{' '}
            <Link href="/admin/propose" className="text-[#C89B00] hover:underline">/admin/propose</Link>.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map(p => {
            const key      = String(p.id)
            const deployed = deployedAddresses[key]
            return (
              <div key={key}
                className={`border rounded-xl p-5 bg-[#0d1117] space-y-4 ${
                  p.executed ? 'border-emerald-900' : 'border-[#1c2432]'
                }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-zinc-100">{p.label}</p>
                    <p className="text-xs text-zinc-600">Proposal #{key}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    p.executed
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-900'
                      : 'bg-[#C89B00]/10 text-[#C89B00] border-[#C89B00]/30'
                  }`}>
                    {p.executed ? 'DEPLOYED' : 'PENDING'}
                  </span>
                </div>

                <div className="space-y-2 text-sm bg-[#030712] border border-[#1c2432] rounded-lg p-3">
                  <div className="flex justify-between gap-2">
                    <span className="text-zinc-600 shrink-0">Bytecode hash</span>
                    <span className="font-mono text-xs text-zinc-400 break-all">{shortenHash(p.bytecodeHash)}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-zinc-600 shrink-0">Signer 1</span>
                    <span className="font-mono text-xs text-zinc-400">{SIGNER_1_ADDRESS.slice(0,10)}…</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-zinc-600 shrink-0">Signer 2 (you)</span>
                    <span className="font-mono text-xs text-zinc-400">{SIGNER_2_ADDRESS.slice(0,10)}…</span>
                  </div>
                </div>

                {deployed && (
                  <div className="bg-emerald-950/30 border border-emerald-900 rounded-lg p-3 space-y-1">
                    <p className="text-emerald-400 text-sm font-semibold">Deployed</p>
                    <p className="font-mono text-xs text-emerald-500 break-all">{deployed}</p>
                    <a href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/address/${deployed}`}
                      target="_blank" rel="noreferrer"
                      className="text-xs text-[#C89B00] hover:underline">
                      View on Basescan ↗
                    </a>
                  </div>
                )}

                {!p.executed && (
                  <>
                    <div className="bg-[#030712] border border-[#1c2432] rounded-lg p-3 text-xs text-zinc-500">
                      <p className="text-zinc-400 font-semibold mb-1">Before signing, verify:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>The label matches what Signer 1 told you</li>
                        <li>The bytecode hash matches the compiled output you both agreed on</li>
                      </ul>
                    </div>
                    <button onClick={() => handleApprove(p)} disabled={pending[key]}
                      className="w-full bg-[#C89B00] hover:bg-[#A07A00] disabled:opacity-40 text-black font-bold py-3 rounded-lg transition-colors">
                      {pending[key] ? statuses[key] : 'Co-sign & Deploy'}
                    </button>
                  </>
                )}

                {statuses[key] && !pending[key] && (
                  <p className={`text-sm ${statuses[key].startsWith('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
                    {statuses[key]}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
