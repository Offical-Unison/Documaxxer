"use client";

import { useResumeContext } from "@/context/resume-context";

interface ProgressBarProps { totalSteps: number; }
export function ProgressBar({ totalSteps }: ProgressBarProps) {
  const { state } = useResumeContext();
  const savedStep = Number(state.activeSection);
  const currentStep = savedStep >= 0 && savedStep <= totalSteps ? savedStep : 0; 
  const percentage = totalSteps === 0 ? 0 : (currentStep / totalSteps) * 100;
  return <section aria-label="Builder progress" className="rounded-2xl border border-white/75 bg-white/65 p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur"><div className="flex justify-between text-sm"><span className="font-semibold text-slate-700">Your progress</span><span className="text-slate-500">{currentStep} of {totalSteps} sections</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200/80"><div className="h-full rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${percentage}%` }} /></div></section>;
}
