'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletProvider } from '@/context/WalletContext'
import { SITE } from '@/lib/constants'

const navLinks = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Propose',   href: '/admin/propose'   },
  { label: 'Sign',      href: '/admin/sign'       },
]

const footerCols = [
  {
    heading: 'For Merchants',
    links: [
      { label: 'Overview',        href: '/merchants'          },
      { label: 'Pricing',         href: '/merchants#pricing'  },
      { label: 'Merchant Tools',  href: '/merchants#tools'    },
    ],
  },
  {
    heading: 'Products',
    links: [
      { label: 'Wallet (Android)', href: 'https://play.google.com/store/apps/details?id=com.firstround.wallet&pli=1', external: true },
      { label: 'Payments',         href: '/#payments' },
      { label: 'Cards',            href: '/#cards'    },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '/#about'   },
      { label: 'Contact',  href: '/#contact' },
      { label: 'Privacy',  href: '/privacy-policy' },
    ],
  },
]

function AdminNav() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-50 border-b border-[#0f1923] bg-[#020509]/95 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(200,155,0,0.015)_2px,rgba(200,155,0,0.015)_4px)]" />
      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-4 h-14">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1 rounded-lg bg-[#C89B00]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            <Image src="/logo.png" alt="FOR" width={80} height={32}
              className="relative h-7 w-auto brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
              priority />
          </div>
          <div className="h-4 w-px bg-[#1c2432]" />
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#C89B00]/80 group-hover:text-[#C89B00] transition-colors">
            Admin Dashboard
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {navLinks.map(({ label, href }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                className={`relative px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition-all duration-200 rounded-md ${
                  active ? 'text-[#C89B00] bg-[#C89B00]/8' : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/4'
                }`}>
                {active && <span className="absolute inset-x-3 bottom-0 h-px bg-[#C89B00]/60" />}
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
    <footer className="mt-16 border-t border-[#0f1923] bg-[#020509]">
      {/* Scan-line */}
      <div className="pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C89B00]/20 to-transparent" />

      <div className="mx-auto max-w-5xl px-4 pt-10 pb-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">

          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1 space-y-4">
            <Link href="/">
              <Image src="/logo.png" alt="FirstRound" width={90} height={36}
                className="h-8 w-auto brightness-0 invert opacity-60 hover:opacity-90 transition-opacity" />
            </Link>
            <p className="text-xs font-mono text-zinc-700 leading-relaxed">
              Payment infrastructure<br />for real-world commerce.
            </p>
            <div className="space-y-0.5 text-[10px] font-mono text-zinc-700">
              <p>{SITE.email}</p>
              <p>{SITE.phone}</p>
            </div>
            {/* Network status */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>BASE MAINNET</span>
            </div>
          </div>

          {/* Link columns */}
          {footerCols.map(col => (
            <div key={col.heading} className="space-y-3">
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-600">{col.heading}</p>
              <ul className="space-y-2">
                {col.links.map(({ label, href, external }) => (
                  <li key={label}>
                    {external ? (
                      <a href={href} target="_blank" rel="noreferrer"
                        className="text-xs font-mono text-zinc-600 hover:text-[#C89B00] transition-colors">
                        {label}
                      </a>
                    ) : (
                      <Link href={href}
                        className="text-xs font-mono text-zinc-600 hover:text-[#C89B00] transition-colors">
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-[#0f1923] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] font-mono text-zinc-700">
            © {new Date().getFullYear()} {SITE.name}, Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            {[
              { label: 'Basescan ↗', href: 'https://basescan.org', external: true },
              { label: 'Main Site',  href: '/' },
              { label: 'Privacy',    href: '/privacy-policy' },
            ].map(({ label, href, external }) => (
              external
                ? <a key={label} href={href} target="_blank" rel="noreferrer"
                    className="text-[10px] font-mono text-zinc-700 hover:text-[#C89B00] transition-colors">{label}</a>
                : <Link key={label} href={href}
                    className="text-[10px] font-mono text-zinc-700 hover:text-[#C89B00] transition-colors">{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-[#020509] text-zinc-100 font-sans">
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
