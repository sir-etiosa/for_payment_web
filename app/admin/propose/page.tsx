'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { type Address, encodeAbiParameters, parseAbiParameters, concat, keccak256 } from 'viem'
import { useWallet } from '@/context/WalletContext'
import {
  FACTORY_ADDRESS, FOR_TOKEN_ADDRESS, USDC_ADDRESS,
  SIGNER_1_ADDRESS, SIGNER_2_ADDRESS,
  FACTORY_ABI, FORSWAP_CREATION_BYTECODE,
} from '@/lib/contracts'

type Mode = 'forswap' | 'custom'

export default function ProposePage() {
  const { address, walletClient, publicClient, connect, isConnecting } = useWallet()

  const [mode, setMode] = useState<Mode>('forswap')
  const [proposalCount, setProposalCount] = useState<bigint>(0n)
  const [status, setStatus] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [proposalId, setProposalId] = useState<bigint | null>(null)
  const [customLabel, setCustomLabel] = useState('')
  const [customBytecode, setCustomBytecode] = useState('')

  const isSigner1 = address?.toLowerCase() === SIGNER_1_ADDRESS.toLowerCase()

  useEffect(() => {
    publicClient.readContract({
      address: FACTORY_ADDRESS, abi: FACTORY_ABI, functionName: 'proposalCount',
    }).then(c => setProposalCount(c as bigint)).catch(console.error)
  }, [publicClient])

  function buildForSwapBytecode(): `0x${string}` {
    const constructorArgs = encodeAbiParameters(
      parseAbiParameters('address, address, address, address'),
      [SIGNER_1_ADDRESS, SIGNER_2_ADDRESS, FOR_TOKEN_ADDRESS, USDC_ADDRESS]
    )
    return concat([FORSWAP_CREATION_BYTECODE, constructorArgs]) as `0x${string}`
  }

  async function handlePropose() {
    if (!walletClient || !address) return

    let bytecode: `0x${string}`
    let label: string

    if (mode === 'forswap') {
      bytecode = buildForSwapBytecode()
      label = 'ForSwap v1'
    } else {
      if (!customLabel.trim()) { setStatus('Enter a label.'); return }
      if (!customBytecode.trim().startsWith('0x')) { setStatus('Bytecode must start with 0x'); return }
      bytecode = customBytecode.trim() as `0x${string}`
      label = customLabel.trim()
    }

    const bytecodeHash = keccak256(bytecode)
    setIsPending(true)
    setStatus('Sign the EIP-712 message in your wallet…')

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
          bytecodeHash,
          labelHash:    keccak256(new TextEncoder().encode(label)) as `0x${string}`,
          nonce:        proposalCount,
          chainId:      BigInt(process.env.NEXT_PUBLIC_CHAIN_ID!),
        },
      })

      setStatus('Submitting proposal on-chain…')
      const tx = await walletClient.writeContract({
        address: FACTORY_ADDRESS, abi: FACTORY_ABI,
        functionName: 'propose', args: [bytecode, label, sig],
        account: address, chain: null,
      })
      setStatus('Waiting for confirmation…')
      await publicClient.waitForTransactionReceipt({ hash: tx })
      setProposalId(proposalCount)
      setProposalCount(c => c + 1n)
      setStatus('Proposal submitted! Signer 2 can now co-sign at /admin/sign.')
    } catch (e: unknown) {
      setStatus(`Error: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <Link href="/admin/dashboard" className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors">← Dashboard</Link>

      <div>
        <h1 className="text-2xl font-bold">Propose Deployment</h1>
        <p className="text-zinc-500 text-sm mt-1">Signer 1 proposes a contract deployment. Signer 2 must co-sign to deploy.</p>
      </div>

      {!address ? (
        <div className="border border-[#1c2432] rounded-xl p-8 text-center space-y-3 bg-[#0d1117]">
          <p className="text-zinc-500">Connect your wallet to propose.</p>
          <button onClick={connect} disabled={isConnecting}
            className="bg-[#C89B00] hover:bg-[#A07A00] text-black text-sm font-bold px-4 py-2 rounded-lg disabled:opacity-50 transition-colors">
            {isConnecting ? 'Connecting…' : 'Connect Wallet'}
          </button>
        </div>
      ) : !isSigner1 ? (
        <div className="border border-red-900 rounded-xl p-5 bg-red-950/30 space-y-1">
          <p className="text-red-400 font-semibold">Wrong wallet — only Signer 1 can propose</p>
          <p className="text-xs text-red-500 font-mono">Expected: {SIGNER_1_ADDRESS}</p>
          <p className="text-xs text-red-500 font-mono">Connected: {address}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Mode toggle */}
          <div className="flex rounded-lg border border-[#1c2432] overflow-hidden">
            <button onClick={() => setMode('forswap')}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                mode === 'forswap' ? 'bg-[#C89B00] text-black' : 'bg-[#0d1117] text-zinc-500 hover:text-zinc-300'
              }`}>
              ForSwap Template
            </button>
            <button onClick={() => setMode('custom')}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                mode === 'custom' ? 'bg-[#C89B00] text-black' : 'bg-[#0d1117] text-zinc-500 hover:text-zinc-300'
              }`}>
              Custom Contract
            </button>
          </div>

          <div className="border border-[#1c2432] rounded-xl p-5 bg-[#0d1117] space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-600 uppercase tracking-wider font-semibold">Proposal #{String(proposalCount)}</p>
              <span className="text-xs text-zinc-700">next nonce</span>
            </div>

            {mode === 'forswap' ? (
              <div className="space-y-3">
                <Row label="Label"     value="ForSwap v1" />
                <Row label="FOR Token" value={FOR_TOKEN_ADDRESS} mono />
                <Row label="USDC"      value={USDC_ADDRESS} mono />
                <Row label="Signer 1"  value={SIGNER_1_ADDRESS} mono />
                <Row label="Signer 2"  value={SIGNER_2_ADDRESS} mono />
                <Row label="Rate"      value="0.2 USDC = 1 FOR (fixed)" />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-600">Label</label>
                  <input value={customLabel} onChange={e => setCustomLabel(e.target.value)}
                    placeholder="e.g. MyContract v1"
                    className="w-full bg-[#030712] border border-[#1c2432] rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-[#C89B00]/50 placeholder-zinc-700" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-600">Bytecode (hex)</label>
                  <textarea value={customBytecode} onChange={e => setCustomBytecode(e.target.value)}
                    placeholder="0x..."
                    rows={5}
                    className="w-full bg-[#030712] border border-[#1c2432] rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-[#C89B00]/50 resize-none placeholder-zinc-700" />
                  <p className="text-xs text-zinc-600">
                    <code className="text-zinc-400">forge inspect YourContract bytecode</code>, then append ABI-encoded constructor args.
                  </p>
                </div>
              </div>
            )}

            <div className="border-t border-[#1c2432] pt-4 space-y-3">
              <div className="bg-[#030712] border border-[#1c2432] rounded-lg p-3 text-xs text-zinc-500 space-y-1">
                <p className="font-semibold text-zinc-400">What happens:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>MetaMask shows an EIP-712 typed data request</li>
                  <li>Proposal stored on-chain, <code>ProposalCreated</code> event emitted</li>
                  <li>Signer 2 sees it live at /admin/sign and co-signs</li>
                  <li>Factory deploys the contract</li>
                </ol>
              </div>

              <button onClick={handlePropose} disabled={isPending}
                className="w-full bg-[#C89B00] hover:bg-[#A07A00] disabled:opacity-40 text-black font-bold py-3 rounded-lg transition-colors">
                {isPending ? status : 'Sign & Propose'}
              </button>

              {status && !isPending && (
                <p className={`text-sm ${proposalId !== null ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {status}
                </p>
              )}

              {proposalId !== null && (
                <div className="bg-emerald-950/40 border border-emerald-900 rounded-lg p-3 space-y-2">
                  <p className="text-emerald-400 font-semibold text-sm">Proposal #{String(proposalId)} created</p>
                  <Link href="/admin/sign"
                    className="inline-block text-xs bg-emerald-900 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg transition-colors">
                    Go to /admin/sign →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-zinc-600">{label}</p>
      <p className={`text-sm bg-[#030712] border border-[#1c2432] px-3 py-1.5 rounded-lg break-all text-zinc-300 ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </p>
    </div>
  )
}
