import { Section, Eyebrow } from "@/components/ui/Section";
import { SETTLEMENT_STEPS } from "@/lib/constants";

export function HowSettlementWorks() {
  return (
    <div id="how-it-works" className="relative bg-ink py-20 md:py-28">
      {/* Green glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute bottom-0 right-0 h-[400px] w-[600px] opacity-[0.06]"
          style={{
            background: "radial-gradient(ellipse at bottom right, #22C55E 0%, transparent 65%)",
          }}
        />
      </div>

      <Section className="relative">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">

          {/* Left: label + headline */}
          <div>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Simple for everyone.
              <br />
              Powerful for business.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/50">
              From customer tap to merchant payout — three steps, a few seconds.
              No bank holds, no chargebacks, no waiting.
            </p>

            {/* Testimonial card */}
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <span className="font-display text-3xl text-token leading-none">"</span>
              <p className="mt-2 text-base leading-relaxed text-white/80">
                First Round Payments cut our fees by more than half. Setup was
                easy, and our customers love how fast it is.
              </p>
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="font-display text-sm font-semibold text-white">Marcus T.</p>
                <p className="font-mono text-xs text-settle">CEO, Boutique Retail</p>
              </div>
            </div>
          </div>

          {/* Right: numbered steps */}
          <div className="flex flex-col gap-0">
            {SETTLEMENT_STEPS.map((step, i) => (
              <div
                key={step.n}
                className={`flex gap-5 py-7 ${i < SETTLEMENT_STEPS.length - 1 ? "border-b border-white/10" : ""}`}
              >
                {/* Step number circle */}
                <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-settle/40 bg-settle/10 font-mono text-xs font-medium text-settle">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/50">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </Section>
    </div>
  );
}
