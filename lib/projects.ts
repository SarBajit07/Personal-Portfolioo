import { projects } from "@/content/projects";
import type { ProjectMeta, ProjectModule } from "@/types/project";

/**
 * Reading the register. The register itself — and the invariants a type cannot
 * express — live in `content/projects/index.ts`, so this file is only queries.
 */

/** Every published project, in index order. */
export function allProjects(): readonly ProjectModule[] {
  return projects;
}

export function featuredProjects(): readonly ProjectModule[] {
  return projects.filter((p) => p.meta.featured);
}

export function projectSlugs(): string[] {
  return projects.map((p) => p.meta.slug);
}

export function findProject(slug: string): ProjectModule | undefined {
  return projects.find((p) => p.meta.slug === slug);
}

export interface Neighbour {
  readonly meta: ProjectMeta;
  /** 1-based position on the index, for the row numeral. */
  readonly position: number;
}

/**
 * The previous and next project, for the foot of a case study. Wraps, so the
 * last project leads back to the first — a dead end at the bottom of the best
 * page on the site would be a waste.
 */
export function neighbours(
  slug: string,
): { prev: Neighbour; next: Neighbour } | undefined {
  const i = projects.findIndex((p) => p.meta.slug === slug);
  if (i < 0 || projects.length < 2) return undefined;

  const at = (n: number): Neighbour => {
    const wrapped = (n + projects.length) % projects.length;
    return { meta: projects[wrapped]!.meta, position: wrapped + 1 };
  };

  return { prev: at(i - 1), next: at(i + 1) };
}
