"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const TUTORIAL_STEPS = [
  { title: "Choose a template", description: "Pick a resume layout that fits your style. You can switch anytime from the preview panel." },
  { title: "Fill in your information", description: "Work through the guided sections — your details, experience, education, skills, and any extras." },
  { title: "Preview your resume", description: "Watch the live preview update as you type, so you always know exactly how it will look." },
  { title: "Generate and download", description: "When you're ready, generate your resume as a polished PDF or a fully editable Word document." },
];

export function HowItWorks() {
  const [stepIndex, setStepIndex] = useState(0);
  const lastStep = TUTORIAL_STEPS.length - 1;
  const step = TUTORIAL_STEPS[stepIndex];

  return (
    <section className="section-shell pt-8 pb-16 sm:pt-12 sm:pb-24" aria-labelledby="how-it-works-title">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">How it works</p>
        <h2 id="how-it-works-title" className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-slate-50">
          Build your resume in 4 simple steps
        </h2>
        <p className="mt-4 text-base leading-7 text-slate-500 dark:text-slate-400">
          From picking a look to downloading a polished document — here&apos;s what to expect.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-xl rounded-3xl border border-white/70 bg-white/70 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/70 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          Step {stepIndex + 1} of {TUTORIAL_STEPS.length}
        </p>
        <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-950 dark:text-slate-50">{step.title}</h3>
        <p className="mt-2.5 text-sm leading-6 text-slate-500 dark:text-slate-400">{step.description}</p>

        <div className="mt-6 flex gap-1.5" aria-hidden="true">
          {TUTORIAL_STEPS.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                index <= stepIndex ? "bg-blue-600 dark:bg-blue-500" : "bg-slate-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={stepIndex === 0}
            className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            ← Previous
          </button>
          {stepIndex < lastStep ? (
            <button
              type="button"
              onClick={() => setStepIndex((i) => Math.min(lastStep, i + 1))}
              className="min-h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              Next
            </button>
          ) : (
            <Button asChild><Link href="/builder">Build Resume</Link></Button>
          )}
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <Button asChild className="px-8"><Link href="/builder">Build Resume <span aria-hidden="true">→</span></Link></Button>
      </div>
    </section>
  );
}