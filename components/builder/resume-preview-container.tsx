"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
    <div aria-labelledby="preview-title" className="flex flex-col pb-12">
      {/* Floating Toolbar */}
      <div className="sticky top-6 z-10 mx-auto mb-8 flex w-full max-w-2xl flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-3 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#121824]/80 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 min-w-0 items-center gap-3">
          <div className="flex-1 min-w-0">
            <TemplatePicker variant="compact" selectedId={state.selectedTemplateId} onSelect={changeTemplate} />
          </div>
          <div className="flex-1 min-w-0 max-w-[140px]">
            <FontPicker selectedId={state.selectedFontId} onSelect={(id) => dispatch({ type: "SET_FONT", payload: id })} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 shrink-0 border-t border-slate-200/60 pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-3 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-label="Expand preview"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100"
          >
            <ExpandIcon />
          </button>
          {state.generateUnlocked && (
            <GenerateButton />
          )}
        </div>
      </div>

      {/* Document Area */}
      <div className="relative mx-auto w-full max-w-[850px]">
        <ResumePreview pageIndex={pageIndex} onPageIndexChange={setPageIndex} maxHeight="none" />
      </div>

      {expanded && <ExpandedPreviewModal pageIndex={pageIndex} onPageIndexChange={setPageIndex} onClose={() => setExpanded(false)} />}
    </div>
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