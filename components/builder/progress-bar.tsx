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
      className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-[0_4px_20px_rgba(15,23,42,0.03)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#121824]/80"
    >
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Your progress</span>
        <span className="tabular-nums text-slate-400 dark:text-slate-500">{currentStep} of {totalSteps} sections</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800/80">
        <div className="h-full rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.25)] transition-all duration-500 ease-out dark:bg-blue-500 dark:shadow-[0_0_12px_rgba(59,130,246,0.4)]" style={{ width: `${percentage}%` }} />
      </div>
    </section>
  );
}