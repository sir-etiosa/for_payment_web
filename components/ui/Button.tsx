import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-sans font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-settle disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-settle text-void font-semibold hover:bg-settle/90 shadow-sm",
  ghost: "border border-current bg-transparent hover:opacity-80",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </Link>
  );
}
