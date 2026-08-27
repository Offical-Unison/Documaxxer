import Link from "next/link";
import { Button } from "@/components/ui/button";

function DocumentTypeCard({
  title,
  description,
  icon,
  href,
  delay = "0ms",
  disabled = false,
  badge
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  delay?: string;
  disabled?: boolean;
  badge?: string;
}) {
  const CardContent = (
    <div
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-blue-200 hover:shadow-[0_8px_32px_rgba(37,99,235,0.08)] dark:border-slate-800 dark:bg-[#0C1120] dark:hover:border-blue-900/50 dark:hover:shadow-[0_8px_32px_rgba(37,99,235,0.12)] ${
        disabled ? "opacity-60 grayscale hover:border-slate-200/60 hover:shadow-none dark:hover:border-slate-800" : ""
      }`}
      style={{ animationDelay: delay }}
    >
      {/* Subtle background glow effect on hover */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-50/50 blur-3xl transition-all duration-500 group-hover:bg-blue-100/50 dark:bg-blue-900/10 dark:group-hover:bg-blue-900/20" />
      
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100 group-hover:text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 dark:group-hover:bg-blue-900/40">
            {icon}
          </div>
          {badge && (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {badge}
            </span>
          )}
        </div>
        <h3 className="mb-2 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <div className="relative z-10 mt-8 flex items-center text-sm font-semibold text-blue-600 transition-colors group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300">
        {disabled ? "Coming soon" : "Get started"}
        {!disabled && <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>}
      </div>
    </div>
  );

  if (disabled) {
    return <div className="animate-fade-in-up h-full">{CardContent}</div>;
  }

  return (
    <Link href={href} className="animate-fade-in-up block h-full outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-[#0B0F19] rounded-2xl">
      {CardContent}
    </Link>
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      className="mx-auto w-full max-w-7xl px-5 sm:px-8 pt-20 pb-16 md:pt-32 md:pb-24"
    >
      <div className="grid gap-16 xl:grid-cols-[1fr_1.1fr] xl:items-center xl:gap-12">
        {/* Left - copy */}
        <div className="animate-fade-in-up max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-3 py-1 mb-8 dark:border-blue-900/30 dark:bg-blue-900/10">
            <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            <span className="text-[10px] font-semibold tracking-[0.2em] text-blue-700 dark:text-blue-300 uppercase">
              Free forever
            </span>
          </div>
          
          <h1 className="text-5xl tracking-tighter text-slate-950 md:text-6xl lg:text-[4rem] lg:leading-[1.05] dark:text-slate-50">
            Craft your next professional document.
          </h1>
          
          <p className="mt-6 text-lg leading-relaxed text-slate-500 dark:text-slate-400 max-w-lg">
            Build a resume, CV, or cover letter that perfectly represents your experience. Pick a document type to start building immediately—no sign up required.
          </p>

          <div className="mt-12 flex items-center gap-6 text-slate-400 dark:text-slate-500">
            <p className="text-sm font-medium">Export to:</p>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
            <span className="text-sm font-medium">PDF format</span>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
            <span className="text-sm font-medium">Word DOCX</span>
          </div>
        </div>

        {/* Right - Selection Cards (Bento) */}
        <div className="grid gap-4 sm:grid-cols-2 xl:pl-8">
          <div className="sm:col-span-2">
            <DocumentTypeCard
              title="Resume"
              description="A concise, targeted document focusing on specific skills and experiences relevant to a particular job application."
              href="/builder"
              delay="100ms"
              badge="Most Popular"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              }
            />
          </div>
          
          <div className="h-full">
            <DocumentTypeCard
              title="Curriculum Vitae"
              description="A comprehensive overview of your academic and professional history."
              href="/builder"
              delay="200ms"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                </svg>
              }
            />
          </div>

          <div className="h-full">
            <DocumentTypeCard
              title="Cover Letter"
              description="A personalized letter introducing yourself and your intentions."
              href="#"
              delay="300ms"
              disabled={true}
              badge="Coming Soon"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
                  <polyline points="3 7 12 13 21 7" />
                </svg>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}