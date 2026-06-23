"use client";

import { useState } from "react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "sending" | "sent" | "error";

const VOLUME_BANDS = [
  "Under $10k / month",
  "$10k–$50k / month",
  "$50k–$250k / month",
  "$250k+ / month",
];

const CHANNELS = ["In-store", "Online", "Invoicing / B2B", "Cross-border"];

export function OnboardingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [channels, setChannels] = useState<string[]>([]);

  function toggleChannel(c: string) {
    setChannels((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const form = e.currentTarget;
    const data = {
      ...Object.fromEntries(new FormData(form).entries()),
      channels,
    };

    try {
      const res = await fetch("/api/merchant-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Couldn't submit. Please try again.");
      }
      setStatus("sent");
      form.reset();
      setChannels([]);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <Section id="apply" className="py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <Eyebrow>Apply to become a merchant</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Start your application.
          </h2>
          <p className="mt-4 text-lg text-slate">
            Tell us about your business. There&apos;s no cost to apply, and most
            verifications clear within a couple of business days.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "No technical setup to apply",
              "KYB / AML handled during onboarding",
              "A specialist will reach out with next steps",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-slate">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-settle" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-card md:p-8">
          {status === "sent" ? (
            <div className="rounded-xl border border-settle/40 bg-settle-soft p-8 text-center">
              <p className="font-display text-xl font-semibold text-ink">
                Application received.
              </p>
              <p className="mt-2 text-slate">
                A FirstRound merchant specialist will reach out within one
                business day to begin verification.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="contactName" label="Your name" required />
                <Field name="company" label="Business name" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="email" label="Work email" type="email" required />
                <Field name="website" label="Website" placeholder="https://" />
              </div>

              <Select name="volume" label="Monthly payment volume" options={VOLUME_BANDS} />

              <fieldset>
                <legend className="mb-2 font-mono text-xs uppercase tracking-[0.12em] text-slate">
                  How do you want to accept payments?
                </legend>
                <div className="flex flex-wrap gap-2">
                  {CHANNELS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => toggleChannel(c)}
                      aria-pressed={channels.includes(c)}
                      className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition ${
                        channels.includes(c)
                          ? "border-settle bg-settle-soft text-ink"
                          : "border-line text-slate hover:border-ink/30"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </fieldset>

              {status === "error" && (
                <p className="font-mono text-sm text-red-600">{error}</p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={status === "sending"}
                className="mt-2 w-full sm:w-auto"
              >
                {status === "sending" ? "Submitting…" : "Submit application"}
              </Button>
              <p className="font-mono text-[11px] text-slate">
                By applying you agree to merchant verification (KYC/AML) checks.
              </p>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-[0.12em] text-slate">
        {label}
        {required && <span className="text-settle"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-settle focus:ring-2 focus:ring-settle/30"
      />
    </label>
  );
}

function Select({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-[0.12em] text-slate">
        {label}
      </span>
      <select
        name={name}
        defaultValue=""
        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-settle focus:ring-2 focus:ring-settle/30"
      >
        <option value="" disabled>
          Select a range
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
