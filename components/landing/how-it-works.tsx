import Link from "next/link";
import { Button } from "@/components/ui/button";

const TUTORIAL_STEPS = [
  { step: "01", title: "Select Template", description: "Choose a structural foundation. Switch instantly at any time without losing data." },
  { step: "02", title: "Input Content", description: "Navigate through guided sections - experience, education, and credentials - with focused precision." },
  { step: "03", title: "Live Preview", description: "Observe real-time document rendering as you construct your profile." },
  { step: "04", title: "Finalize & Export", description: "Generate your finished resume as a PDF or editable Word document, ready to share." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto w-full max-w-7xl px-5 sm:px-8 scroll-reveal pt-16 pb-24 sm:pt-24 sm:pb-32" aria-labelledby="how-it-works-title">
      <hr className="mb-12 border-blue-100 sm:mb-20 dark:border-blue-950/40" />
      
      <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-8">
        <div>
          <p className="mb-4 text-[10px] uppercase tracking-[0.2em] font-medium text-blue-500 dark:text-blue-400">
            How It Works
          </p>
          <h2 id="how-it-works-title" className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-slate-50 max-w-sm">
            A simpler way to build your documents.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-slate-500 dark:text-slate-400 max-w-md">
            Create a professional resume or comprehensive curriculum vitae in one focused workspace.
          </p>
          
          <div className="mt-12 hidden lg:block">
            <Button asChild className="group">
              <Link href="/create">
                Create a Document <span className="ml-2 inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {TUTORIAL_STEPS.map((step, index) => (
            <div 
              key={index} 
              className="p-8 sm:p-10 border border-blue-100 bg-white transition-colors hover:bg-blue-50/40 dark:border-blue-950/40 dark:bg-[#0B0F19] dark:hover:bg-blue-950/20 flex flex-col justify-between"
            >
              <span className="text-[10px] font-mono font-medium text-blue-400 dark:text-blue-500">
                STEP // {step.step}
              </span>
              <div className="mt-16 sm:mt-24">
                <h3 className="text-xl font-bold tracking-tight text-slate-950 dark:text-slate-50 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-12 lg:hidden">
        <Button asChild className="group w-full sm:w-auto">
          <Link href="/create">
            Create a Document <span className="ml-2 inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
        </Button>
      </div>
    </section>
  );
}