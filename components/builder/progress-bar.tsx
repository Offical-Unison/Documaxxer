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
      className="rounded-2xl border border-white/60 bg-white/60 p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)] backdrop-blur-xl"
    >
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700">Your progress</span>
        <span className="tabular-nums text-slate-400">{currentStep} of {totalSteps} sections</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </section>
  );
}
