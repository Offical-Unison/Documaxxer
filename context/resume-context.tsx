"use client";

import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from "react";
import { initialResumeState, resumeReducer, type ResumeAction } from "@/context/resume-reducer";
import type { ResumeState } from "@/types/resume";

interface ResumeContextValue { state: ResumeState; dispatch: Dispatch<ResumeAction>; }
const ResumeContext = createContext<ResumeContextValue | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(resumeReducer, initialResumeState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

export function useResumeContext() {
  const context = useContext(ResumeContext);
  if (!context) throw new Error("useResumeContext must be used within a ResumeProvider.");
  return context;
}
