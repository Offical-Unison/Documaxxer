import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-white/70 bg-white/70 backdrop-blur">
      <nav className="section-shell flex h-18 items-center justify-between" aria-label="Main navigation">
        <Link className="text-lg font-bold tracking-tight text-slate-950" href="/">Resum<span className="text-blue-600">axxer</span></Link>
        <Link className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50" href="/builder">Open builder</Link>
      </nav>
    </header>
  );
}
