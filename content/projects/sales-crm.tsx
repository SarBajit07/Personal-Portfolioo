import { H2, P } from "@/components/prose";
import type { ProjectMeta } from "@/types/project";

export const meta: ProjectMeta = {
  slug: "sales-crm",
  title: "Sales CRM",
  summary: "TODO(sarbajit) — Q15, one line under 90 characters",
  role: "TODO(sarbajit) — Q13",
  stack: ["Next.js", "Express.js", "Prisma", "PostgreSQL"],
  problem: "TODO(sarbajit) — Q15, one sentence.",
  approach: "TODO(sarbajit) — Q17, one sentence.",
  outcome: "TODO(sarbajit) — Q19, one sentence.",
  featured: false,
  dates: "TODO(sarbajit) — Q12",
  status: "TODO(sarbajit) — Q20",
  links: [],
  draft: false,
  draftCopy: true,
};

/**
 * Deliberately the shortest body on the site — target 350–450 words. Four case
 * studies at identical length is a template tell; one that is plainly smaller
 * because the project was smaller makes the long ones read as earned.
 */
export function Body() {
  return (
    <>
      <H2>What it is, and why</H2>
      <P>TODO(sarbajit) — Q14, Q15.</P>

      <H2>What it shows</H2>
      <P>TODO(sarbajit) — Q17, Q18.</P>
    </>
  );
}
