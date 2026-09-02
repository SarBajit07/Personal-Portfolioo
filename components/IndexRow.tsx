import Link from "next/link";

/**
 * The project index row: 01 / title / one line / stack / year.
 * Hairline-separated, whole row is the hit target. This exists so that a card
 * grid never has to (Phase 0.5, never #5).
 */
export function IndexRow({
  index,
  href,
  title,
  summary,
  stack,
  year,
}: {
  index: number;
  href: string;
  title: string;
  summary: string;
  stack: readonly string[];
  year: string;
}) {
  return (
    <Link
      href={href}
      className="group block border-t border-t-rule py-6 no-underline hover:bg-paper-2 focus-visible:bg-paper-2"
    >
      <div className="grid12 items-baseline">
        <span className="index-numeral col-span-1 -indent-[0.1em] lg:col-start-1">
          {String(index).padStart(2, "0")}
        </span>

        <div className="col-span-3 lg:col-start-2 lg:col-span-6">
          <h2 className="text-h3 group-hover:text-accent group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
            {title}
          </h2>
          <p className="mt-1 max-w-[54ch] text-small text-ink-2">{summary}</p>
        </div>

        <div className="col-span-4 mt-3 lg:col-start-9 lg:col-span-4 lg:mt-0 lg:text-right">
          <p className="font-mono text-caption text-ink-3">{stack.join(" · ")}</p>
          <p className="index-numeral mt-1">{year}</p>
        </div>
      </div>
    </Link>
  );
}
