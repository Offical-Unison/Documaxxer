import Link from "next/link";
import { BuilderHeader } from "@/components/builder/builder-header";

function SelectionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href} className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-8 sm:p-10 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-blue-200 hover:shadow-[0_8px_32px_rgba(37,99,235,0.08)] dark:border-slate-800 dark:bg-[#0C1120] dark:hover:border-blue-900/50 dark:hover:shadow-[0_8px_32px_rgba(37,99,235,0.12)] outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-[#0B0F19]">
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-50/80 blur-3xl transition-all duration-500 group-hover:bg-blue-100/80 dark:bg-blue-900/20 dark:group-hover:bg-blue-900/30" />
      
      <div className="relative z-10">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100 group-hover:text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 dark:group-hover:bg-blue-900/40">
          {icon}
        </div>
        <h3 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="text-base leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <div className="relative z-10 mt-12 flex items-center text-sm font-semibold text-blue-600 transition-colors group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300">
        Select this format <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
      </div>
    </Link>
  );
}

export default function CreateDocumentPage() {
  return (
    <main className="flex min-h-[100dvh] flex-col bg-slate-50 dark:bg-[#0B0F19]">
      <BuilderHeader />
      <div className="flex-1 flex flex-col items-center justify-center p-5 py-12 sm:p-8 sm:py-20">
        <div className="w-full max-w-4xl mx-auto">
          <div className="mb-14 text-center animate-fade-in-up">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
              What do you want to create?
            </h1>
            <p className="mt-5 text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Choose a document type to get started.
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <SelectionCard
              title="RESUME"
              description="A focused document tailored for job applications, highlighting relevant experience, skills, education, and achievements."
              href="/templates?type=resume"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              }
            />
            <SelectionCard
              title="CURRICULUM VITAE"
              description="A comprehensive record of academic, research, teaching, and professional experience."
              href="/templates?type=cv"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  <path d="M8 7h8" />
                  <path d="M8 11h8" />
                  <path d="M8 15h4" />
                </svg>
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}
