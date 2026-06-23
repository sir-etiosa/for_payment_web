"use client";

import { useEffect, useState } from "react";
import { METRICS } from "@/lib/constants";

type Stage = "received" | "clearing" | "settled";

const SAMPLE = [
  { amount: "128.40", ref: "ORD-4471", method: "In-store · QR" },
  { amount: "59.00", ref: "INV-0912", method: "Invoice · B2B" },
  { amount: "412.75", ref: "ORD-4472", method: "Online checkout" },
  { amount: "23.10", ref: "ORD-4473", method: "In-store · Tap" },
];

const STAGE_LABEL: Record<Stage, string> = {
  received: "PAYMENT RECEIVED",
  clearing: "CLEARING ON NETWORK",
  settled: "SETTLED TO MERCHANT",
};

export function SettlementVisual() {
  const [i, setI] = useState(0);
  const [stage, setStage] = useState<Stage>("received");

  useEffect(() => {
    const seq: { s: Stage; t: number }[] = [
      { s: "received", t: 1100 },
      { s: "clearing", t: 1600 },
      { s: "settled", t: 2000 },
    ];
    let idx = 0;
    let timer: ReturnType<typeof setTimeout>;

    const run = () => {
      setStage(seq[idx].s);
      timer = setTimeout(() => {
        if (idx < seq.length - 1) {
          idx += 1;
          run();
        } else {
          setTimeout(() => {
            setI((p) => (p + 1) % SAMPLE.length);
            idx = 0;
            run();
          }, 900);
        }
      }, seq[idx].t);
    };
    run();
    return () => clearTimeout(timer);
  }, []);

  const tx = SAMPLE[i];
  const settled = stage === "settled";

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-lift sm:p-6">
      {/* terminal header */}
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 animate-pulse-dot rounded-full bg-settle" />
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-slate">
            Live settlement
          </span>
        </div>
        <span className="font-mono text-xs text-slate">FirstRound · {METRICS.standard}</span>
      </div>

      {/* amount */}
      <div className="py-6">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-slate">
          {tx.method} · {tx.ref}
        </p>
        <p className="mt-2 font-mono text-4xl font-medium tabular-nums text-ink sm:text-5xl">
          ${tx.amount}
        </p>
      </div>

      {/* the rail */}
      <div className="relative my-2 h-px w-full bg-line">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 h-px w-12 -translate-y-1/2 animate-rail-flow bg-gradient-to-r from-transparent via-settle to-transparent" />
        </div>
      </div>

      {/* stage track */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        {(["received", "clearing", "settled"] as Stage[]).map((s, idx) => {
          const order: Stage[] = ["received", "clearing", "settled"];
          const active = order.indexOf(stage) >= idx;
          return (
            <div key={s} className="flex flex-col gap-2">
              <div
                className={`h-1 rounded-full transition-colors duration-300 ${
                  active ? "bg-settle" : "bg-line"
                }`}
              />
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
                  active ? "text-ink" : "text-slate/50"
                }`}
              >
                {STAGE_LABEL[s]}
              </span>
            </div>
          );
        })}
      </div>

      {/* settled receipt */}
      <div className="mt-6 flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate">
            Network fee
          </p>
          <p className="font-mono text-sm tabular-nums text-ink">
            {(parseFloat(tx.amount) * 0.008).toFixed(2)} ({METRICS.networkFee})
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate">
            Settled in
          </p>
          <p
            className={`font-mono text-sm tabular-nums transition-colors ${
              settled ? "text-settle" : "text-slate"
            }`}
          >
            {settled ? `${METRICS.settlementTime} ✓` : "…"}
          </p>
        </div>
      </div>
    </div>
  );
}
