import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/layout/navbar";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <section className="section-shell pb-24 pt-6" aria-labelledby="how-it-works-title">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <p className="eyebrow">A clearer way to apply</p>
          <h2 id="how-it-works-title" className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950">
            A focused workspace for shaping your professional story.
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-slate-600">
            Resumaxxer brings your experience, structure, and final presentation together in one calm, guided place.
          </p>
          <Button className="mt-8" asChild>
            <Link href="/builder">Start Building</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
