"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TUTORIAL_STEPS = [
  { title: "Choose a template", description: "Pick a resume layout that fits your style. You can switch anytime from the preview panel." },
  { title: "Fill in your information", description: "Work through the guided sections - your details, experience, education, skills, and any extras." },
  { title: "Preview your resume", description: "Watch the live preview update as you type, so you always know exactly how it will look." },
  { title: "Generate and download", description: "When you're ready, generate your resume as a polished PDF or a fully editable Word document." },
];

export function TutorialScreen() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const lastStep = TUTORIAL_STEPS.length - 1;
  const step = TUTORIAL_STEPS[stepIndex];

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-8">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Step {stepIndex + 1} of {TUTORIAL_STEPS.length}</p>
          <button type="button" onClick={() => router.push("/builder")} className="text-sm font-semibold text-slate-400 transition hover:text-slate-600">Skip</button>
        </div>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">{step.title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">{step.description}</p>

        <div className="mt-6 flex gap-1.5" aria-hidden="true">
          {TUTORIAL_STEPS.map((_, index) => (
            <span key={index} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${index <= stepIndex ? "bg-blue-600" : "bg-slate-200"}`} />
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={stepIndex === 0}
            className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>
          {stepIndex < lastStep ? (
            <button
              type="button"
              onClick={() => setStepIndex((i) => Math.min(lastStep, i + 1))}
              className="min-h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/builder")}
              className="min-h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Get started →
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
