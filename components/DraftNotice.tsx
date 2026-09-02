/**
 * Shown on any page whose content still contains a TODO marker. The page is
 * also served noindex while that is true — see the `robots` export on each
 * route. Both disappear on their own once the copy lands; nothing to remember
 * to remove at launch.
 */
export function DraftNotice() {
  return (
    <p className="label border-y border-y-rule py-3 text-accent">
      Draft — this page is still the working brief, not final copy.
    </p>
  );
}

/** True if a string still carries an unanswered interview marker. */
export function hasTodo(...values: readonly (string | readonly string[])[]): boolean {
  return values.flat().some((v) => v.includes("TODO(sarbajit)")); // todo-audit-ok
}
