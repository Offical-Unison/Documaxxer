"use client";

import { useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };

export function Field({ label, error, className = "", id, ...props }: FieldProps) {
  const fieldId = id ?? props.name;
  const [localError, setLocalError] = useState<string>();
  const { onBlur, type, ...inputProps } = props;

  const validate = (value: string) => {
    if (!value || (type !== "email" && type !== "url")) return undefined;
    if (type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : "Enter a valid email address.";
    try { new URL(value.startsWith("http") ? value : `https://${value}`); return undefined; } catch { return "Enter a valid URL."; }
  };

  return (
    <label className={`block ${className}`} htmlFor={fieldId}>
      <span className="text-sm font-medium text-slate-700">
        {label}
        {inputProps.required && <span className="ml-1 text-blue-600">*</span>}
      </span>
      <input
        id={fieldId}
        type={type}
        className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200/80 bg-white px-3.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50"
        onBlur={(event) => { setLocalError(validate(event.target.value)); onBlur?.(event); }}
        {...inputProps}
      />
      {(error ?? localError) && <p className="mt-1.5 text-xs text-red-600">{error ?? localError}</p>}
    </label>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string; error?: string };

export function Textarea({ label, hint, error, className = "", id, ...props }: TextareaProps) {
  const fieldId = id ?? props.name;
  return (
    <label className={`block ${className}`} htmlFor={fieldId}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        id={fieldId}
        className="mt-1.5 min-h-28 w-full rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
        {...props}
      />
      {hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </label>
  );
}

export function EntryCard({ title, children, onRemove }: { title: string; children: ReactNode; onRemove: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 shadow-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="text-left text-sm font-semibold text-slate-800 transition hover:text-slate-950"
        >
          {title}
          <span className="ml-2 text-xs font-medium text-slate-400">{open ? "Hide" : "Edit"}</span>
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-600"
        >
          Remove
        </button>
      </div>
      {open && <div className="border-t border-slate-100 p-4">{children}</div>}
    </div>
  );
}

export function AddButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 min-h-10 rounded-xl border border-blue-200/80 bg-blue-50/50 px-4 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
    >
      {children}
    </button>
  );
}

export function TagInput({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (values: string[]) => void; placeholder: string }) {
  const [value, setValue] = useState("");

  const add = () => {
    const next = value.trim();
    if (next && !values.some((item) => item.toLowerCase() === next.toLowerCase())) {
      onChange([...values, next]);
    }
    setValue("");
  };

  return (
    <div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-1.5 rounded-xl border border-slate-200/80 bg-white p-2 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {values.map((item) => (
            <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              {item}
              <button
                type="button"
                onClick={() => onChange(values.filter((valueItem) => valueItem !== item))}
                aria-label={`Remove ${item}`}
                className="flex h-4 w-4 items-center justify-center rounded-full text-blue-400 transition hover:bg-blue-100 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); add(); } }}
            placeholder={placeholder}
            className="min-h-9 flex-1 px-2 text-sm outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={add}
            className="rounded-lg bg-blue-50 px-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
