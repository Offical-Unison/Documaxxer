import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";

function DocumentLogoIcon() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500 transition-transform duration-200 group-hover:scale-105">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" aria-hidden="true">
        {/* Document card */}
        <rect x="4" y="2" width="12" height="20" rx="1.5" fill="white"/>
        {/* Folded corner */}
        <path d="M12 2L16 6H12V2Z" fill="#BFDBFE"/>
        {/* Name line (blue) */}
        <rect x="6" y="9" width="5" height="1.5" rx="0.75" fill="#2563EB"/>
        {/* Body lines */}
        <rect x="6" y="12" width="8" height="1" rx="0.5" fill="#CBD5E1"/>
        <rect x="6" y="14.5" width="6" height="1" rx="0.5" fill="#CBD5E1"/>
        <rect x="6" y="17" width="7" height="1" rx="0.5" fill="#CBD5E1"/>
      </svg>
    </div>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/90 backdrop-blur-xl transition-colors dark:border-blue-950/40 dark:bg-[#0B0F19]/90">
      <nav className="section-shell flex h-16 items-center justify-between" aria-label="Main navigation">
        <Link className="group flex items-center gap-2.5 transition-opacity hover:opacity-80" href="/">
          <DocumentLogoIcon />
          <span className="text-lg font-bold tracking-tight text-slate-950 dark:text-slate-50">
            Resum<span className="text-blue-600 dark:text-blue-400">axxer</span>
          </span>
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}