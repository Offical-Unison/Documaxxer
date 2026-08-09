export interface Country { code: string; name: string; dial: string; }

/** Small, curated list — Philippines first as the default. Extend as needed. */
export const COUNTRIES: Country[] = [
  { code: "PH", name: "Philippines", dial: "+63" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "SG", name: "Singapore", dial: "+65" },
  { code: "JP", name: "Japan", dial: "+81" },
  { code: "AE", name: "United Arab Emirates", dial: "+971" },
  { code: "SA", name: "Saudi Arabia", dial: "+966" },
  { code: "HK", name: "Hong Kong", dial: "+852" },
  { code: "IN", name: "India", dial: "+91" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "NZ", name: "New Zealand", dial: "+64" },
  { code: "MY", name: "Malaysia", dial: "+60" },
  { code: "ID", name: "Indonesia", dial: "+62" },
  { code: "KR", name: "South Korea", dial: "+82" },
  { code: "QA", name: "Qatar", dial: "+974" },
  { code: "KW", name: "Kuwait", dial: "+965" },
  { code: "IE", name: "Ireland", dial: "+353" },
];

export function getCountry(code: string): Country {
  return COUNTRIES.find((country) => country.code === code) ?? COUNTRIES[0];
}