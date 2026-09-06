/**
 * Practical, non-strict phone validation. Rejects obviously invalid input
 * (too short/long, no digits) without enforcing exact carrier-level rules.
 */
export function isValidPhoneNumber(countryCode: string, rawNumber: string): boolean {
  const digits = rawNumber.replace(/\D/g, "");
  if (!digits) return false;
  if (countryCode === "PH") return digits.length === 10 && digits.startsWith("9");
  if (countryCode === "US" || countryCode === "CA") return digits.length === 10;
  return digits.length >= 7 && digits.length <= 12;
}