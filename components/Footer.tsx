import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/constants";

const NAV_COLS: { heading: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    heading: "For Merchants",
    links: [
      { label: "Overview", href: "/merchants" },
      { label: "Pricing", href: "/merchants#pricing" },
      { label: "Success Stories", href: "/merchants#stories" },
      { label: "Merchant Tools", href: "/merchants#tools" },
    ],
  },
  {
    heading: "Products",
    links: [
      { label: "Wallet (Android)", href: "https://play.google.com/store/apps/details?id=com.firstround.wallet&pli=1", external: true },
      { label: "Payments", href: "/#payments" },
      { label: "Cards", href: "/#cards" },
      { label: "Payouts", href: "/#payouts" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "Documentation", href: "/#docs" },
      { label: "SDKs", href: "/#sdks" },
      { label: "API Reference", href: "/#api" },
      { label: "Support", href: "/#support" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/#about" },
      { label: "Careers", href: "/#careers" },
      { label: "Press", href: "/#press" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog", href: "/#blog" },
      { label: "Help Center", href: "/#help" },
      { label: "Docs", href: "/#docs" },
      { label: "Privacy", href: "/privacy-policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Partners strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.16em] text-white/30">
            Trusted by Innovators
          </p>
          <div className="flex flex-wrap items-center gap-10">
            {["Circle", "Coinbase", "Solana", "AWS"].map((name) => (
              <span key={name} className="font-display text-base font-bold tracking-wide text-white/30">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Nav columns */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="First Round"
                width={100}
                height={40}
                className="h-9 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-white/40">
              Payment infrastructure for real-world commerce.
            </p>
            <p className="mt-3 text-xs text-white/30">
              {SITE.email}<br />{SITE.phone}
            </p>

            {/* Google Play badge */}
            <a
              href="https://play.google.com/store/apps/details?id=com.firstround.wallet&pli=1"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 transition hover:border-white/30 hover:bg-white/10"
            >
              {/* Google Play icon */}
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76a2 2 0 01-.93-.24 2 2 0 01-1-1.76V2.24A2 2 0 012.25.48a2 2 0 01.93-.24l11.44 11.52zM20.13 13.4l-2.37 1.37-2.56-2.57 2.56-2.57 2.38 1.38a1.4 1.4 0 010 2.39zM4.88 23.27L15.2 12.95l-2.56-2.57L4.88.73z" />
              </svg>
              <div>
                <p className="text-[10px] leading-none text-white/40">Get it on</p>
                <p className="mt-0.5 text-sm font-semibold leading-none text-white/80">Google Play</p>
              </div>
            </a>
          </div>

          {/* Link columns */}
          {NAV_COLS.map((col) => (
            <div key={col.heading}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map(({ label, href, external }) => (
                  <li key={label}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/40 transition hover:text-white"
                      >
                        {label}
                      </a>
                    ) : (
                      <Link href={href} className="text-sm text-white/40 transition hover:text-white">
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
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} {SITE.name}, Inc. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service", "Legal"].map((t) => (
              <Link key={t} href="/privacy-policy" className="text-xs text-white/25 hover:text-white/60 transition">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
