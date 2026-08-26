"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Card } from "@/components/ui/card";
import { ResumePreview } from "@/components/builder/resume-preview";
import { GenerateButton } from "@/components/builder/generate-button";
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
  const [pageIndex, setPageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const changeTemplate = (id: TemplateId) => {
    dispatch({ type: "SET_TEMPLATE", payload: id });
    setPageIndex(0);
  };

  return (
    <Card aria-labelledby="preview-title" className="xl:sticky xl:top-6 xl:self-start">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Preview</p>
          <h2 id="preview-title" className="mt-2 text-xl font-bold tracking-tight text-slate-950 dark:text-slate-50">Your resume</h2>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-1 inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/80 px-3 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700/80 dark:bg-[#1A2234]/90 dark:text-slate-300 dark:hover:border-blue-400/40 dark:hover:bg-blue-500/15 dark:hover:text-blue-300"
        >
          <ExpandIcon />
          Expand
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
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

      <div className="mt-5">
        {state.generateUnlocked ? (
          <GenerateButton />
        ) : (
          <p className="text-center text-xs text-slate-400 dark:text-slate-500">
            Finish the form to download your resume.
          </p>
        )}
      </div>

      {expanded && <ExpandedPreviewModal pageIndex={pageIndex} onPageIndexChange={setPageIndex} onClose={() => setExpanded(false)} />}
    </Card>
  );
}

function ExpandedPreviewModal({ pageIndex, onPageIndexChange, onClose }: { pageIndex: number; onPageIndexChange: (index: number) => void; onClose: () => void }) {
  const stableOnClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") stableOnClose(); };
    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [stableOnClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" role="dialog" aria-modal="true" aria-label="Expanded resume preview">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" onClick={stableOnClose} />

      {/* Modal container — flex-col with close button at top and page nav pinned at bottom */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-3 px-4 py-6 sm:px-8 sm:py-8 animate-fade-in-scale" style={{ maxHeight: "100vh" }}>
        {/* Top bar: close button only */}
        <div className="flex w-full items-center justify-end">
          <button
            type="button"
            onClick={stableOnClose}
            aria-label="Close expanded preview"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-semibold text-slate-700 shadow-md transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            ×
          </button>
        </div>

        {/* Resume area — automatically scales to fit available space */}
        <div className="flex-1 min-h-0 w-full flex items-center justify-center">
          <ResumePreview pageIndex={pageIndex} onPageIndexChange={onPageIndexChange} maxHeight="100%" hideFooter className="h-full w-full" />
        </div>

        {/* Page nav + word count pinned below scroll area */}
        <ResumePreview pageIndex={pageIndex} onPageIndexChange={onPageIndexChange} footerOnly />
      </div>
    </div>,
    document.body
  );
}