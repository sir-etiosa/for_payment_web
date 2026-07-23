'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletProvider } from '@/context/WalletContext'
import { useWallet } from '@/context/WalletContext'
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
    <header className="sticky top-0 z-50 border-b border-[#0e1b35] bg-[#060c1a]/96 backdrop-blur-md">
      {/* Subtle scanline */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(21,46,116,0.03)_2px,rgba(21,46,116,0.03)_4px)]" />
      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-4 h-14">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1 rounded-lg bg-[#152e74]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            <Image src="/logo.png" alt="FOR" width={80} height={32}
              className="relative h-7 w-auto brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity"
              priority />
          </div>
          <div className="h-4 w-px bg-[#162444]" />
          <span className="font-sans text-xs font-semibold tracking-[0.18em] uppercase text-[#7a9cc8] group-hover:text-[#a8c0e8] transition-colors">
            Admin
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {navLinks.map(({ label, href }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                className={`relative px-3 py-1.5 text-xs font-sans font-semibold tracking-wide transition-all duration-200 rounded-md ${
                  active
                    ? 'text-[#e4eeff] bg-[#152e74]/15'
                    : 'text-[#4a6585] hover:text-[#a8c0e8] hover:bg-[#152e74]/8'
                }`}>
                {active && <span className="absolute inset-x-3 bottom-0 h-px bg-white/25" />}
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
    <footer className="mt-16 border-t border-[#0e1b35] bg-[#050b19]">
      <div className="pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#152e74]/20 to-transparent" />

      <div className="mx-auto max-w-5xl px-4 pt-10 pb-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">

          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1 space-y-4">
            <Link href="/">
              <Image src="/logo.png" alt="FirstRound" width={90} height={36}
                className="h-8 w-auto brightness-0 invert opacity-50 hover:opacity-80 transition-opacity" />
            </Link>
            <p className="text-xs font-sans text-[#3a527a] leading-relaxed">
              Payment infrastructure<br />for real-world commerce.
            </p>
            <div className="space-y-0.5 text-[10px] font-mono text-[#3a527a]">
              <p>{SITE.email}</p>
              <p>{SITE.phone}</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#2d4166]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>BASE MAINNET</span>
            </div>
          </div>

          {/* Link columns */}
          {footerCols.map(col => (
            <div key={col.heading} className="space-y-3">
              <p className="text-[10px] font-sans font-semibold tracking-[0.18em] uppercase text-[#2d4166]">{col.heading}</p>
              <ul className="space-y-2">
                {col.links.map(({ label, href, external }) => (
                  <li key={label}>
                    {external ? (
                      <a href={href} target="_blank" rel="noreferrer"
                        className="text-xs font-sans text-[#3a527a] hover:text-[#a8c0e8] transition-colors">
                        {label}
                      </a>
                    ) : (
                      <Link href={href}
                        className="text-xs font-sans text-[#3a527a] hover:text-[#a8c0e8] transition-colors">
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
        <div className="mt-10 flex flex-col gap-3 border-t border-[#0e1b35] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] font-mono text-[#2d4166]">
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
                    className="text-[10px] font-mono text-[#2d4166] hover:text-[#a8c0e8] transition-colors">{label}</a>
                : <Link key={label} href={href}
                    className="text-[10px] font-mono text-[#2d4166] hover:text-[#a8c0e8] transition-colors">{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* Falling gold stars — only visible when wallet is not connected */
function FallingStarsOverlay() {
  const { address } = useWallet()
  if (address) return null
  return (
    <div className="pointer-events-none fixed bottom-0 right-0 w-64 h-72 overflow-hidden z-0">
      <span className="star-fall-1 absolute right-16 bottom-12 text-[#C89B00] text-[11px] select-none">◆</span>
      <span className="star-fall-2 absolute right-32 bottom-24 text-[#C89B00] text-[7px] select-none">◆</span>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-[#060c1a] text-[#e4eeff] font-sans">
        {/* Deep navy radial bloom */}
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(21,46,116,0.12),transparent)]" />
        {/* Subtle grid */}
        <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(9,18,45,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(9,18,45,0.7)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative z-10 flex flex-col min-h-screen">
          <AdminNav />
          <FallingStarsOverlay />
          <main className="flex-1">{children}</main>
          <AdminFooter />
        </div>
      </div>
    </WalletProvider>
  )
}
