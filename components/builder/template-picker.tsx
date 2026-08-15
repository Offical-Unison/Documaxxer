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
      <div className="w-full">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Template</p>
        <select
          value={selectedId ?? ""}
          onChange={(event) => onSelect(event.target.value as TemplateId)}
          aria-label="Resume template"
          className="min-h-9 w-full appearance-none rounded-xl border border-slate-200/80 bg-white/80 bg-no-repeat px-3 text-sm text-slate-700 shadow-sm backdrop-blur transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%2364748b' stroke-width='1.6'%3E%3Cpath d='M5 7.5l5 5 5-5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundPosition: "right 0.60rem center",
            backgroundSize: "1rem",
          }}
        >
          {RESUME_TEMPLATES.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
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
              active
                ? "border-blue-400 bg-blue-50/70 shadow-[0_8px_24px_rgba(37,99,235,0.10)]"
                : "border-slate-200/80 bg-white/60 shadow-sm hover:border-blue-200 hover:bg-blue-50/30"
            }`}
          >
            <TemplateThumbnail id={template.id} />
            <h3 className="mt-4 text-base font-bold text-slate-900">{template.name}</h3>
            <p className="mt-1.5 text-sm leading-6 text-slate-500">{template.description}</p>
            {active && <span className="mt-3 text-xs font-semibold text-blue-700">✓ Selected</span>}
          </button>
        );
      })}
    </div>
  );
}

function TemplateThumbnail({ id }: { id: TemplateId }) {
  return (
    <div className="h-24 w-full rounded-lg border border-slate-200/80 bg-white p-2 shadow-sm">
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
