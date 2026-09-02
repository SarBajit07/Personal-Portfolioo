import type { Metadata } from "next";
import { IndexRow } from "@/components/IndexRow";
import { yearOf } from "@/lib/format";
import { allProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Case studies: what the problem was, what got decided, and what it cost.",
  alternates: { canonical: "/projects/" },
};

/**
 * Phase 7.1. The full index in the same row language as the home page.
 * No filters — filter UI over four items is itself a tell (0.5, never #6).
 */
export default function ProjectsPage() {
  const projects = allProjects();

  return (
    <main id="main" className="page pt-20 pb-8 lg:pt-28">
      <div className="grid12 pb-12">
        <div className="col-span-4 lg:col-span-7">
          <h1 className="text-h2 lg:text-h1">Projects</h1>
        </div>
        <p className="col-span-4 mt-6 max-w-[38ch] text-small text-ink-2 lg:col-start-9 lg:col-span-4 lg:mt-4">
          Four, written up properly, rather than a grid of everything ever
          pushed. Each one names what the constraint was and what it cost.
        </p>
      </div>

      {projects.map((project, i) => (
        <IndexRow
          key={project.meta.slug}
          index={i + 1}
          href={`/projects/${project.meta.slug}/`}
          title={project.meta.title}
          summary={project.meta.summary}
          stack={project.meta.stack}
          year={yearOf(project.meta.dates)}
        />
      ))}
      <hr className="border-0 border-t border-t-rule" />
    </main>
  );
}
