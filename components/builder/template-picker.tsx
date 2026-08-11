"use client";

import { RESUME_TEMPLATES, type TemplateId } from "@/lib/templates";

interface TemplatePickerProps {
  selectedId: string | null;
  onSelect: (id: TemplateId) => void;
  variant?: "grid" | "compact";
}

export function TemplatePicker({ selectedId, onSelect, variant = "grid" }: TemplatePickerProps) {
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white/70 p-1">
        {RESUME_TEMPLATES.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            aria-pressed={selectedId === template.id}
            className={`min-h-9 rounded-lg px-3 text-xs font-semibold transition ${
              selectedId === template.id ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
            }`}
          >
            {template.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {RESUME_TEMPLATES.map((template) => {
        const active = selectedId === template.id;
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            aria-pressed={active}
            className={`flex flex-col items-start rounded-2xl border p-5 text-left transition ${
              active ? "border-blue-400 bg-blue-50/70 shadow-[0_8px_20px_rgba(37,99,235,0.12)]" : "border-slate-200/90 bg-white/60 hover:border-blue-200"
            }`}
          >
            <TemplateThumbnail id={template.id} />
            <h3 className="mt-4 text-base font-semibold text-slate-900">{template.name}</h3>
            <p className="mt-1.5 text-sm leading-6 text-slate-600">{template.description}</p>
            {active && <span className="mt-3 text-xs font-semibold text-blue-700">✓ Selected</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Tiny abstract preview so users can distinguish layouts before committing. */
function TemplateThumbnail({ id }: { id: TemplateId }) {
  return (
    <div className="h-24 w-full rounded-lg border border-slate-200 bg-white p-2">
      {id === "classic" && (
        <div className="flex h-full flex-col items-center gap-1">
          <div className="h-1.5 w-12 rounded-full bg-slate-800" />
          <div className="h-1 w-16 rounded-full bg-slate-300" />
          <div className="mt-2 h-1 w-full rounded-full bg-slate-200" />
          <div className="h-1 w-full rounded-full bg-slate-200" />
          <div className="h-1 w-3/4 rounded-full bg-slate-200" />
        </div>
      )}
      {id === "modern" && (
        <div className="flex h-full flex-col gap-1">
          <div className="h-1.5 w-14 rounded-full bg-slate-800" />
          <div className="h-1 w-10 rounded-full bg-blue-400" />
          <div className="mt-2 h-1 w-full rounded-full bg-slate-200" />
          <div className="h-1 w-full rounded-full bg-slate-200" />
          <div className="h-1 w-2/3 rounded-full bg-slate-200" />
        </div>
      )}
      {id === "sidebar" && (
        <div className="flex h-full gap-1.5">
          <div className="w-1/3 space-y-1 rounded bg-blue-50 p-1">
            <div className="h-1 w-full rounded-full bg-blue-300" />
            <div className="h-1 w-full rounded-full bg-blue-200" />
            <div className="h-1 w-2/3 rounded-full bg-blue-200" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="h-1.5 w-10 rounded-full bg-slate-800" />
            <div className="h-1 w-full rounded-full bg-slate-200" />
            <div className="h-1 w-full rounded-full bg-slate-200" />
          </div>
        </div>
      )}
    </div>
  );
}