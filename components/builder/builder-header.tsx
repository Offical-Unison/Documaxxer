import Link from "next/link";

export function BuilderHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 shadow-[0_1px_3px_rgba(15,23,42,0.04)] backdrop-blur-xl">
      <div className="section-shell flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight text-slate-950 transition hover:opacity-80">
          Resum<span className="text-blue-600">axxer</span>
        </Link>
        <span className="text-sm font-medium text-slate-400">Resume builder</span>
      </div>
    </header>
  );
}
