"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState, type Dispatch, type ReactNode } from "react";
import { initialResumeState, resumeReducer, type ResumeAction } from "@/context/resume-reducer";
import type { ResumeState } from "@/types/resume";

interface ResumeContextValue { state: ResumeState; dispatch: Dispatch<ResumeAction>; isHydrated: boolean; }
const ResumeContext = createContext<ResumeContextValue | undefined>(undefined);

const STORAGE_KEY = "documaxxer:document-state:v1";
const SAVE_DEBOUNCE_MS = 500;

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(resumeReducer, initialResumeState);
  const [isHydrated, setIsHydrated] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as ResumeState;
        dispatch({ type: "SET_RESUME", payload: saved.resume });
        dispatch({ type: "SET_TEMPLATE", payload: saved.selectedTemplateId });
        dispatch({ type: "SET_FONT", payload: saved.selectedFontId });
        dispatch({ type: "SET_ACTIVE_SECTION", payload: saved.activeSection });
        if (saved.documentType) dispatch({ type: "SET_DOCUMENT_TYPE", payload: saved.documentType });
        if (saved.generateUnlocked) dispatch({ type: "UNLOCK_GENERATE" });
      }
    } catch {
      // corrupted/unavailable storage — start fresh
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // quota/private-browsing — autosave silently no-ops
      }
    }, SAVE_DEBOUNCE_MS);
    return () => { if (saveTimeout.current) clearTimeout(saveTimeout.current); };
  }, [state]);

  const value = useMemo(() => ({ state, dispatch, isHydrated }), [state, isHydrated]);
  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

export function useResumeContext() {
  const context = useContext(ResumeContext);
  if (!context) throw new Error("useResumeContext must be used within a ResumeProvider.");
  return context;
}
