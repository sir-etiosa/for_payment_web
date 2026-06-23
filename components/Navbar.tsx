import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line-dark bg-ink/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="First Round"
            width={120}
            height={48}
            className="h-10 w-auto brightness-0 invert"
            priority
          />
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-7 md:flex">
          {[
            { label: "For Merchants", href: "/merchants" },
            { label: "How it works", href: "/#how-it-works" },
            { label: "Security", href: "/#security" },
            { label: "Contact", href: "/#contact" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm text-white/60 transition hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/merchants#apply"
          className="rounded-lg border border-settle px-4 py-2 font-mono text-xs font-medium uppercase tracking-[0.12em] text-settle transition hover:bg-settle hover:text-void"
        >
          Get started
        </Link>
      </div>
    </header>
  );
}
