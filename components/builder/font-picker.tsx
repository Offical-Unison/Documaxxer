"use client";

import { RESUME_FONTS } from "@/lib/fonts";

interface FontPickerProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function FontPicker({ selectedId, onSelect }: FontPickerProps) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Font</p>
      <select
        value={selectedId ?? ""}
        onChange={(event) => onSelect(event.target.value)}
        aria-label="Resume font"
        className="min-h-9 w-full appearance-none rounded-xl border border-slate-200/80 bg-white/80 bg-no-repeat px-3 text-sm text-slate-700 shadow-sm backdrop-blur transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none dark:border-slate-700/80 dark:bg-[#1A2234]/90 dark:text-slate-200"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%2364748b' stroke-width='1.6'%3E%3Cpath d='M5 7.5l5 5 5-5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundPosition: "right 0.60rem center",
          backgroundSize: "1rem",
        }}
      >
        {RESUME_FONTS.map((font) => (
          <option key={font.id} value={font.id} style={{ fontFamily: font.stack }}>
            {font.name}
          </option>
        ))}
      </select>
    </div>
  );
}