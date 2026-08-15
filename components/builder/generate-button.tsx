"use client";

import { useState } from "react";
import { useResumeContext } from "@/context/resume-context";
import { exportResumeToDocx } from "@/lib/export/docx-export";

export function GenerateButton() {
  const { state } = useResumeContext();
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [docxError, setDocxError] = useState<string | null>(null);

  const handlePdf = () => window.print();

  const handleDocx = async () => {
    setDocxError(null);
    setIsExportingDocx(true);
    try {
      await exportResumeToDocx(state.resume);
    } catch {
      setDocxError("Couldn't generate the Word document. Please try again.");
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
          className="min-h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          Download PDF
        </button>
        <button
          type="button"
          onClick={handleDocx}
          disabled={isExportingDocx}
          className="min-h-11 rounded-xl bg-slate-800 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 disabled:opacity-60 dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          {isExportingDocx ? "Preparing…" : "Download Word (.docx)"}
        </button>
      </div>
      {docxError && <p className="mt-2 text-center text-xs text-red-600 dark:text-red-400">{docxError}</p>}
    </div>
  );
}