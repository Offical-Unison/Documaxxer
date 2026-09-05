import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";

function DocumentLogoIcon() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white transition-transform duration-200 group-hover:scale-105 dark:bg-blue-500">
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
        <path d="M6 3h5.5L15 6.5V17a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
        <path d="M11 3v4h4" />
        <path d="M8 11h4" />
        <path d="M8 14h3" />
      </svg>
    </div>
  );
}

export function BuilderHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/90 shadow-[0_1px_3px_rgba(15,23,42,0.04)] backdrop-blur-xl transition-colors dark:border-blue-950/40 dark:bg-[#0B0F19]/90">
      <div className="flex h-16 w-full items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="group flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <DocumentLogoIcon />
            <span className="text-lg font-bold tracking-tight text-slate-950 dark:text-slate-50">
              Docum<span className="text-blue-600 dark:text-blue-400">axxer</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            ← Back to Home
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}