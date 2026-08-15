import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 shadow-[0_1px_3px_rgba(15,23,42,0.04)] backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-950/70">
      <nav className="section-shell flex h-16 items-center justify-between" aria-label="Main navigation">
        <Link className="text-lg font-bold tracking-tight text-slate-950 transition hover:opacity-80 dark:text-slate-50" href="/">
          Resum<span className="text-blue-600 dark:text-blue-400">axxer</span>
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}