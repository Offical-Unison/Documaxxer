import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 shadow-[0_1px_3px_rgba(15,23,42,0.04)] backdrop-blur-xl">
      <nav className="section-shell flex h-16 items-center justify-between" aria-label="Main navigation">
        <Link className="text-lg font-bold tracking-tight text-slate-950 transition hover:opacity-80" href="/">
          Resum<span className="text-blue-600">axxer</span>
        </Link>
        <Link
          className="rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          href="/builder"
        >
          Open builder
        </Link>
      </nav>
    </header>
  );
}
