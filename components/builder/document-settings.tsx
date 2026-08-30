"use client";

import { useDocumentContext } from "@/context/document-context";
import { TemplatePicker } from "@/components/builder/template-picker";
import { FontPicker } from "@/components/builder/font-picker";

export function DocumentSettings() {
  const { state, dispatch } = useDocumentContext();

  return (
    <section className="mb-8 rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#121824]/80">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1 max-w-sm">
          <TemplatePicker 
            variant="compact" 
            selectedId={state.selectedTemplateId} 
            onSelect={(id) => dispatch({ type: "SET_TEMPLATE", payload: id })} 
          />
        </div>
        <div className="flex-1 max-w-[200px]">
          <FontPicker 
            selectedId={state.selectedFontId} 
            onSelect={(id) => dispatch({ type: "SET_FONT", payload: id })} 
          />
        </div>
        <div>
          {/* Mobile Preview toggle placeholder or standard expand button */}
          <button
            type="button"
            className="flex h-9 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 xl:hidden"
            onClick={() => {
              // Scroll down to preview area on mobile if needed, or trigger modal
              window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            }}
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z" />
              <circle cx="10" cy="10" r="3" />
            </svg>
            Preview
          </button>
        </div>
      </div>
    </section>
  );
}
