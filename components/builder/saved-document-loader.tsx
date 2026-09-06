"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDocumentContext } from "@/context/document-context";
import type { DocumentData, DocumentType } from "@/types/document";

export function SavedDocumentLoader() {
  const searchParams = useSearchParams();
  const { dispatch, isHydrated } = useDocumentContext();
  const [message, setMessage] = useState("");
  const documentId = searchParams.get("document");

  useEffect(() => {
    if (!isHydrated || !documentId) return;
    let cancelled = false;

    async function loadDocument() {
      const response = await fetch(`/api/documents/${documentId}`);
      if (!response.ok) {
        if (!cancelled) setMessage("This saved document could not be loaded.");
        return;
      }

      const saved = (await response.json()) as {
        content: string;
        documentType: DocumentType;
        templateId: string;
        selectedFontId: string | null;
      };
      if (cancelled) return;

      dispatch({ type: "SET_DOCUMENT", payload: JSON.parse(saved.content) as DocumentData });
      dispatch({ type: "SET_DOCUMENT_TYPE", payload: saved.documentType });
      dispatch({ type: "SET_TEMPLATE", payload: saved.templateId });
      dispatch({ type: "SET_FONT", payload: saved.selectedFontId });
      setMessage("");
    }

    void loadDocument().catch(() => {
      if (!cancelled) setMessage("This saved document could not be loaded.");
    });
    return () => { cancelled = true; };
  }, [dispatch, documentId, isHydrated]);

  return message ? <p role="alert" className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white shadow-lg">{message}</p> : null;
}
