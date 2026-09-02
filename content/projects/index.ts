import type { ProjectModule } from "@/types/project";
import * as ishara from "./ishara";
import * as nonaMart from "./nona-mart";
import * as parivar from "./parivar";
import * as salesCrm from "./sales-crm";

/**
 * The register of case studies, in index order. Adding a project is adding a
 * file next to this one and an entry here — TypeScript cannot glob, and an
 * explicit list is worth more than the one line it costs: reordering the site
 * is reordering this array, and there is no `order` field to keep consistent.
 *
 * Metadata is checked by the compiler. What a type cannot express is checked
 * below, and throws during prerender, so a malformed project fails the build
 * rather than rendering blank (BUILD-PLAN Phase 4.3).
 */
const register: readonly ProjectModule[] = [ishara, nonaMart, parivar, salesCrm];

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SUMMARY_MAX = 90;

function verify(modules: readonly ProjectModule[]): readonly ProjectModule[] {
  const seen = new Set<string>();

  for (const { meta } of modules) {
    const where = `content/projects/${meta.slug || "(unnamed)"}.tsx`;

    if (!SLUG.test(meta.slug)) {
      throw new Error(`${where}: slug "${meta.slug}" must be lowercase kebab-case.`);
    }
    if (seen.has(meta.slug)) {
      throw new Error(`Two projects claim the slug "${meta.slug}". Slugs are URLs.`);
    }
    seen.add(meta.slug);

    if (meta.summary.length > SUMMARY_MAX) {
      throw new Error(
        `${where}: summary is ${meta.summary.length} characters. It sits on one ` +
          `line in the index rows, so it has to fit in ${SUMMARY_MAX}.`,
      );
    }
    if (meta.stack.length === 0) {
      throw new Error(`${where}: stack cannot be empty.`);
    }
    for (const link of meta.links ?? []) {
      if (!/^https?:\/\//.test(link.url)) {
        throw new Error(`${where}: link "${link.label}" needs an absolute URL.`);
      }
    }
  }

  return modules;
}

/** Every published project, in index order. Drafts are excluded entirely. */
export const projects = verify(register).filter((p) => !p.meta.draft);
