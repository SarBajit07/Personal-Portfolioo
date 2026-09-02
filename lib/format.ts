/**
 * The index rows show a year, not a date range — the range lives in the gutter
 * of the case study itself. Until the interview lands, `dates` is a marker
 * rather than a date, and this says so rather than inventing one.
 */
export function yearOf(dates: string): string {
  const years = dates.match(/\b(19|20)\d{2}\b/g);
  return years?.at(-1) ?? "TODO"; // todo-audit-ok
}
