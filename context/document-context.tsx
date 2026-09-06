"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState, type Dispatch, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { initialDocumentData, initialDocumentState, documentReducer, type DocumentAction } from "@/context/document-reducer";
import type { DocumentState } from "@/types/document";

interface DocumentContextValue { state: DocumentState; dispatch: Dispatch<DocumentAction>; isHydrated: boolean; }
const DocumentContext = createContext<DocumentContextValue | undefined>(undefined);

const STORAGE_KEY = "documaxxer:document-state:v1";
const SAVE_DEBOUNCE_MS = 500;

export function DocumentProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const [state, dispatch] = useReducer(documentReducer, initialDocumentState);
  const [isHydrated, setIsHydrated] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const profileApplied = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- localStorage shape is not guaranteed to match current DocumentState
        const saved = JSON.parse(raw) as Record<string, any>;
        if (saved.document || saved.resume) {
          dispatch({ type: "SET_DOCUMENT", payload: saved.document || saved.resume });
        }
        dispatch({ type: "SET_TEMPLATE", payload: saved.selectedTemplateId ?? null });
        dispatch({ type: "SET_FONT", payload: saved.selectedFontId ?? null });
        dispatch({ type: "SET_ACTIVE_SECTION", payload: saved.activeSection ?? null });
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
    if (!isHydrated || status !== "authenticated" || profileApplied.current) return;
    let cancelled = false;

    async function applyProfile() {
      const response = await fetch("/api/profile");
      if (!response.ok) return;
      const result = (await response.json()) as { data?: Record<string, unknown> };
      if (cancelled) return;

      const profile = result.data ?? {};
      const firstName = typeof profile.firstName === "string" ? profile.firstName : "";
      const lastName = typeof profile.lastName === "string" ? profile.lastName : "";
      const email = typeof profile.email === "string" ? profile.email : "";
      const location = typeof profile.location === "string" ? profile.location : "";
      const personal = state.document.personalDetails;
      const letterDetails = state.document.letterDetails ?? initialDocumentData.letterDetails!;

      dispatch({
        type: "UPDATE_PERSONAL_DETAILS",
        payload: {
          ...personal,
          firstName: personal.firstName || firstName,
          lastName: personal.lastName || lastName,
          contact: {
            ...personal.contact,
            email: personal.contact.email || email,
            location: personal.contact.location || location,
          },
        },
      });
      dispatch({
        type: "SET_LETTER_DETAILS",
        payload: {
          ...letterDetails,
          senderName: letterDetails.senderName || [firstName, lastName].filter(Boolean).join(" "),
          senderEmail: letterDetails.senderEmail || email,
          senderAddress: letterDetails.senderAddress || location,
        },
      });
      profileApplied.current = true;
    }

    void applyProfile().catch(() => undefined);
    return () => { cancelled = true; };
  }, [isHydrated, state.document.letterDetails, state.document.personalDetails, status]);

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
  }, [state, isHydrated]);

  const value = useMemo(() => ({ state, dispatch, isHydrated }), [state, isHydrated]);
  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
}

export function useDocumentContext() {
  const context = useContext(DocumentContext);
  if (!context) throw new Error("useDocumentContext must be used within a DocumentProvider.");
  return context;
}
