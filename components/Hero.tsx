import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { SettlementVisual } from "@/components/SettlementVisual";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-void">
      {/* Subtle green radial glow behind headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-0 h-[700px] w-[700px] opacity-[0.08]"
        style={{
          background: "radial-gradient(ellipse at top left, #22C55E 0%, transparent 65%)",
        }}
      />

      {/* Ledger grid overlay */}
      <div aria-hidden className="pointer-events-none absolute inset-0 ledger-grid" />

      <Section className="relative pt-20 pb-28 md:pt-28 md:pb-36">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">

          {/* ── Left: copy ── */}
          <div className="animate-fade-up">
            <p className="eyebrow">Detroit-Built · Global Payments</p>

            <h1 className="mt-5 font-display text-[3rem] font-bold leading-[1.0] tracking-tight text-white sm:text-[3.8rem] lg:text-[4.5rem]">
              Payment
              <br />
              infrastructure
              <br />
              built for real
              <br />
              <span className="text-settle">commerce.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/50">
              First Round Payments is a non-custodial, multi-chain network that
              helps businesses accept, send, and settle payments with lower fees
              and instant settlement.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/merchants#apply" size="lg">
                Get the Wallet →
              </ButtonLink>
              <ButtonLink
                href="/merchants"
                variant="ghost"
                size="lg"
                className="border-white/25 text-white"
              >
                For Merchants
              </ButtonLink>
            </div>

            {/* Trust badge */}
            <div className="mt-8 flex items-center gap-2.5">
              <svg
                className="h-4 w-4 shrink-0 text-settle"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
              <span className="font-mono text-xs text-white/40">
                Non-Custodial. Secure. Private.
              </span>
              <span className="font-mono text-xs text-white/25">
                You own your keys.
              </span>
            </div>
          </div>

          {/* ── Right: live settlement widget ── */}
          <div className="animate-fade-up [animation-delay:160ms]">
            {/* Widget gets a stronger shadow on dark bg */}
            <div className="shadow-lift rounded-2xl">
              <SettlementVisual />
            </div>

            {/* Detroit origin stamp */}
            <div className="mt-5 flex items-end justify-between px-1">
              <div>
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-white/20">
                  Detroit Built.
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/15">
                  Payments for the people.
                </p>
              </div>
              <p className="font-mono text-[10px] tabular-nums text-white/15">
                42.3314°N 83.0458°W
              </p>
            </div>
          </div>

        </div>
      </Section>

      {/* Fade into next (light) section */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-20"
        style={{ background: "linear-gradient(to bottom, transparent, #F4F5F7)" }}
      />
    </div>
  );
}
