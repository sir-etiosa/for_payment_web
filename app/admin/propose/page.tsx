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

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-[#0e1b35] rounded-xl bg-[#091222] shadow-[0_0_0_1px_rgba(21,46,116,0.06),inset_0_1px_0_rgba(255,255,255,0.02)] ${className}`}>
      {children}
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-sans font-semibold text-[#3a527a] uppercase tracking-wide">{label}</p>
      <p className={`text-xs bg-[#060c1a] border border-[#0e1b35] px-3 py-2 rounded-lg break-all text-[#7a95c0] ${mono ? 'font-mono' : 'font-sans'}`}>
        {value}
      </p>
    </div>
  )
}

export default function ProposePage() {
  const { address, walletClient, publicClient, connect, isConnecting } = useWallet()
  const [mode, setMode]                   = useState<Mode>('forswap')
  const [proposalCount, setProposalCount] = useState<bigint>(0n)
  const [status, setStatus]               = useState('')
  const [isPending, setIsPending]         = useState(false)
  const [proposalId, setProposalId]       = useState<bigint | null>(null)
  const [customLabel, setCustomLabel]     = useState('')
  const [customBytecode, setCustomBytecode] = useState('')

  const isSigner1 = address?.toLowerCase() === SIGNER_1_ADDRESS.toLowerCase()

  useEffect(() => {
    publicClient.readContract({ address: FACTORY_ADDRESS, abi: FACTORY_ABI, functionName: 'proposalCount' })
      .then(c => setProposalCount(c as bigint)).catch(console.error)
  }, [publicClient])

  function buildForSwapBytecode(): `0x${string}` {
    const args = encodeAbiParameters(parseAbiParameters('address, address, address, address'),
      [SIGNER_1_ADDRESS, SIGNER_2_ADDRESS, FOR_TOKEN_ADDRESS, USDC_ADDRESS])
    return concat([FORSWAP_CREATION_BYTECODE, args]) as `0x${string}`
  }

  async function handlePropose() {
    if (!walletClient || !address) return
    let bytecode: `0x${string}`, label: string
    if (mode === 'forswap') {
      bytecode = buildForSwapBytecode(); label = 'ForSwap v1'
    } else {
      if (!customLabel.trim()) { setStatus('Enter a label.'); return }
      if (!customBytecode.trim().startsWith('0x')) { setStatus('Bytecode must start with 0x'); return }
      bytecode = customBytecode.trim() as `0x${string}`; label = customLabel.trim()
    }
    const bytecodeHash = keccak256(bytecode)
    setIsPending(true); setStatus('Sign the EIP-712 message in your wallet…')
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
          bytecodeHash, labelHash: keccak256(new TextEncoder().encode(label)) as `0x${string}`,
          nonce: proposalCount, chainId: BigInt(process.env.NEXT_PUBLIC_CHAIN_ID!),
        },
      })
      setStatus('Submitting proposal on-chain…')
      const tx = await walletClient.writeContract({ address: FACTORY_ADDRESS, abi: FACTORY_ABI, functionName: 'propose', args: [bytecode, label, sig], account: address, chain: null })
      setStatus('Waiting for confirmation…')
      await publicClient.waitForTransactionReceipt({ hash: tx })
      setProposalId(proposalCount); setProposalCount(c => c + 1n)
      setStatus('Proposal submitted. Signer 2 can now co-sign at /admin/sign.')
    } catch (e: unknown) {
      setStatus(`Error: ${e instanceof Error ? e.message : String(e)}`)
    } finally { setIsPending(false) }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-5">
      <Link href="/admin/dashboard" className="text-[10px] font-sans text-[#3a527a] hover:text-[#a8c0e8] transition-colors tracking-widest uppercase">
        ← Dashboard
      </Link>

      {!address ? (
        <Card className="p-8 text-center space-y-4">
          <p className="text-[#4a6585] font-sans text-sm">Connect Signer 1&apos;s wallet to propose.</p>
          <button onClick={connect} disabled={isConnecting}
            className="bg-[#152e74] hover:bg-[#0d1e52] text-white text-xs font-sans font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50 transition-colors tracking-wide">
            {isConnecting ? 'Connecting…' : 'Connect Wallet'}
          </button>
        </Card>
      ) : !isSigner1 ? (
        <Card className="p-5 border-red-900/50 space-y-1">
          <p className="text-red-400 font-sans text-sm font-semibold">⊘ Wrong wallet — only Signer 1 can propose</p>
          <p className="text-[10px] font-mono text-red-600">Expected: {SIGNER_1_ADDRESS}</p>
          <p className="text-[10px] font-mono text-red-600">Connected: {address}</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Mode toggle */}
          <div className="flex rounded-lg border border-[#0e1b35] overflow-hidden">
            {(['forswap', 'custom'] as Mode[]).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 text-[10px] font-sans font-bold tracking-widest uppercase transition-colors ${
                  mode === m ? 'bg-[#152e74] text-white' : 'bg-[#091222] text-[#3a527a] hover:text-[#a8c0e8]'
                }`}>
                {m === 'forswap' ? 'ForSwap Template' : 'Custom Contract'}
              </button>
            ))}
          </div>

          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-sans font-semibold tracking-[0.18em] uppercase text-[#3a527a]">Proposal #{String(proposalCount)}</p>
              <span className="text-[10px] font-mono text-[#2d4166]">next nonce</span>
            </div>

            {mode === 'forswap' ? (
              <div className="space-y-2">
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
                  <label className="text-[10px] font-sans font-semibold text-[#3a527a] uppercase tracking-wide">Label</label>
                  <input value={customLabel} onChange={e => setCustomLabel(e.target.value)}
                    placeholder="e.g. MyContract v1"
                    className="w-full bg-[#060c1a] border border-[#0e1b35] focus:border-[#152e74]/60 rounded-lg px-3 py-2 text-sm font-sans text-[#e4eeff] focus:outline-none placeholder-[#2d4166] transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-sans font-semibold text-[#3a527a] uppercase tracking-wide">Bytecode (hex)</label>
                  <textarea value={customBytecode} onChange={e => setCustomBytecode(e.target.value)}
                    placeholder="0x..."  rows={5}
                    className="w-full bg-[#060c1a] border border-[#0e1b35] focus:border-[#152e74]/60 rounded-lg px-3 py-2 text-xs font-mono text-[#e4eeff] focus:outline-none resize-none placeholder-[#2d4166] transition-colors" />
                  <p className="text-[10px] font-mono text-[#2d4166]">
                    <code className="text-[#4a6585]">forge inspect YourContract bytecode</code> + ABI-encoded constructor args
                  </p>
                </div>
              </div>
            )}

            <div className="border-t border-[#0e1b35] pt-4 space-y-3">
              <div className="bg-[#060c1a] border border-[#0e1b35] rounded-lg p-3 space-y-1.5">
                <p className="text-[10px] font-sans font-semibold text-[#4a6585] uppercase tracking-wide">Execution flow</p>
                <ol className="text-[10px] font-sans text-[#3a527a] space-y-1 list-decimal list-inside leading-relaxed">
                  <li>MetaMask shows EIP-712 typed data — you sign the bytecodeHash + label</li>
                  <li>Proposal stored on-chain, <span className="font-mono text-[#7a95c0]">ProposalCreated</span> event emitted</li>
                  <li>Signer 2 sees it live at /admin/sign and co-signs</li>
                  <li>Factory deploys the contract via CREATE opcode</li>
                </ol>
              </div>

              <button onClick={handlePropose} disabled={isPending}
                className="w-full bg-[#C89B00] hover:bg-[#A07A00] disabled:opacity-30 text-black font-sans font-bold py-3 rounded-lg transition-colors text-sm tracking-wide">
                {isPending ? status : 'Sign & Propose'}
              </button>

              {status && !isPending && (
                <p className={`text-xs font-mono ${proposalId !== null ? 'text-emerald-400' : 'text-[#4a6585]'}`}>
                  {status}
                </p>
              )}

              {proposalId !== null && (
                <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-lg p-3 space-y-2 shadow-[0_0_12px_rgba(52,211,153,0.05)]">
                  <p className="text-emerald-400 font-mono text-xs">⊙ Proposal #{String(proposalId)} submitted on-chain</p>
                  <Link href="/admin/sign"
                    className="inline-block text-[10px] font-sans font-semibold bg-emerald-900/40 hover:bg-emerald-900/70 border border-emerald-800/50 text-emerald-300 px-3 py-1.5 rounded-lg transition-colors tracking-wide">
                    Go to Sign →
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
