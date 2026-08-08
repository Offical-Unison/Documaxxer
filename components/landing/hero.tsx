import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="section-shell grid gap-12 py-18 md:grid-cols-[1.1fr_.9fr] md:items-center md:py-24">
      <div>
        <p className="eyebrow">Your next opportunity starts here</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-6xl">Make your experience impossible to overlook.</h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">A thoughtful, distraction-free resume builder designed to help you present your best work with clarity.</p>
        <Button className="mt-8" asChild><Link href="/builder">Start Building <span aria-hidden="true">→</span></Link></Button>
      </div>
      <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-6 shadow-sm sm:p-8" aria-hidden="true">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="h-3 w-28 rounded-full bg-slate-900" /><div className="mt-3 h-2 w-40 rounded-full bg-slate-300" />
          <div className="mt-8 h-2 w-20 rounded-full bg-blue-600" /><div className="mt-3 space-y-2"><div className="h-2 rounded-full bg-slate-100" /><div className="h-2 w-11/12 rounded-full bg-slate-100" /><div className="h-2 w-4/5 rounded-full bg-slate-100" /></div>
          <div className="mt-7 h-2 w-24 rounded-full bg-blue-600" /><div className="mt-3 grid grid-cols-2 gap-2"><div className="h-8 rounded-lg bg-slate-100" /><div className="h-8 rounded-lg bg-slate-100" /></div>
        </div>
      </div>
    </section>
  );
}
