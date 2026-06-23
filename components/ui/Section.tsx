import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </section>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-gold", className)}>
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
      {children}
    </p>
  );
}
