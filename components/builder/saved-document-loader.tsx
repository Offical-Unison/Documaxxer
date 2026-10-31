"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDocumentContext } from "@/context/document-context";
import { normalizeDocumentData } from "@/context/document-reducer";
import { hasUserContent } from "@/lib/documents/statistics";
import { DOCUMENT_TYPE_LABELS, getExportBaseName } from "@/lib/documents/document-layout";
import { printDocument } from "@/lib/export/download";
import { DEFAULT_FONT_ID } from "@/lib/fonts";
import { isDocumentType } from "@/types/document";

const AUTOSAVE_DELAY_MS = 1000;

type SyncStatus = "local" | "loading" | "pending" | "saving" | "saved" | "error" | "load-error";

interface SavedDocumentResponse {
  id: string;
  name: string;
  content: string;
  documentType: string;
  templateId: string;
  selectedFontId: string | null;
}

/**
 * Keeps the builder in sync with a database-backed document (`/builder?document=<id>`):
 * loads it, autosaves edits back to the server (debounced), and shows the save state.
 * With `&export=pdf` it opens the print dialog once the document has loaded.
 * Without a document id the draft lives in this browser only; signed-in users can save it.
 */
export function SavedDocumentLoader() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { status: authStatus } = useSession();
  const { state, dispatch, isHydrated } = useDocumentContext();
  const documentId = searchParams.get("document");
  const exportFormat = searchParams.get("export");

  const [status, setStatus] = useState<SyncStatus>(documentId ? "loading" : "local");
  const [savingToAccount, setSavingToAccount] = useState(false);
  const [pendingPrint, setPendingPrint] = useState(false);
  const loadedId = useRef<string | null>(null);
  const lastSaved = useRef("");
  const unsaved = useRef<string | null>(null);
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const snapshot = JSON.stringify({ content: state.document, templateId: state.selectedTemplateId, selectedFontId: state.selectedFontId });

  /* ── Load ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (!isHydrated) return;
    if (!documentId) {
      loadedId.current = null;
      setStatus("local");
      return;
    }
    let cancelled = false;
    loadedId.current = null;
    setStatus("loading");

    async function load(id: string) {
      const response = await fetch(`/api/documents/${encodeURIComponent(id)}`);
      if (!response.ok) throw new Error(String(response.status));
      const saved = (await response.json()) as SavedDocumentResponse;
      if (cancelled) return;

      let parsed: unknown = {};
      try { parsed = JSON.parse(saved.content); } catch { /* corrupted row — start from defaults */ }
      const content = normalizeDocumentData(parsed);
      const documentType = isDocumentType(saved.documentType) ? saved.documentType : "resume";
      const fontId = saved.selectedFontId ?? DEFAULT_FONT_ID;

      dispatch({ type: "SET_DOCUMENT_TYPE", payload: documentType });
      dispatch({ type: "SET_DOCUMENT", payload: content });
      dispatch({ type: "SET_TEMPLATE", payload: saved.templateId });
      dispatch({ type: "SET_FONT", payload: fontId });
      dispatch({ type: "SET_ACTIVE_SECTION", payload: null });
      // A document that already has content can be downloaded straight away.
      dispatch({ type: "SET_GENERATE_UNLOCKED", payload: hasUserContent(content, documentType) || Boolean(content.personalDetails.firstName || content.letterDetails?.senderName) });

      lastSaved.current = JSON.stringify({ content, templateId: saved.templateId, selectedFontId: fontId });
      loadedId.current = id;
      setStatus("saved");
      if (exportFormat === "pdf") setPendingPrint(true);
    }

    load(documentId).catch(() => {
      if (!cancelled) setStatus("load-error");
    });
    return () => { cancelled = true; };
  }, [dispatch, documentId, exportFormat, isHydrated]);

  /* ── Autosave ─────────────────────────────────────────────── */
  const save = useCallback(async (id: string, body: string, keepalive = false) => {
    const response = await fetch(`/api/documents/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive,
    });
    if (!response.ok) throw new Error(String(response.status));
    lastSaved.current = body;
    if (unsaved.current === body) unsaved.current = null;
  }, []);

  useEffect(() => {
    if (!documentId || loadedId.current !== documentId || snapshot === lastSaved.current) return;
    unsaved.current = snapshot;
    setStatus("pending");
    const timer = window.setTimeout(() => {
      setStatus("saving");
      save(documentId, snapshot).then(() => setStatus("saved")).catch(() => setStatus("error"));
    }, AUTOSAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [documentId, save, snapshot]);

  // Flush a pending save if the tab is closed or the user navigates away mid-debounce.
  useEffect(() => {
    if (!documentId) return;
    const flush = () => {
      if (unsaved.current && loadedId.current === documentId) void save(documentId, unsaved.current, true).catch(() => undefined);
    };
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [documentId, save]);

  /* ── Auto-print (dashboard "PDF" action) ──────────────────── */
  useEffect(() => {
    if (!pendingPrint) return;
    // Give the preview a moment to measure and paginate the freshly loaded content.
    const timer = window.setTimeout(() => {
      setPendingPrint(false);
      router.replace(`${pathname}?document=${encodeURIComponent(documentId ?? "")}`, { scroll: false });
      printDocument(getExportBaseName(stateRef.current.document, stateRef.current.documentType));
    }, 800);
    return () => window.clearTimeout(timer);
  }, [documentId, pathname, pendingPrint, router]);

  /* ── Save a local draft to the account ────────────────────── */
  async function saveToAccount() {
    setSavingToAccount(true);
    try {
      const current = stateRef.current;
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: getExportBaseName(current.document, current.documentType).replace(/_/g, " ") || DOCUMENT_TYPE_LABELS[current.documentType],
          documentType: current.documentType,
          templateId: current.selectedTemplateId,
          content: current.document,
          selectedFontId: current.selectedFontId,
        }),
      });
      if (!response.ok) throw new Error();
      const created = (await response.json()) as { id: string };
      router.replace(`${pathname}?document=${encodeURIComponent(created.id)}`, { scroll: false });
    } catch {
      setStatus("error");
    } finally {
      setSavingToAccount(false);
    }
  }

  if (!isHydrated) return null;

  const label: Record<SyncStatus, string> = {
    local: "Draft saved in this browser",
    loading: "Loading document…",
    pending: "Unsaved changes…",
    saving: "Saving…",
    saved: "All changes saved",
    error: "Couldn't save — check your connection",
    "load-error": "This saved document could not be loaded.",
  };
  const isError = status === "error" || status === "load-error";

  return (
    <div role="status" aria-live="polite" className={`fixed bottom-24 left-4 z-30 flex items-center gap-3 rounded-full px-3.5 py-1.5 text-xs font-medium shadow-md backdrop-blur print:hidden ${isError ? "bg-red-600 text-white" : "border border-slate-200 bg-white/90 text-slate-600 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300"}`}>
      <span>{label[status]}</span>
      {status === "error" && documentId && (
        <button type="button" onClick={() => { setStatus("saving"); save(documentId, snapshot).then(() => setStatus("saved")).catch(() => setStatus("error")); }} className="font-semibold underline">Retry</button>
      )}
      {status === "local" && authStatus === "authenticated" && (
        <button type="button" onClick={() => void saveToAccount()} disabled={savingToAccount} className="font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50 dark:text-blue-400">
          {savingToAccount ? "Saving…" : "Save to my documents"}
        </button>
      )}
    </div>
  );
}
