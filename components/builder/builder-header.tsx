import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function BuilderHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 shadow-[0_1px_3px_rgba(15,23,42,0.04)] backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-950/70">
      <div className="section-shell flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight text-slate-950 transition hover:opacity-80 dark:text-slate-50">
          Resum<span className="text-blue-600 dark:text-blue-400">axxer</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}