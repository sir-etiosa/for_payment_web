import { Section, Eyebrow } from "@/components/ui/Section";
import { SETTLEMENT_STEPS } from "@/lib/constants";

export function HowSettlementWorks() {
  return (
    <div id="how-it-works" className="bg-navy py-20 text-white md:py-28">
      <Section>
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">

          {/* Left */}
          <div>
            <Eyebrow className="text-gold">How it works</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-black tracking-tight sm:text-4xl">
              Simple for everyone.
              <br />
              Powerful for business.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/60">
              From customer tap to merchant payout — three steps, a few seconds.
              No bank holds, no chargebacks, no waiting.
            </p>

            {/* Testimonial */}
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
              <span className="font-display text-3xl font-black text-gold leading-none">"</span>
              <p className="mt-2 text-base leading-relaxed text-white/80">
                First Round Payments cut our fees by more than half. Setup was
                easy, and our customers love how fast it is.
              </p>
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="font-display text-sm font-bold text-white">Marcus T.</p>
                <p className="text-xs text-gold">CEO, Boutique Retail · Detroit</p>
              </div>
            </div>
          </div>

          {/* Right: steps */}
          <div className="flex flex-col gap-0">
            {SETTLEMENT_STEPS.map((step, i) => (
              <div
                key={step.n}
                className={`flex gap-5 py-7 ${i < SETTLEMENT_STEPS.length - 1 ? "border-b border-white/10" : ""}`}
              >
                <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold font-display text-sm font-black text-navy">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/55">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </Section>
    </div>
  );
}
