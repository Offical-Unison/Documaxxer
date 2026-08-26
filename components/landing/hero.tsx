import Link from "next/link";
import { Button } from "@/components/ui/button";

/** A skeleton line representing a block of resume text. */
function Line({ w, h = "h-1.5", color = "bg-slate-100 dark:bg-slate-800" }: { w: string; h?: string; color?: string }) {
  return <div className={`${h} ${w} rounded-full ${color}`} />;
}

/** Section label with a trailing rule - mirrors the real resume template style. */
function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <span className="text-[7px] font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400 whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-blue-100 dark:bg-blue-900/50" />
    </div>
  );
}

/** The CSS-only document preview that populates the hero's right column. */
function ResumeDocumentPreview() {
  return (
    <div className="relative select-none" aria-hidden="true">

      {/* Depth layer 2 - furthest back */}
      <div className="absolute inset-0 translate-x-[18px] translate-y-[18px] rounded border border-blue-100 bg-blue-50/50 dark:border-blue-900/20 dark:bg-blue-950/10" />

      {/* Depth layer 1 - middle */}
      <div className="absolute inset-0 translate-x-[9px] translate-y-[9px] rounded border border-blue-100 bg-blue-50/70 dark:border-blue-900/30 dark:bg-blue-950/20" />

      {/* Main document */}
      <div className="relative rounded border border-blue-200 bg-white shadow-[0_8px_32px_rgba(37,99,235,0.08),0_1px_3px_rgba(37,99,235,0.06)] dark:border-blue-900/50 dark:bg-[#0C1120] dark:shadow-[0_8px_32px_rgba(37,99,235,0.12)]">

        {/* Small builder-chrome bar - communicates "this is the builder UI" */}
        <div className="flex items-center gap-1.5 border-b border-blue-100 px-3 py-2 dark:border-blue-900/40">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-300 dark:bg-blue-700" />
          <div className="h-1.5 w-1.5 rounded-full bg-blue-200 dark:bg-blue-800/70" />
          <div className="h-1.5 w-1.5 rounded-full bg-blue-200 dark:bg-blue-800/70" />
          <div className="ml-auto flex items-center gap-1.5">
            <div className="h-1.5 w-10 rounded-full bg-blue-100 dark:bg-blue-900/60" />
            <div className="h-4 w-10 rounded-sm bg-blue-600 dark:bg-blue-500 opacity-80" />
          </div>
        </div>

        {/* Document header - name + title + contact strip */}
        <div className="border-b border-blue-100 px-5 py-4 dark:border-blue-900/40">
          {/* Name */}
          <div className="h-4 w-36 rounded-sm bg-slate-900 dark:bg-slate-100" />
          {/* Role / headline in blue */}
          <div className="mt-1.5 h-2 w-24 rounded-full bg-blue-600 dark:bg-blue-500 opacity-70" />
          {/* Contact row */}
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
            <Line w="w-16" h="h-1.5" color="bg-slate-200 dark:bg-slate-700" />
            <Line w="w-14" h="h-1.5" color="bg-slate-200 dark:bg-slate-700" />
            <Line w="w-20" h="h-1.5" color="bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>

        {/* Document body */}
        <div className="px-5 py-4 space-y-4">

          {/* Summary */}
          <div>
            <SectionLabel label="Summary" />
            <div className="space-y-1.5">
              <Line w="w-full" />
              <Line w="w-11/12" />
              <Line w="w-4/5" />
            </div>
          </div>

          {/* Experience */}
          <div>
            <SectionLabel label="Experience" />

            {/* Job 1 */}
            <div className="mb-3">
              <div className="flex items-start justify-between mb-1">
                <div className="h-2.5 w-28 rounded-sm bg-slate-800 dark:bg-slate-200" />
                <Line w="w-12" h="h-1.5" color="bg-slate-200 dark:bg-slate-700" />
              </div>
              <Line w="w-20" h="h-1.5" color="bg-blue-200 dark:bg-blue-800/50" />
              <div className="mt-2 space-y-1.5">
                <Line w="w-full" />
                <Line w="w-5/6" />
                <Line w="w-full" />
                <Line w="w-3/4" />
              </div>
            </div>

            {/* Job 2 */}
            <div>
              <div className="flex items-start justify-between mb-1">
                <div className="h-2.5 w-24 rounded-sm bg-slate-800 dark:bg-slate-200" />
                <Line w="w-10" h="h-1.5" color="bg-slate-200 dark:bg-slate-700" />
              </div>
              <Line w="w-24" h="h-1.5" color="bg-blue-200 dark:bg-blue-800/50" />
              <div className="mt-2 space-y-1.5">
                <Line w="w-full" />
                <Line w="w-4/5" />
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <SectionLabel label="Education" />
            <div className="flex items-start justify-between mb-1">
              <div className="h-2.5 w-36 rounded-sm bg-slate-800 dark:bg-slate-200" />
              <Line w="w-10" h="h-1.5" color="bg-slate-200 dark:bg-slate-700" />
            </div>
            <Line w="w-24" h="h-1.5" color="bg-blue-200 dark:bg-blue-800/50" />
          </div>

          {/* Skills */}
          <div>
            <SectionLabel label="Skills" />
            <div className="flex flex-wrap gap-1.5">
              {[14, 18, 11, 16, 10, 13].map((w, i) => (
                <div
                  key={i}
                  className="h-4 rounded-sm bg-blue-50 border border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/50"
                  style={{ width: `${w * 4}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      className="mx-auto w-full max-w-7xl px-5 sm:px-8 grid gap-16 pt-20 pb-16 md:grid-cols-2 md:items-center md:gap-12 md:pt-32 md:pb-24"
    >
      {/* Left - copy */}
      <div className="animate-fade-in-up">
        <p className="mb-4 text-[10px] uppercase tracking-[0.2em] font-medium text-blue-500 dark:text-blue-400">
          Professional Resume Creation
        </p>
        <h1 className="max-w-xl text-5xl tracking-tighter text-slate-950 md:text-6xl lg:text-[4.5rem] lg:leading-[1.05] dark:text-slate-50">
          Build a resume that represents you.
        </h1>
        <p className="mt-8 max-w-md text-lg leading-relaxed text-slate-500 dark:text-slate-400">
          Create, edit, and refine your resume with a simple workflow designed to help you present your experience clearly and professionally.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button className="group px-8 py-4 text-base" asChild>
            <Link href="/builder">
              Begin Drafting <span className="ml-2 inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </Link>
          </Button>
          <a
            href="#how-it-works"
            className="inline-flex min-h-[52px] items-center justify-center rounded-md border border-blue-200 bg-transparent px-6 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/40"
          >
            How It Works
          </a>
        </div>

        <div className="mt-16 flex items-center gap-6 text-slate-400 dark:text-slate-500">
          <p className="text-sm font-medium">Export to:</p>
          <div className="h-4 w-px bg-blue-100 dark:bg-blue-900/60" />
          <span className="text-sm">PDF format</span>
          <div className="h-4 w-px bg-blue-100 dark:bg-blue-900/60" />
          <span className="text-sm">Word DOCX</span>
        </div>
      </div>

      {/* Right - CSS document preview */}
      <div className="hidden animate-fade-in-scale delay-100 md:block md:pl-4 lg:pl-8">
        <ResumeDocumentPreview />
      </div>
    </section>
  );
}