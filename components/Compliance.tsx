import { Section, Eyebrow } from "@/components/ui/Section";
import { COMPLIANCE } from "@/lib/constants";

export function Compliance() {
  return (
    <Section id="security" className="py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <Eyebrow>Compliance &amp; security</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Built so you never hand over control of your money.
          </h2>
          <p className="mt-4 text-lg text-slate">
            FirstRound is non-custodial by architecture and verified by process.
            Compliance isn&apos;t a badge here — it&apos;s how the network is wired.
          </p>

          <div className="mt-8 inline-flex flex-wrap gap-2">
            {["Non-custodial", "KYC / AML", "Encrypted", "ISO 20022"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-xs text-slate"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {COMPLIANCE.map((c) => (
            <div key={c.title} className="bg-paper p-7">
              <div className="mb-4 grid h-9 w-9 place-items-center rounded-lg bg-gold-soft">
                <span className="h-2 w-2 rounded-sm bg-gold" />
              </div>
              <h3 className="font-display text-base font-semibold tracking-tight text-ink">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
