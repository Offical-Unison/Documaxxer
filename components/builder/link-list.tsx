"use client";

import type { ResumeLink } from "@/types/resume";

interface LinkListInputProps {
  values: ResumeLink[];
  onChange: (values: ResumeLink[]) => void;
  makeId: () => string;
}

export function LinkListInput({ values, onChange, makeId }: LinkListInputProps) {
  const update = (id: string, key: keyof ResumeLink, value: string) => onChange(values.map((link) => (link.id === id ? { ...link, [key]: value } : link)));
  const remove = (id: string) => onChange(values.filter((link) => link.id !== id));

  return (
    <div>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Links</span>
      <div className="mt-1.5 space-y-2">
        {values.map((link) => (
          <div key={link.id} className="flex items-center gap-2">
            <input
              value={link.name}
              onChange={(event) => update(link.id, "name", event.target.value)}
              placeholder="LinkedIn"
              aria-label="Link name"
              className="min-h-10 w-32 shrink-0 rounded-lg border border-slate-200/80 bg-white px-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none dark:border-slate-700/80 dark:bg-[#1A2234]/90 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <input
              value={link.url}
              onChange={(event) => update(link.id, "url", event.target.value)}
              placeholder="linkedin.com/in/johndoe"
              aria-label="Link URL"
              className="min-h-10 flex-1 rounded-lg border border-slate-200/80 bg-white px-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none dark:border-slate-700/80 dark:bg-[#1A2234]/90 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => remove(link.id)}
              aria-label={`Remove ${link.name || "link"}`}
              className="shrink-0 flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:text-slate-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...values, { id: makeId(), name: "", url: "" }])}
        className="mt-2 min-h-9 rounded-lg border border-blue-200/80 bg-blue-50/50 px-3 text-xs font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:border-blue-400/50 dark:hover:bg-blue-500/20"
      >
        + Add link
      </button>
    </div>
  );
}