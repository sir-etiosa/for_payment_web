import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";

export function MerchantCTA() {
  return (
    <div className="relative bg-ink py-20 md:py-24">
      {/* Gold glow accent top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[300px] w-[500px] opacity-[0.07]"
        style={{
          background: "radial-gradient(ellipse at top right, #C9A84C 0%, transparent 65%)",
        }}
      />

      <Section className="relative">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-void px-8 py-14 md:px-14 md:py-16">
          {/* Inner green glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              background: "radial-gradient(ellipse at bottom left, #22C55E 0%, transparent 60%)",
            }}
          />

          <div className="relative text-center">
            <p className="eyebrow justify-center">Ready to go live</p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Accept payments that{" "}
              <span className="text-settle">settle in seconds.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/50">
              Apply to become a verified merchant. No commitment required, no
              upfront costs — most verifications clear within two business days.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <ButtonLink href="/merchants#apply" size="lg">
                Start merchant onboarding
              </ButtonLink>
              <ButtonLink
                href="/#contact"
                variant="ghost"
                size="lg"
                className="border-white/25 text-white"
              >
                Talk to our team
              </ButtonLink>
            </div>

            <p className="mt-6 font-mono text-xs text-white/30">
              Non-custodial · KYB verified · ISO 20022 aligned
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
