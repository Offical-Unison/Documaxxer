"use client";

import { useResumeContext } from "@/context/resume-context";

interface ProgressBarProps { totalSteps: number; }

export function ProgressBar({ totalSteps }: ProgressBarProps) {
  const { state } = useResumeContext();
  const savedStep = Number(state.activeSection);
  const currentStep = savedStep >= 0 && savedStep <= totalSteps ? savedStep : 0;
  const percentage = totalSteps === 0 ? 0 : (currentStep / totalSteps) * 100;

  return (
    <section
      aria-label="Builder progress"
      className="rounded-2xl border border-white/60 bg-white/60 p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)] backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/60"
    >
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Your progress</span>
        <span className="tabular-nums text-slate-400 dark:text-slate-500">{currentStep} of {totalSteps} sections</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full bg-blue-600 transition-all duration-500 ease-out dark:bg-blue-500" style={{ width: `${percentage}%` }} />
      </div>
    </section>
  );
}