"use client";

interface BulletListInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  /** Show a leading "•" per row. Set false for compact chip-like lists (e.g. awards). */
  bulletMark?: boolean;
}

/** Compact repeated-input list: one row per value, no per-row label, add/remove controls. */
export function BulletListInput({ label, values, onChange, placeholder = "Add a detail", addLabel = "+ Add bullet", bulletMark = true }: BulletListInputProps) {
  const update = (index: number, value: string) => onChange(values.map((item, itemIndex) => (itemIndex === index ? value : item)));
  const remove = (index: number) => onChange(values.filter((_, itemIndex) => itemIndex !== index));
  return (
    <div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-1.5 space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex items-center gap-2">
            {bulletMark && <span className="text-slate-400" aria-hidden="true">•</span>}
            <input
              value={value}
              onChange={(event) => update(index, event.target.value)}
              placeholder={placeholder}
              className="min-h-10 flex-1 rounded-lg border border-slate-200 bg-white/80 px-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
            <button type="button" onClick={() => remove(index)} aria-label={`Remove item ${index + 1}`} className="shrink-0 text-sm font-bold text-slate-400 hover:text-red-600">x</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...values, ""])} className="mt-2 min-h-9 rounded-lg border border-blue-200 bg-white/60 px-3 text-xs font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50">{addLabel}</button>
    </div>
  );
}