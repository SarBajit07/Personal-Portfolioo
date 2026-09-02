import type { ComponentType } from "react";

/**
 * TRD §5. The shape of a case study.
 *
 * `problem`, `approach` and `outcome` are one-line abstracts, not the long
 * form — the long form is the `Body` component. They exist as fields because
 * the projects index, the OG image and the page description all need them
 * without reading prose.
 *
 * There is no `order` field. The registry array in `content/projects/index.ts`
 * *is* the order, which removes the "two projects claim order 2" failure mode
 * rather than validating for it.
 */

export interface ProjectLink {
  readonly label: string;
  readonly url: string;
}

export interface ProjectMeta {
  /** Lowercase kebab-case. Becomes the URL. */
  readonly slug: string;
  readonly title: string;
  /** One line, under 90 characters. Shown in the index rows. */
  readonly summary: string;
  /** e.g. "Full-stack developer & QA" */
  readonly role: string;
  /** e.g. ["NestJS", "Next.js", "PostgreSQL"] */
  readonly stack: readonly string[];
  /** What the project solves, in one sentence. */
  readonly problem: string;
  /** The decision that mattered most, in one sentence. */
  readonly approach: string;
  /** Result and current status, in one sentence. */
  readonly outcome: string;
  /** Featured projects appear on the home page. */
  readonly featured: boolean;
  readonly links?: readonly ProjectLink[];
  readonly coverImage?: string;

  /** Displayed in the gutter, e.g. "Mar 2024 – Jan 2025". */
  readonly dates: string;
  /** e.g. "In production", "Archived". */
  readonly status: string;

  /** Drafts never route and never appear in any listing. */
  readonly draft: boolean;
  /**
   * The body is still a skeleton. While true the page renders a draft notice
   * and is served noindex, and `npm run check:launch` fails. Starts true, so
   * publishing half-written prose has to be a deliberate act.
   */
  readonly draftCopy: boolean;
}

/** One file in `content/projects/`: its metadata and its prose. */
export interface ProjectModule {
  readonly meta: ProjectMeta;
  readonly Body: ComponentType;
}
