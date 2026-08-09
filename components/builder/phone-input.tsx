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
  const dial = COUNTRIES.find((country) => country.code === countryCode)?.dial ?? "+63";
  return (
    <div>
      <span className="text-sm font-medium text-slate-700">Phone number{required && <span className="ml-1 text-blue-600">*</span>}</span>
      <div className="mt-1.5 flex gap-2">
        <select
          value={countryCode}
          onChange={(event) => onCountryChange(event.target.value)}
          aria-label="Country code"
          className="min-h-11 w-24 rounded-xl border border-slate-200 bg-white/80 px-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none"
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
          className="min-h-11 flex-1 rounded-xl border border-slate-200 bg-white/80 px-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}