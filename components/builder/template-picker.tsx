"use client";

import { RESUME_TEMPLATES, type TemplateId } from "@/lib/templates";

import { useDocumentContext } from "@/context/document-context";

interface TemplatePickerProps {
  selectedId: string | null;
  onSelect: (id: TemplateId) => void;
  variant?: "grid" | "compact";
}

export function TemplatePicker({ selectedId, onSelect, variant = "grid" }: TemplatePickerProps) {
  const { state } = useDocumentContext();
  const filteredTemplates = RESUME_TEMPLATES.filter(t => t.type === state.documentType);

  if (variant === "compact") {
    return (
      <div className="w-full">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Template</p>
        <select
          value={selectedId ?? ""}
          onChange={(event) => onSelect(event.target.value as TemplateId)}
          aria-label="Resume template"
          className="min-h-9 w-full appearance-none rounded-xl border border-slate-200/80 bg-white/80 bg-no-repeat px-3 text-sm text-slate-700 shadow-sm backdrop-blur transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none dark:border-slate-700/80 dark:bg-[#1A2234]/90 dark:text-slate-200"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%2364748b' stroke-width='1.6'%3E%3Cpath d='M5 7.5l5 5 5-5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundPosition: "right 0.60rem center",
            backgroundSize: "1rem",
          }}
        >
          {filteredTemplates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        {filteredTemplates.map((template) => {
          const active = selectedId === template.id;
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            aria-pressed={active}
            className={`group flex flex-col items-start rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-1 active:scale-[0.98] ${
              active
                ? "border-blue-500 bg-blue-50/80 shadow-[0_8px_24px_rgba(37,99,235,0.14)] dark:border-blue-400/60 dark:bg-blue-500/15 dark:shadow-[0_4px_20px_rgba(37,99,235,0.2)]"
                : "border-slate-200/90 bg-white/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-md dark:border-slate-800/80 dark:bg-[#161D2B]/80 dark:hover:border-slate-700 dark:hover:bg-[#1C2536]"
            }`}
          >
            <TemplateThumbnail id={template.id} />
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">{template.name}</h3>
            <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">{template.description}</p>
            {active && (
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M3.5 8.5l3 3 6-6" />
                </svg>
                Selected
              </span>
            )}
          </button>
        );
      })}
      </div>
    </div>
  );
}

function TemplateThumbnail({ id }: { id: TemplateId }) {
  return (
    <div className="h-24 w-full rounded-lg border border-slate-200/90 bg-slate-50/80 p-2 shadow-inner dark:border-slate-700/80 dark:bg-[#1A2234]">
      {id === "ats-classic" && (
        <div className="flex h-full flex-col items-center gap-1">
          <div className="h-1.5 w-12 rounded-full bg-slate-800 dark:bg-slate-200" />
          <div className="h-1 w-16 rounded-full bg-slate-400" />
          <div className="mt-1 h-0.5 w-full bg-slate-300 dark:bg-slate-600" />
          <div className="mt-1 h-1 w-full rounded-full bg-slate-300 dark:bg-slate-600" />
          <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-1 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
      )}
      {id === "modern-tech" && (
        <div className="flex h-full flex-col gap-1">
          <div className="h-1.5 w-14 rounded-full bg-slate-800 dark:bg-slate-200" />
          <div className="h-1 w-10 rounded-full bg-blue-400" />
          <div className="mt-1 flex gap-1">
            <div className="h-1 w-4 rounded-full bg-slate-300" />
            <div className="h-1 w-6 rounded-full bg-slate-300" />
            <div className="h-1 w-5 rounded-full bg-slate-300" />
          </div>
          <div className="mt-1 h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-1 w-5/6 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
      )}
      {id === "executive" && (
        <div className="flex h-full gap-1.5">
          <div className="flex-1 space-y-1">
            <div className="h-1.5 w-12 rounded-full bg-slate-800 dark:bg-slate-200" />
            <div className="h-1 w-full rounded-full bg-slate-300 dark:bg-slate-600" />
            <div className="mt-2 h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="w-1/3 space-y-1 rounded bg-slate-100 p-1 dark:bg-slate-800">
            <div className="h-1 w-full rounded-full bg-slate-300 dark:bg-slate-500" />
            <div className="h-1 w-2/3 rounded-full bg-slate-200 dark:bg-slate-600" />
          </div>
        </div>
      )}
      {id === "academic" && (
        <div className="flex h-full flex-col items-center gap-1">
          <div className="h-1.5 w-14 rounded-full bg-slate-800 dark:bg-slate-200" />
          <div className="mt-1 h-0.5 w-10 bg-slate-400" />
          <div className="mt-1 w-full space-y-0.5">
            <div className="h-0.5 w-full bg-slate-200 dark:bg-slate-700" />
            <div className="h-0.5 w-full bg-slate-200 dark:bg-slate-700" />
            <div className="h-0.5 w-5/6 bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="mt-0.5 w-full space-y-0.5">
            <div className="h-0.5 w-full bg-slate-200 dark:bg-slate-700" />
            <div className="h-0.5 w-4/5 bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      )}
      {id === "research" && (
        <div className="flex h-full flex-col gap-1">
          <div className="h-1.5 w-16 rounded-full bg-slate-800 dark:bg-slate-200" />
          <div className="mt-1 h-1 w-1/4 rounded-full bg-blue-500" />
          <div className="ml-2 mt-1 space-y-0.5 border-l border-slate-300 pl-1 dark:border-slate-600">
            <div className="h-0.5 w-full bg-slate-300 dark:bg-slate-600" />
            <div className="h-0.5 w-11/12 bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="ml-2 space-y-0.5 border-l border-slate-300 pl-1 dark:border-slate-600">
            <div className="h-0.5 w-full bg-slate-300 dark:bg-slate-600" />
            <div className="h-0.5 w-5/6 bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      )}
      {id === "professional" && (
        <div className="flex h-full flex-col gap-1.5">
          <div className="flex items-end justify-between border-b border-slate-300 pb-1 dark:border-slate-600">
            <div className="h-1.5 w-12 rounded-full bg-slate-800 dark:bg-slate-200" />
            <div className="h-1 w-16 rounded-full bg-slate-400" />
          </div>
          <div className="flex gap-1.5">
            <div className="w-1/4 space-y-1">
              <div className="h-1 w-full rounded-full bg-blue-400" />
              <div className="h-1 w-2/3 rounded-full bg-slate-300" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="h-1 w-full rounded-full bg-slate-300 dark:bg-slate-600" />
              <div className="h-1 w-5/6 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}