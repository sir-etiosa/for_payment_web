"use client";

import { useEffect, useState } from "react";
import { METRICS } from "@/lib/constants";

const SAMPLE = [
  { amount: 128.40, method: "In-store · Tap" },
  { amount: 59.00,  method: "Invoice · B2B" },
  { amount: 412.75, method: "Online checkout" },
  { amount: 23.10,  method: "In-store · QR" },
];

export function SettlementVisual() {
  const [i, setI] = useState(0);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    let txIndex = 0;
    let timer: ReturnType<typeof setTimeout>;

    const cycle = () => {
      setI(txIndex);
      setSettled(false);
      timer = setTimeout(() => {
        setSettled(true);
        timer = setTimeout(() => {
          txIndex = (txIndex + 1) % SAMPLE.length;
          cycle();
        }, 2600);
      }, 1100);
    };

    cycle();
    return () => clearTimeout(timer);
  }, []);

  const tx = SAMPLE[i];
  const cardFee  = tx.amount * 0.029 + 0.30;
  const frFee    = tx.amount * 0.001;
  const saved    = cardFee - frFee;

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-lift sm:p-6">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 animate-pulse-dot rounded-full bg-settle" />
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-slate">
            {tx.method}
          </span>
        </div>
        <span className={`font-mono text-xs font-semibold transition-colors duration-500 ${
          settled ? "text-settle" : "text-slate/40"
        }`}>
          {settled ? "Settled ✓" : "Settling…"}
        </span>
      </div>

      {/* Amount */}
      <div className="py-5">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-slate">
          Payment received
        </p>
        <p className="mt-1 font-mono text-4xl font-semibold tabular-nums text-ink sm:text-5xl">
          ${tx.amount.toFixed(2)}
        </p>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card network column */}
        <div className="rounded-xl border border-line bg-paper p-3.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate/50">
            Card network
          </p>
          <p className="mt-2.5 font-mono text-lg font-medium tabular-nums text-slate/60 line-through">
            −${cardFee.toFixed(2)}
          </p>
          <p className="mt-1.5 font-mono text-[10px] text-slate/40">
            2–3 business days
          </p>
        </div>

        {/* FirstRound column */}
        <div className={`rounded-xl border p-3.5 transition-colors duration-500 ${
          settled
            ? "border-settle/40 bg-settle/5"
            : "border-line bg-paper"
        }`}>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate/50">
            FirstRound
          </p>
          <p className={`mt-2.5 font-mono text-lg font-medium tabular-nums transition-colors duration-500 ${
            settled ? "text-settle" : "text-slate"
          }`}>
            −${frFee.toFixed(2)}
          </p>
          <p className={`mt-1.5 font-mono text-[10px] transition-colors duration-500 ${
            settled ? "text-settle" : "text-slate/40"
          }`}>
            {settled ? `${METRICS.settlementTime} ✓` : "settling…"}
          </p>
        </div>
      </div>

      {/* Saved callout */}
      <div className={`mt-3 rounded-xl border px-4 py-3 text-center transition-all duration-700 ${
        settled
          ? "border-gold/40 bg-gold/10 opacity-100"
          : "border-line bg-paper opacity-30"
      }`}>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">
          You saved vs card
        </p>
        <p className="mt-0.5 font-mono text-xl font-semibold tabular-nums text-ink">
          ${saved.toFixed(2)}
        </p>
      </div>

    </div>
  );
}
