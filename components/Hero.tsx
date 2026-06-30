import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { SettlementVisual } from "@/components/SettlementVisual";

export function Hero() {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #E4EDFF 0%, #EEF4FF 50%, #DDE8FF 100%)",
      }}
    >
      {/* Decorative circles (like old site) */}
      <div className="pointer-events-none absolute top-16 right-16 h-24 w-24 rounded-full bg-gold/10" />
      <div className="pointer-events-none absolute bottom-24 left-8 h-16 w-16 rounded-full bg-navy/5" />
      <div className="pointer-events-none absolute top-1/2 right-1/4 h-10 w-10 rounded-full bg-gold/15" />

      <Section className="relative pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">

          {/* Left — copy */}
          <div className="animate-fade-up">
            <p className="eyebrow">Merchant Payment Network · Detroit-Built</p>

            <h1 className="mt-4 font-display text-[2.8rem] font-black leading-[1.05] tracking-tight text-navy sm:text-5xl lg:text-6xl">
              <span className="relative inline-block">
                Instant settlement.
                <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gold/60" />
              </span>
              <br />
              Real money.
              <br />
              Your account.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate">
              First Round is the merchant payment network — funds settle in
              seconds, processing costs drop dramatically, and you hold your
              money outright. Onboarding is simple and straightforward.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/merchants#apply" size="lg">
                Start accepting payments →
              </ButtonLink>
              <ButtonLink href="/merchants" variant="ghost" size="lg">
                See how it works
              </ButtonLink>
            </div>

            {/* Trust line */}
            <div className="mt-7 flex items-center gap-2.5">
              <svg className="h-4 w-4 shrink-0 text-settle" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span className="text-sm text-slate">
                Non-Custodial · KYC Verified · ISO 20022 · You own your funds.
              </span>
            </div>
          </div>

          {/* Right — settlement widget */}
          <div className="animate-fade-up [animation-delay:150ms]">
            <SettlementVisual />

            {/* Floating stat card */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white border border-line px-4 py-3 shadow-md">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-soft">
                <svg className="h-4 w-4 text-gold-dark" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Payments settle in ~3 seconds</p>
                <p className="text-xs text-slate">directly to your merchant account</p>
              </div>
            </div>
          </div>

        </div>
      </Section>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-line" />
    </div>
  );
}
