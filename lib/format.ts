/**
 * Formats a "YYYY-MM" month input value into a readable "Mon YYYY" string.
 * Returns the raw input unchanged if it doesn't match the expected shape.
 */
export function formatMonthYear(value: string): string {
  if (!value) return "";
  const [year, month] = value.split("-");
  const monthIndex = Number(month) - 1;
  if (!year || Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return value;
  const label = new Date(Number(year), monthIndex, 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  return label;
}

/** Formats a start/end date pair, respecting "current" (ongoing) entries. */
export function formatDateRange(startDate: string, endDate: string, current: boolean): string {
  const start = formatMonthYear(startDate);
  if (!start) return "";
  const end = current ? "Present" : formatMonthYear(endDate);
  return end ? `${start} – ${end}` : start;
}