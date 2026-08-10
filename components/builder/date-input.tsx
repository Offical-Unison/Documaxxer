"use client";

import { getYearOptions } from "@/lib/years";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function parseValue(value: string): { year: string; month: string } {
  if (!value) return { year: "", month: "" };
  const [year, month] = value.split("-");
  return { year: year ?? "", month: month ?? "" };
}
function buildValue(year: string, month: string): string {
  return year ? (month ? `${year}-${month}` : year) : "";
}

interface PartialDateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

/** Year (dropdown, required when a date is entered) + optional month, stored as "YYYY" or "YYYY-MM". */
export function PartialDateField({ label, value, onChange, required, disabled, error }: PartialDateFieldProps) {
  const { year, month } = parseValue(value);
  const yearOptions = getYearOptions();
  return (
    <div>
      <span className="text-sm font-medium text-slate-700">{label}{required && <span className="ml-1 text-blue-600">*</span>}</span>
      <div className="mt-1.5 flex gap-2">
        <select
          disabled={disabled}
          value={year}
          onChange={(event) => onChange(buildValue(event.target.value, month))}
          aria-label={`${label} year`}
          className="min-h-11 w-28 rounded-xl border border-slate-200 bg-white/80 px-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          <option value="">Year</option>
          {yearOptions.map((yearOption) => (
            <option key={yearOption} value={String(yearOption)}>{yearOption}</option>
          ))}
        </select>
        <select
          disabled={disabled || !year}
          value={month}
          onChange={(event) => onChange(buildValue(year, event.target.value))}
          aria-label={`${label} month (optional)`}
          className="min-h-11 flex-1 rounded-xl border border-slate-200 bg-white/80 px-3 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          <option value="">Month (optional)</option>
          {MONTHS.map((name, index) => (
            <option key={name} value={String(index + 1).padStart(2, "0")}>{name}</option>
          ))}
        </select>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}