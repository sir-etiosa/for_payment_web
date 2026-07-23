'use client'

import { WalletProvider } from '@/context/WalletContext'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-[#030712] text-zinc-100 font-sans">
        {/* Minimal admin top bar */}
        <nav className="border-b border-[#1c2432] bg-[#030712]/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#C89B00] font-bold font-mono text-sm tracking-widest uppercase">FOR</span>
              <span className="text-[#1c2432] text-xs">|</span>
              <span className="text-zinc-500 text-xs tracking-wider uppercase">Admin</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-600">
              <a href="/admin/dashboard" className="hover:text-zinc-300 transition-colors">Dashboard</a>
              <a href="/admin/propose" className="hover:text-zinc-300 transition-colors">Propose</a>
              <a href="/admin/sign" className="hover:text-zinc-300 transition-colors">Sign</a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </div>
    </WalletProvider>
  )
}
