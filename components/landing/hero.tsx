import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="section-shell grid gap-12 py-16 md:grid-cols-[1.1fr_.9fr] md:items-center md:py-24">
      <div>
        <p className="eyebrow">Your next opportunity starts here</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-[-0.03em] text-slate-950 sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
          Make your experience impossible to overlook.
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-500">
          A thoughtful, distraction-free resume builder designed to help you present your best work with clarity.
        </p>
        <Button className="mt-8" asChild>
          <Link href="/builder">Start Building <span aria-hidden="true">→</span></Link>
        </Button>
      </div>

      <div className="rounded-3xl border border-blue-100/80 bg-gradient-to-br from-blue-50/80 to-slate-50/60 p-6 shadow-[0_8px_30px_rgba(37,99,235,0.06)] sm:p-8" aria-hidden="true">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
          <div className="h-3.5 w-28 rounded-full bg-slate-900" />
          <div className="mt-3 h-2 w-40 rounded-full bg-slate-200" />

          <div className="mt-8">
            <div className="h-2 w-20 rounded-full bg-blue-600" />
            <div className="mt-3 space-y-2">
              <div className="h-2 rounded-full bg-slate-100" />
              <div className="h-2 w-11/12 rounded-full bg-slate-100" />
              <div className="h-2 w-4/5 rounded-full bg-slate-100" />
            </div>
          </div>

          <div className="mt-7">
            <div className="h-2 w-24 rounded-full bg-blue-600" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="h-8 rounded-lg bg-slate-100" />
              <div className="h-8 rounded-lg bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
