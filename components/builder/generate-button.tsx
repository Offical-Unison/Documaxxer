"use client";

import { useState } from "react";
import { useDocumentContext } from "@/context/document-context";
import { exportDocumentToDocx } from "@/lib/export/docx-export";

export function GenerateButton() {
  const { state } = useDocumentContext();
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [docxError, setDocxError] = useState<string | null>(null);

  const handlePdf = () => window.print();

  const handleDocx = async () => {
    setDocxError(null);
    setIsExportingDocx(true);
    try {
      await exportDocumentToDocx(state.document, state.selectedFontId ?? undefined, state.documentType);
    } catch {
      setDocxError(`Couldn't generate the Word document. Please try again.`);
    } finally {
      setIsExportingDocx(false);
    }
  };

  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={handlePdf}
          className="min-h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 dark:shadow-[0_2px_12px_rgba(37,99,235,0.35)]"
        >
          Download PDF
        </button>
        <button
          type="button"
          onClick={handleDocx}
          disabled={isExportingDocx}
          className="min-h-11 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(15,23,42,0.15)] transition hover:bg-slate-950 disabled:opacity-60 dark:border dark:border-slate-700/80 dark:bg-[#1A2234] dark:hover:bg-[#222B3F] dark:text-slate-200"
        >
          {isExportingDocx ? "Preparing…" : "Download Word (.docx)"}
        </button>
      </div>
      {docxError && <p className="mt-2 text-center text-xs text-red-600 dark:text-red-400">{docxError}</p>}
    </div>
  );
}