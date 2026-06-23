import { Section, Eyebrow } from "@/components/ui/Section";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/lib/constants";

export function ContactSection() {
  return (
    <Section id="contact" className="py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <Eyebrow>Get in touch</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Talk to our team.
          </h2>
          <p className="mt-4 text-lg text-slate">
            Questions about integrations, compliance requirements, or merchant
            onboarding? We&apos;re here.
          </p>
          <div className="mt-8 space-y-3">
            <p className="font-mono text-sm text-slate">{SITE.email}</p>
            <p className="font-mono text-sm text-slate">{SITE.phone}</p>
            <p className="font-mono text-sm text-slate">{SITE.location}</p>
          </div>
        </div>
        <ContactForm />
      </div>
    </Section>
  );
}
