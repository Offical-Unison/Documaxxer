"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Card } from "@/components/ui/card";
import { ResumePreview } from "@/components/builder/resume-preview";
import { TemplatePicker } from "@/components/builder/template-picker";
import { FontPicker } from "@/components/builder/font-picker";
import { useResumeContext } from "@/context/resume-context";
import type { TemplateId } from "@/lib/templates";

function ExpandIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d="M7.5 3H3v4.5" />
      <path d="M12.5 3H17v4.5" />
      <path d="M7.5 17H3v-4.5" />
      <path d="M12.5 17H17v-4.5" />
    </svg>
  );
}

export function ResumePreviewContainer() {
  const { state, dispatch } = useResumeContext();
  // Lifted here so the inline preview and the expanded modal share one page state.
  const [pageIndex, setPageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const changeTemplate = (id: TemplateId) => {
    dispatch({ type: "SET_TEMPLATE", payload: id });
    setPageIndex(0); // layout changes with template; avoid landing on a now-invalid page
  };

  return (
    <Card aria-labelledby="preview-title" className="xl:sticky xl:top-6 xl:self-start">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Preview</p>
          <h2 id="preview-title" className="mt-2 text-xl font-semibold">Your resume</h2>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-1 inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white/70 px-3 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          <ExpandIcon />
          Expand
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div className="min-w-0 flex-1">
          <TemplatePicker variant="compact" selectedId={state.selectedTemplateId} onSelect={changeTemplate} />
        </div>
        <div className="min-w-0 flex-1 sm:max-w-[160px]">
          <FontPicker selectedId={state.selectedFontId} onSelect={(id) => dispatch({ type: "SET_FONT", payload: id })} />
        </div>
      </div>
      <div className="mt-5">
        <ResumePreview pageIndex={pageIndex} onPageIndexChange={setPageIndex} maxHeight="70vh" />
      </div>
      {expanded && <ExpandedPreviewModal pageIndex={pageIndex} onPageIndexChange={setPageIndex} onClose={() => setExpanded(false)} />}
    </Card>
  );
}

function ExpandedPreviewModal({ pageIndex, onPageIndexChange, onClose }: { pageIndex: number; onPageIndexChange: (index: number) => void; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8" role="dialog" aria-modal="true" aria-label="Expanded resume preview">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full max-h-[90vh] w-full max-w-4xl flex-col items-center justify-center">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close expanded preview"
          className="absolute -top-3 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-semibold text-slate-700 shadow-md transition hover:bg-slate-50 sm:-top-4 sm:-right-4"
        >
          ×
        </button>
        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl">
          <ResumePreview pageIndex={pageIndex} onPageIndexChange={onPageIndexChange} maxHeight="86vh" />
        </div>
      </div>
    </div>,
    document.body
  );
}