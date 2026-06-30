"use client";

import { useMemo, useState } from "react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { FEES } from "@/lib/constants";

const PRESETS = [10000, 50000, 150000, 500000];

function money(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function FeeSavings() {
  const [volume, setVolume] = useState(50000);

  const { cardCost, frCost, monthlySavings, annualSavings, pct } = useMemo(() => {
    const txCount = volume / FEES.avgTicket;
    const cardCost =
      volume * FEES.cardPercent + txCount * FEES.cardFlat;
    const frCost = volume * FEES.firstRoundPercent + txCount * FEES.firstRoundFlat;
    const monthlySavings = Math.max(cardCost - frCost, 0);
    return {
      cardCost,
      frCost,
      monthlySavings,
      annualSavings: monthlySavings * 12,
      pct: cardCost > 0 ? Math.round((monthlySavings / cardCost) * 100) : 0,
    };
  }, [volume]);

  return (
    <div className="bg-navy-deep py-20 text-white md:py-28">
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Eyebrow>Fee savings</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              See what you&apos;d stop paying in card fees.
            </h2>
            <p className="mt-4 text-lg text-white/60">
              Estimate based on a flat {(FEES.firstRoundPercent * 100).toFixed(1)}%
              network fee versus typical card processing of{" "}
              {(FEES.cardPercent * 100).toFixed(1)}% + ${FEES.cardFlat.toFixed(2)}
              per transaction.
            </p>

            <div className="mt-8">
              <label
                htmlFor="volume"
                className="font-mono text-xs uppercase tracking-[0.14em] text-white/50"
              >
                Monthly payment volume
              </label>
              <p className="mt-2 font-mono text-4xl font-medium tabular-nums">
                {money(volume)}
              </p>
              <input
                id="volume"
                type="range"
                min={5000}
                max={1000000}
                step={5000}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="mt-4 w-full accent-gold"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setVolume(p)}
                    className={`rounded-full border px-3 py-1.5 font-mono text-xs transition ${
                      volume === p
                        ? "border-gold bg-gold/15 text-gold"
                        : "border-white/15 text-white/60 hover:border-white/40"
                    }`}
                  >
                    {money(p)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <Row label="Typical card fees / month" value={money(cardCost)} muted />
            <Row label="FirstRound fees / month" value={money(frCost)} accent />
            <div className="my-5 h-px bg-white/10" />
            <div className="rounded-xl bg-gold/10 p-5">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold">
                You&apos;d save · {pct}% lower
              </p>
              <p className="mt-2 font-mono text-4xl font-medium tabular-nums text-white">
                {money(monthlySavings)}
                <span className="ml-2 text-base text-white/50">/ month</span>
              </p>
              <p className="mt-1 font-mono text-sm text-white/60">
                ≈ {money(annualSavings)} per year
              </p>
            </div>
            <p className="mt-4 font-mono text-[11px] leading-relaxed text-white/40">
              Estimate only. Actual fees depend on transaction mix, average
              ticket size, and verified merchant terms. Fees can be further
              reduced by participating in capital commitment programs.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
  accent,
}: {
  label: string;
  value: string;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-white/60">{label}</span>
      <span
        className={`font-mono text-lg tabular-nums ${
          accent ? "text-gold" : muted ? "text-white/80" : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
