import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-menhir-yellow text-menhir-navy hover:bg-menhir-yellow-dark font-semibold",
  secondary:
    "bg-menhir-navy text-white hover:bg-menhir-navy-light font-semibold",
  ghost:
    "bg-transparent text-menhir-navy hover:bg-menhir-paleblue border border-menhir-navy/20",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}

export function LinkButton({
  variant = "primary",
  className = "",
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-menhir-navy/10 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function LevelBadge({ level }: { level: string }) {
  const labels: Record<string, string> = {
    DECOUVERTE: "Découverte",
    INITIATION: "Initiation",
    NAVIGATION_SURVEILLEE: "Navigation surveillée",
    AUTONOME: "Autonome",
    PERFECTIONNEMENT: "Perfectionnement",
  };
  return <span className="badge-level">{labels[level] ?? level}</span>;
}
