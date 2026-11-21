import Link from "next/link";
import { LogoWordmark } from "@/components/logo";
import { SignOutButton } from "@/components/sign-out-button";

export function AppHeader({
  userName,
  links,
}: {
  userName: string;
  links: { href: string; label: string }[];
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 bg-menhir-navy px-6 py-4 sm:px-10">
      <Link href="/">
        <LogoWordmark className="text-base text-white" />
      </Link>
      <nav className="flex items-center gap-5 text-sm text-white/80">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-white">
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <span className="text-sm text-white/70">Bonjour, {userName}</span>
        <SignOutButton />
      </div>
    </header>
  );
}
