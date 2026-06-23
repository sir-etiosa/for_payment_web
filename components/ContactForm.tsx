"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Couldn't send. Please try again.");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-card md:p-8">
      {status === "sent" ? (
        <div className="rounded-xl border border-settle/40 bg-settle-soft p-8 text-center">
          <p className="font-display text-xl font-semibold text-ink">Message received.</p>
          <p className="mt-2 text-slate">We&apos;ll be in touch within one business day.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="firstName" label="First name" required />
            <Field name="lastName" label="Last name" />
          </div>
          <Field name="email" label="Email" type="email" required />
          <Field name="company" label="Company" />
          <label className="block">
            <span className="mb-1.5 block font-mono text-xs uppercase tracking-[0.12em] text-slate">
              Message <span className="text-settle">*</span>
            </span>
            <textarea
              name="message"
              required
              rows={4}
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-settle focus:ring-2 focus:ring-settle/30"
            />
          </label>
          {status === "error" && (
            <p className="font-mono text-sm text-red-600">{error}</p>
          )}
          <Button type="submit" size="lg" disabled={status === "sending"} className="w-full sm:w-auto">
            {status === "sending" ? "Sending…" : "Send message"}
          </Button>
        </form>
      )}
    </div>
  );
}

function Field({
  name, label, type = "text", required,
}: {
  name: string; label: string; type?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-[0.12em] text-slate">
        {label}{required && <span className="text-settle"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-settle focus:ring-2 focus:ring-settle/30"
      />
    </label>
  );
}
