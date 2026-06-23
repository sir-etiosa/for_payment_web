import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/constants";

const NAV_COLS = [
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
      { label: "Wallet", href: "/#wallet" },
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
    <footer className="bg-void border-t border-line-dark">
      {/* Partners strip */}
      <div className="border-b border-line-dark">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
            Trusted by Innovators
          </p>
          <div className="flex flex-wrap items-center gap-10 text-white/25">
            {["Circle", "Coinbase", "Solana", "AWS"].map((name) => (
              <span key={name} className="font-display text-base font-semibold tracking-wide">
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
            <p className="mt-3 text-xs leading-relaxed text-white/35">
              Payment infrastructure for real-world commerce.
            </p>
            {/* Social */}
            <div className="mt-4 flex gap-3 text-white/30">
              {["𝕏", "in", "▶"].map((s) => (
                <span key={s} className="cursor-pointer font-mono text-sm hover:text-white/60 transition">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {NAV_COLS.map((col) => (
            <div key={col.heading}>
              <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white/40">
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-white/40 transition hover:text-white/80"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-line-dark pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-white/25">
            © {new Date().getFullYear()} {SITE.name}, Inc. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service", "Legal"].map((t) => (
              <Link
                key={t}
                href="/privacy-policy"
                className="font-mono text-xs text-white/25 hover:text-white/50 transition"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
