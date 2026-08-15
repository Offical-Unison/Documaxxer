"use client";

interface BulletListInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  bulletMark?: boolean;
}

export function BulletListInput({ label, values, onChange, placeholder = "Add a detail", addLabel = "+ Add", bulletMark = true }: BulletListInputProps) {
  const update = (index: number, value: string) => onChange(values.map((item, itemIndex) => (itemIndex === index ? value : item)));
  const remove = (index: number) => onChange(values.filter((_, itemIndex) => itemIndex !== index));

  return (
    <div>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <div className="mt-1.5 space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex items-center gap-2">
            {bulletMark && <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">•</span>}
            <input
              value={value}
              onChange={(event) => update(index, event.target.value)}
              placeholder={placeholder}
              className="min-h-10 flex-1 rounded-lg border border-slate-200/80 bg-white px-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              aria-label={`Remove item ${index + 1}`}
              className="shrink-0 flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:text-slate-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...values, ""])}
        className="mt-2 min-h-9 rounded-lg border border-blue-200/80 bg-blue-50/50 px-3 text-xs font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:border-blue-400/50 dark:hover:bg-blue-500/20"
      >
        {addLabel}
      </button>
    </div>
  );
}