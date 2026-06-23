import { Section } from "@/components/ui/Section";

export function ForEcosystem() {
  return (
    <Section id="ecosystem" className="py-20 md:py-24">
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
          <div className="p-8 md:p-12">
            <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-token">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-token" />
              The rail underneath · $FOR
            </p>
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              A settlement asset you never have to think about.
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-slate">
              $FOR is the utility asset that settles transactions and secures the
              FirstRound network. As a merchant, you price, invoice, and get paid
              out in the currencies you already use — the $FOR rail does the
              clearing in the background.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                "Settles transactions across the network in seconds",
                "Secures the rail without merchants holding or managing it",
                "Keeps fees low and predictable versus card networks",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-slate">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-token" />
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center gap-4 border-t border-line bg-token-soft/40 p-8 md:border-l md:border-t-0 md:p-12">
            <div className="rounded-xl border border-token/30 bg-white p-5">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-slate">
                You set the price
              </p>
              <p className="mt-1 font-mono text-2xl tabular-nums text-ink">$128.40</p>
            </div>
            <div className="flex items-center justify-center font-mono text-xs text-token">
              ↓ settled via $FOR rail ↓
            </div>
            <div className="rounded-xl border border-settle/30 bg-white p-5">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-slate">
                You receive
              </p>
              <p className="mt-1 font-mono text-2xl tabular-nums text-settle">
                $127.37
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
