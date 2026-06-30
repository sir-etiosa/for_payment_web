import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";

export function MerchantCTA() {
  return (
    <div className="bg-navy py-20 md:py-24">
      <Section>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-8 py-14 md:px-14 md:py-16">
          <div className="text-center">
            <p className="eyebrow justify-center text-gold">Ready to get started</p>
            <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
              Your business deserves{" "}
              <span className="text-gold">better payments.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/60">
              Join merchants already cutting fees and getting paid in seconds.
              No commitment, no upfront costs — most verifications clear within
              two business days.
            </p>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <ButtonLink
                href="/merchants#apply"
                size="lg"
                className="bg-gold text-navy hover:bg-gold-dark hover:text-navy"
              >
                Apply as a merchant
              </ButtonLink>
              <ButtonLink
                href="/#contact"
                variant="ghost"
                size="lg"
                className="border-white/30 text-white hover:bg-white hover:text-navy"
              >
                Talk to our team
              </ButtonLink>
            </div>
            <p className="mt-6 text-xs text-white/30">
              Non-custodial · KYC verified · ISO 20022 aligned
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
