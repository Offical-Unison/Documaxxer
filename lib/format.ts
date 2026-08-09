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

/**
 * Returns a new array with entries sorted most-recent-first: entries marked
 * "current" always sort ahead of completed ones, ties are broken by comparing
 * "YYYY-MM" date strings lexically. The input array is never mutated.
 */
export function sortEntriesByRecency<T extends { current: boolean; startDate: string; endDate: string }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => {
    if (a.current !== b.current) return a.current ? -1 : 1;
    const aKey = a.current ? a.startDate : a.endDate || a.startDate;
    const bKey = b.current ? b.startDate : b.endDate || b.startDate;
    if (!aKey && !bKey) return 0;
    if (!aKey) return 1;
    if (!bKey) return -1;
    return aKey < bKey ? 1 : aKey > bKey ? -1 : 0;
  });
}