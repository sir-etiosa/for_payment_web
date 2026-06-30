import { Section } from "@/components/ui/Section";

export function ForEcosystem() {
  return (
    <Section id="ecosystem" className="py-20 md:py-24">
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
          <div className="p-8 md:p-12">
            <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-token">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-token" />
              Ecosystem · Powered by $FOR
            </p>
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              The rail runs quietly in the background.
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-slate">
              $FOR is the network asset behind FirstRound&apos;s infrastructure.
              As a merchant, you price and collect in the currencies you already
              use — the network handles clearing automatically, keeping fees low
              and settlement fast.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                "Network clears and confirms transactions in seconds",
                "No token management required on the merchant side",
                "Designed to keep processing costs far below card-network rates",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-slate">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-token" />
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>

            <a
              href="https://www.firstroundcoin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-token hover:text-navy transition-colors"
            >
              Learn more about $FOR at firstroundcoin.com
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>

          <div className="flex flex-col justify-center gap-4 border-t border-line bg-token-soft/40 p-8 md:border-l md:border-t-0 md:p-12">
            <div className="rounded-xl border border-token/30 bg-white p-5">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-slate">
                You set the price
              </p>
              <p className="mt-1 font-mono text-2xl tabular-nums text-ink">$128.40</p>
            </div>
            <div className="flex items-center justify-center font-mono text-xs text-token">
              ↓ cleared by the network ↓
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
