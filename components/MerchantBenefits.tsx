import { Section, Eyebrow } from "@/components/ui/Section";
import { MERCHANT_BENEFITS } from "@/lib/constants";

export function MerchantBenefits() {
  return (
    <div className="relative overflow-hidden bg-void py-20 md:py-28">
      {/* Green glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-0 h-[500px] w-[600px] opacity-[0.07]"
        style={{
          background: "radial-gradient(ellipse at top right, #22C55E 0%, transparent 65%)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 ledger-grid" />

      <Section className="relative">
        <div className="mb-14 text-center">
          <Eyebrow>Why merchants choose FirstRound</Eyebrow>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Better economics.
            <br />
            <span className="text-settle">Real-time</span> settlement.
          </h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MERCHANT_BENEFITS.map((b) => (
            <div
              key={b.label}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm"
            >
              <p className="font-mono text-3xl font-bold tabular-nums text-settle">{b.stat}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
                {b.label}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{b.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
