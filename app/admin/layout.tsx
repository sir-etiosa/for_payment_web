'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletProvider } from '@/context/WalletContext'

const navLinks = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Propose',   href: '/admin/propose'   },
  { label: 'Sign',      href: '/admin/sign'       },
]

function AdminNav() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-50 border-b border-[#0f1923] bg-[#020509]/95 backdrop-blur-md">
      {/* Scan-line shimmer */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(200,155,0,0.015)_2px,rgba(200,155,0,0.015)_4px)]" />

      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-4 h-14">
        {/* Logo + wordmark */}
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1 rounded-lg bg-[#C89B00]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            <Image
              src="/logo.png"
              alt="FOR"
              width={80}
              height={32}
              className="relative h-7 w-auto brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
              priority
            />
          </div>
          <div className="h-4 w-px bg-[#1c2432]" />
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#C89B00]/80 group-hover:text-[#C89B00] transition-colors">
            Admin Dashboard
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {navLinks.map(({ label, href }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                className={`relative px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition-all duration-200 rounded-md ${
                  active
                    ? 'text-[#C89B00] bg-[#C89B00]/8'
                    : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/4'
                }`}>
                {active && (
                  <span className="absolute inset-x-3 bottom-0 h-px bg-[#C89B00]/60" />
                )}
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

function AdminFooter() {
  return (
    <footer className="border-t border-[#0f1923] bg-[#020509] mt-16">
      <div className="mx-auto max-w-5xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="FOR"
            width={60}
            height={24}
            className="h-5 w-auto brightness-0 invert opacity-30"
          />
          <span className="text-xs text-zinc-700 font-mono">Admin · Base Mainnet · Chain 8453</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-700">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Network Live
          </span>
          <a href="https://basescan.org" target="_blank" rel="noreferrer"
            className="hover:text-zinc-400 transition-colors">
            Basescan ↗
          </a>
          <a href="/" className="hover:text-zinc-400 transition-colors">← Main Site</a>
        </div>
      </div>
    </footer>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-[#020509] text-zinc-100 font-sans">
        {/* Deep space grid background */}
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(200,155,0,0.04),transparent)]" />
        <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(15,25,35,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(15,25,35,0.8)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative z-10 flex flex-col min-h-screen">
          <AdminNav />
          <main className="flex-1">{children}</main>
          <AdminFooter />
        </div>
      </div>
    </WalletProvider>
  )
}
