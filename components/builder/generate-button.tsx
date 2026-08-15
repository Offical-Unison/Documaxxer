"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-800">Download your resume</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Button onClick={handlePdf} className="w-full justify-center">Download PDF</Button>
        <Button onClick={handleDocx} disabled={isExportingDocx} className="w-full justify-center bg-slate-800 hover:bg-slate-900">
          {isExportingDocx ? "Preparing…" : "Download Word (.docx)"}
        </Button>
      </div>
      <p className="mt-2.5 text-center text-xs text-slate-400">
        PDF opens your browser&apos;s print dialog — choose &quot;Save as PDF&quot; as the destination.
      </p>
      {docxError && <p className="mt-2 text-center text-xs text-red-600">{docxError}</p>}
    </div>
  );
}
