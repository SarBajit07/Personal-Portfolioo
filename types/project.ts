/** A named link to something running. */
export interface LiveSite {
  /** What the visitor clicks, e.g. "Pana Events". */
  readonly label: string;
  readonly href: string;
}

/**
 * The shape of a project card.
 *
 * There are no case-study routes, so this is the whole record: what a visitor
 * sees is what exists. Optional fields are genuinely optional — a card renders
 * without an image, without links, and without a year, because inventing any of
 * those is worse than omitting them.
 */
export interface Project {
  /** Lowercase kebab-case. Used as the React key and the card anchor. */
  readonly slug: string;
  readonly title: string;
  /** Two or three sentences. Shown in full on the card. */
  readonly blurb: string;
  /** e.g. ["NestJS", "Next.js", "PostgreSQL"] */
  readonly stack: readonly string[];
  /** Path under /public, e.g. "/projects/nonamart.png". */
  readonly image?: string;
  /** Absolute URL to the running thing. */
  readonly live?: string;
  /**
   * Further live surfaces, for a project that shipped as more than one site.
   * Each needs its own label because "Live site" twice tells a visitor nothing.
   */
  readonly alsoLive?: readonly LiveSite[];
  /** Absolute URL to the repository. */
  readonly repo?: string;
  /** e.g. "2025". Rendered in the card corner when present. */
  readonly year?: string;
  /** Featured projects lead the grid. */
  readonly featured?: boolean;
}
