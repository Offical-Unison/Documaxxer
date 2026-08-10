/** Reasonable year range for resume date pickers, newest first. Centralized so every date field stays in sync. */
export function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let year = currentYear + 6; year >= currentYear - 60; year -= 1) years.push(year);
  return years;
}