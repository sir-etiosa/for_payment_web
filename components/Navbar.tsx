"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "For Merchants", href: "/merchants" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Security", href: "/#security" },
    { label: "Contact", href: "/#contact" },
    { label: "$FOR Coin ↗", href: "https://www.firstroundcoin.com", external: true },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "border-b border-line"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="First Round"
            width={120}
            height={48}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map(({ label, href, external }) =>
            external ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1 font-sans text-sm font-semibold text-token transition hover:text-navy"
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                href={href}
                className="group relative py-1 font-sans text-sm font-semibold text-ink transition hover:text-navy"
              >
                {label}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gold transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            )
          )}
        </nav>

        {/* CTA */}
        <div className="hidden sm:block">
          <Link
            href="/merchants#apply"
            className="rounded-xl bg-navy px-5 py-2.5 font-sans text-sm font-bold text-white shadow transition hover:bg-navy-deep hover:shadow-lg"
          >
            Get started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden rounded-lg p-2 text-ink hover:bg-paper transition"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-line bg-white px-4 pb-4 lg:hidden">
          {links.map(({ label, href, external }) =>
            external ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="block py-3 font-sans font-semibold text-token hover:text-navy"
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 font-sans font-semibold text-ink hover:text-navy"
              >
                {label}
              </Link>
            )
          )}
          <Link
            href="/merchants#apply"
            className="mt-3 block rounded-xl bg-navy py-3 text-center font-sans font-bold text-white"
            onClick={() => setMenuOpen(false)}
          >
            Get started
          </Link>
        </div>
      )}
    </header>
  );
}
