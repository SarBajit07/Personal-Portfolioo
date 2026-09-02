import type { ReactNode } from "react";

/**
 * Sits in the right gutter (columns 9–12) beside the paragraph it annotates.
 * Below lg it collapses to an inline aside under that paragraph — indented and
 * rule-marked, never boxed into a card.
 */
export function MarginNote({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <aside className="mt-3 mb-6 border-l border-l-rule pl-4 text-note text-ink-3 lg:mt-0 lg:mb-0 lg:border-l-0 lg:pl-0">
      {label ? <span className="label block mb-1">{label}</span> : null}
      {children}
    </aside>
  );
}
