import { Section, Eyebrow } from "@/components/ui/Section";
import { MERCHANT_ONBOARDING } from "@/lib/constants";

export function MerchantOnboardingSteps() {
  return (
    <Section className="py-20 md:py-24">
      <div className="mb-12 text-center">
        <Eyebrow>How to get started</Eyebrow>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          From application to live payments in four steps.
        </h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {MERCHANT_ONBOARDING.map((step) => (
          <div key={step.n} className="relative pl-4">
            <div className="absolute left-0 top-0.5 h-5 w-0.5 rounded-full bg-settle" />
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-settle">{step.n}</p>
            <h3 className="mt-2 font-display text-base font-semibold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate">{step.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
