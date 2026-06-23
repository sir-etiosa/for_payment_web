import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { SettlementVisual } from "@/components/SettlementVisual";

export function Hero() {
  return (
    <div className="relative overflow-hidden border-b border-line bg-paper pt-14 pb-16 md:pt-20 md:pb-24">
      {/* faint ledger grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(14,21,48,0.035) 1px, transparent 1px)",
          backgroundSize: "44px 100%",
        }}
      />
      <Section className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="animate-fade-up">
            <p className="eyebrow inline-flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-settle" />
              Payment network · Non-custodial · ISO 20022
            </p>

            <h1 className="mt-5 font-display text-[2.6rem] font-semibold leading-[1.04] tracking-tight text-ink sm:text-6xl">
              Accept payments.
              <br />
              Settle in{" "}
              <span className="relative whitespace-nowrap text-settle">
                seconds
                <span className="absolute -bottom-1 left-0 h-[3px] w-full bg-settle/30" />
              </span>
              , not days.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate">
              FirstRound is a non-custodial payment network for merchants. Take
              payments in-store, online, or by invoice — and have funds settle
              to you in near real time, with fees under 1% and no chargebacks.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/merchants#apply" size="lg">
                Start merchant onboarding
              </ButtonLink>
              <ButtonLink href="/#contact" variant="ghost" size="lg">
                Talk to our team
              </ButtonLink>
            </div>

            <p className="mt-5 font-mono text-xs text-slate">
              For businesses of every size — verified merchants only.
            </p>
          </div>

          <div className="animate-fade-up [animation-delay:120ms]">
            <SettlementVisual />
          </div>
        </div>
      </Section>
    </div>
  );
}
