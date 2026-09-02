import Link from "next/link";
import { IndexRow } from "@/components/IndexRow";
import { yearOf } from "@/lib/format";
import { allProjects, featuredProjects } from "@/lib/projects";

/**
 * Phase 5. The hero is one hand-broken statement in the left seven columns and
 * an annotation in the gutter — no centred stack, no button pair, no image
 * required for it to work.
 */

const HERO_LINES = [
  "Full-stack engineer in Kathmandu.",
  "I build sign-language translation,",
  "B2B commerce, and cross-border health systems.",
] as const;

export default function Home() {
  const featured = featuredProjects();
  const total = allProjects().length;

  return (
    <main id="main">
      <section className="page grid12 pt-20 pb-24 lg:pt-32 lg:pb-32">
        <h1 className="col-span-4 lg:col-span-7 text-h2 lg:text-h1">
          {HERO_LINES.map((line, i) => (
            <span
              key={line}
              className="rise block"
              style={{ ["--rise-index" as string]: i }}
            >
              {line}
            </span>
          ))}
        </h1>

        <div
          className="col-span-4 mt-10 lg:col-start-9 lg:col-span-4 lg:mt-3 rise"
          style={{ ["--rise-index" as string]: HERO_LINES.length }}
        >
          <p className="label">Currently</p>
          <p className="mt-2 max-w-[34ch] text-small text-ink-2">
            {/* TODO(sarbajit): Q6 and Q8 — role, employer, and whether you are
                open to work. One line, present tense, no adjectives. */}
            TODO(sarbajit) — current role, and whether you are taking work.
          </p>
        </div>
      </section>

      <section
        className="page rise"
        style={{ ["--rise-index" as string]: HERO_LINES.length + 1 }}
        aria-labelledby="selected-work"
      >
        <div className="grid12 items-baseline pb-4">
          <h2 id="selected-work" className="col-span-3 text-h3 lg:col-span-6">
            Selected work
          </h2>
          <p className="col-span-1 text-right lg:col-start-12 lg:col-span-1">
            <Link href="/projects/" className="label no-underline hover:text-accent">
              All {total}
            </Link>
          </p>
        </div>

        {featured.map((project, i) => (
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
      </section>
    </main>
  );
}
