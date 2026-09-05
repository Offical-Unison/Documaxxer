"use client";

import { COUNTRIES } from "@/lib/countries";

interface PhoneFieldProps {
  countryCode: string;
  number: string;
  onCountryChange: (code: string) => void;
  onNumberChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export function PhoneField({ countryCode, number, onCountryChange, onNumberChange, error, required }: PhoneFieldProps) {
  return (
    <div>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Phone number
        {required && <span className="ml-1 text-blue-600 dark:text-blue-400">*</span>}
      </span>
      <div className="mt-1.5 flex gap-2">
        <select
          value={countryCode}
          onChange={(event) => onCountryChange(event.target.value)}
          aria-label="Country code"
          className="min-h-11 w-24 rounded-xl border border-slate-200/80 bg-white px-2.5 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none dark:border-slate-700/80 dark:bg-[#1A2234]/90 dark:text-slate-100"
        >
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.code}>{country.dial} {country.code}</option>
          ))}
        </select>
        <input
          type="tel"
          value={number}
          onChange={(event) => onNumberChange(event.target.value)}
          placeholder="912 345 6789"
          aria-label="Phone number"
          className="min-h-11 flex-1 rounded-xl border border-slate-200/80 bg-white px-3.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none dark:border-slate-700/80 dark:bg-[#1A2234]/90 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}