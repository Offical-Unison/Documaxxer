const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Formats a "YYYY" or "YYYY-MM" value, e.g. "Aug 2026" or "2026". Month is optional. */
export function formatPartialDate(value: string): string {
  if (!value) return "";
  const [year, month] = value.split("-");
  if (!year) return "";
  if (!month) return year;
  const monthIndex = Number(month) - 1;
  if (Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return year;
  return `${MONTH_NAMES[monthIndex]} ${year}`;
}

/** Formats a start/end partial-date pair, respecting "current" (ongoing) entries. */
export function formatDateRange(startDate: string, endDate: string, current: boolean): string {
  const start = formatPartialDate(startDate);
  if (!start) return "";
  const end = current ? "Present" : formatPartialDate(endDate);
  return end ? `${start} – ${end}` : start;
}

/**
 * Sorts start/end/current entries most-recent-first. "YYYY" is a string
 * prefix of any "YYYY-MM" in that year, so lexical comparison naturally
 * treats a year-only value as the earliest point in that year.
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

/** Sorts single-date entries (projects, certifications, awards, volunteering, other) most-recent-first. */
export function sortByDateDesc<T extends { date: string }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
  });
}