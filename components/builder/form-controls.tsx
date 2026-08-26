"use client";

import { useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { useFieldSuggestions } from "@/lib/suggestions";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; suggestionKey?: string };

export function Field({ label, error, className = "", id, suggestionKey, ...props }: FieldProps) {
  const fieldId = id ?? props.name;
  const [localError, setLocalError] = useState<string>();
  const { onBlur, type, ...inputProps } = props;
  const { suggestions, record } = useFieldSuggestions(suggestionKey ?? "__unused__");
  const listId = suggestionKey ? `${fieldId}-suggestions` : undefined;

  const validate = (value: string) => {
    if (!value || (type !== "email" && type !== "url")) return undefined;
    if (type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : "Enter a valid email address.";
    try { new URL(value.startsWith("http") ? value : `https://${value}`); return undefined; } catch { return "Enter a valid URL."; }
  };

  return (
    <label className={`block ${className}`} htmlFor={fieldId}>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {inputProps.required && <span className="ml-1 text-blue-600 dark:text-blue-400">*</span>}
      </span>
      <input
        id={fieldId}
        type={type}
        list={listId}
        className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200/90 bg-white/90 px-3.5 text-sm text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] placeholder:text-slate-400 transition hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-slate-700/80 dark:bg-[#1A2234]/90 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-500/20 dark:disabled:bg-slate-800/50"
        onBlur={(event) => {
          setLocalError(validate(event.target.value));
          if (suggestionKey) record(event.target.value);
          onBlur?.(event);
        }}
        {...inputProps}
      />
      {listId && (
        <datalist id={listId}>
          {suggestions.map((item) => <option key={item} value={item} />)}
        </datalist>
      )}
      {(error ?? localError) && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error ?? localError}</p>}
    </label>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string; error?: string };

export function Textarea({ label, hint, error, className = "", id, ...props }: TextareaProps) {
  const fieldId = id ?? props.name;
  return (
    <label className={`block ${className}`} htmlFor={fieldId}>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <textarea
        id={fieldId}
        className="mt-1.5 min-h-28 w-full rounded-xl border border-slate-200/90 bg-white/90 px-3.5 py-2.5 text-sm text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] placeholder:text-slate-400 transition hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 focus:bg-white focus:outline-none dark:border-slate-700/80 dark:bg-[#1A2234]/90 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-500/20"
        {...props}
      />
      {hint && <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </label>
  );
}

export function EntryCard({ title, children, onRemove }: { title: string; children: ReactNode; onRemove: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 shadow-[0_1px_3px_rgba(15,23,42,0.03)] dark:border-slate-800/80 dark:bg-[#161D2B]/90">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="text-left text-sm font-semibold text-slate-800 transition hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
        >
          {title}
          <span className="ml-2 text-xs font-medium text-slate-400 dark:text-slate-500">{open ? "Hide" : "Edit"}</span>
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
        >
          Remove
        </button>
      </div>
      {open && <div className="border-t border-slate-200/70 p-4 dark:border-slate-800/80">{children}</div>}
    </div>
  );
}

export function AddButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 min-h-11 rounded-xl border border-blue-200/90 bg-blue-50/70 px-4 text-sm font-semibold text-blue-700 shadow-[0_1px_2px_rgba(37,99,235,0.05)] transition hover:border-blue-300 hover:bg-blue-100/70 dark:border-blue-400/30 dark:bg-blue-500/15 dark:text-blue-300 dark:hover:border-blue-400/50 dark:hover:bg-blue-500/25"
    >
      {children}
    </button>
  );
}

export function TagInput({ label, values, onChange, placeholder, suggestionKey }: { label: string; values: string[]; onChange: (values: string[]) => void; placeholder: string; suggestionKey?: string }) {
  const [value, setValue] = useState("");
  const { suggestions, record } = useFieldSuggestions(suggestionKey ?? "__unused__");
  const listId = suggestionKey ? `${label.replace(/\s+/g, "-").toLowerCase()}-suggestions` : undefined;

  const add = () => {
    const next = value.trim();
    if (next && !values.some((item) => item.toLowerCase() === next.toLowerCase())) {
      onChange([...values, next]);
      if (suggestionKey) record(next);
    }
    setValue("");
  };

  return (
    <div>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <div className="mt-1.5 rounded-xl border border-slate-200/90 bg-white/90 p-2 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-700/80 dark:bg-[#1A2234]/90">
        <div className="flex flex-wrap gap-2">
          {values.map((item) => (
            <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-blue-50/90 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
              {item}
              <button
                type="button"
                onClick={() => onChange(values.filter((valueItem) => valueItem !== item))}
                aria-label={`Remove ${item}`}
                className="flex h-4 w-4 items-center justify-center rounded-full text-blue-400 transition hover:bg-blue-100 hover:text-blue-600 dark:text-blue-400 dark:hover:bg-blue-500/30 dark:hover:text-blue-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            list={listId}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); add(); } }}
            placeholder={placeholder}
            className="min-h-11 flex-1 px-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <button
            type="button"
            onClick={add}
            className="rounded-lg bg-blue-50 px-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-500/20 dark:text-blue-300 dark:hover:bg-blue-500/30"
          >
            Add
          </button>
        </div>
        {listId && (
          <datalist id={listId}>
            {suggestions.filter((item) => !values.includes(item)).map((item) => <option key={item} value={item} />)}
          </datalist>
        )}
      </div>
    </div>
  );
}