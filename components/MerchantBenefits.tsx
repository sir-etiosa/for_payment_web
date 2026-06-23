import { Section, Eyebrow } from "@/components/ui/Section";
import { MERCHANT_BENEFITS } from "@/lib/constants";

export function MerchantBenefits() {
  return (
    <div
      className="py-20 md:py-28"
      style={{ background: "linear-gradient(135deg, #FFFBF0 0%, #F9FAFB 60%, #EEF2FF 100%)" }}
    >
      <Section>
        <div className="mb-14 text-center">
          <Eyebrow>Why merchants choose FirstRound</Eyebrow>
          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-navy sm:text-5xl lg:text-6xl">
            Better economics.
            <br />
            Real-time settlement.
          </h1>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MERCHANT_BENEFITS.map((b) => (
            <div
              key={b.label}
              className="rounded-2xl border border-line bg-white p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <p className="font-display text-3xl font-black text-gold">{b.stat}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate">
                {b.label}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate">{b.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
