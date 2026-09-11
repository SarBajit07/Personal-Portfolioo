import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/content/projects";
import type { TimelineEntry } from "@/content/profile";
import { bio, education, experience, skills } from "@/content/profile";
import { findPortrait } from "@/lib/portrait";
import { homeGraph } from "@/lib/schema";
import { site } from "@/lib/site";

/**
 * The whole portfolio, minus the contact form: hero, about, projects. Sections
 * are anchor targets rather than routes — one page to read top to bottom, which
 * is what the previous site did and what this one is going back to.
 */

const HERO_LINES = [
  "Full-stack web developer",
  "building things end to end.",
] as const;

export default function Home() {
  const portrait = findPortrait();

  return (
    <main id="main">
      <JsonLd data={homeGraph()} />

      {/* ---------------------------------------------------------------- Hero */}
      <section id="home" className="section page pt-16 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h1 className="max-w-[18ch]">
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

            <p
              className="rise mt-6 max-w-[52ch] text-lead text-ink-2"
              style={{ ["--rise-index" as string]: HERO_LINES.length }}
            >
              I&rsquo;m {site.name}, a developer in {site.location}. I write
              Next.js and React on the front, Express.js and PostgreSQL behind
              it, and Python when the problem needs a model rather than an
              endpoint.
            </p>

            <div
              className="rise mt-9 flex flex-wrap gap-3"
              style={{ ["--rise-index" as string]: HERO_LINES.length + 1 }}
            >
              <Link href="/#projects" className="btn btn-primary">
                View my work
              </Link>
              <Link href="/contact/" className="btn btn-ghost">
                Get in touch
              </Link>
            </div>
          </div>

          <div
            className="rise portrait justify-self-start lg:justify-self-end"
            style={{ ["--rise-index" as string]: HERO_LINES.length + 2 }}
          >
            {portrait ? (
              <Image
                src={portrait}
                alt={`${site.name}, ${site.role.toLowerCase()} in ${site.location}`}
                fill
                sizes="(min-width: 1024px) 19rem, 80vw"
                priority
              />
            ) : (
              /* Stands in until the photo is saved to public/ — a missing file
                 should read as unfinished, not as a broken image. */
              <span className="portrait-fallback" aria-hidden="true">
                {site.name.charAt(0)}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- About */}
      <section id="about" className="section page">
        <p className="label">About</p>
        <h2 className="mt-3">A little background</h2>

        <div className="mt-8 grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            {bio.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="text-ink-2">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="space-y-8">
            {skills.map((group) => (
              <div key={group.category}>
                <h3 className="text-small font-semibold tracking-wide text-ink uppercase">
                  {group.category}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="pill">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-[repeat(2,minmax(0,1fr))]">
          <TimelineBlock title="Education" entries={education} />
          <TimelineBlock title="Experience" entries={experience} />
        </div>
      </section>

      {/* ------------------------------------------------------------ Projects */}
      <section id="projects" className="section page">
        <p className="label">Projects</p>
        <h2 className="mt-3">Things I&rsquo;ve built</h2>
        <p className="mt-4 max-w-[54ch] text-ink-2">
          Five projects, newest work first. Two client platforms built at
          NTCS, a three-site frontend for a production house, a care platform I
          tested rather than built, and the agricultural app that got me into
          machine learning.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-[repeat(2,minmax(0,1fr))]">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        <div className="card mt-12 flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center">
          <div>
            <h3>Working on something?</h3>
            <p className="mt-2 max-w-[44ch] text-small text-ink-2">
              I&rsquo;m open to full-time roles and project work. Tell me what
              you&rsquo;re building.
            </p>
          </div>
          <Link href="/contact/" className="btn btn-primary shrink-0">
            Get in touch
          </Link>
        </div>
      </section>
    </main>
  );
}

function TimelineBlock({
  title,
  entries,
}: {
  title: string;
  entries: readonly TimelineEntry[];
}) {
  return (
    <div>
      <h3 className="text-small font-semibold tracking-wide text-ink uppercase">
        {title}
      </h3>
      <div className="timeline mt-5 space-y-8">
        {entries.map((entry) => (
          <div key={entry.title} className="timeline-item">
            <p className="text-caption tracking-wider text-accent uppercase">
              {entry.period}
            </p>
            <p className="mt-1 font-semibold">{entry.title}</p>
            <p className="text-small text-ink-2">{entry.organization}</p>
            <p className="mt-2 text-small text-ink-3">{entry.description}</p>
            {/* Named work, where there is any. A role with nothing specific to
                point at renders the summary alone rather than an empty list. */}
            {entry.highlights ? (
              <ul className="mt-3 space-y-2">
                {entry.highlights.map((highlight) => (
                  <li
                    key={highlight.slice(0, 32)}
                    className="relative pl-4 text-small text-ink-3 before:absolute before:left-0 before:text-ink-3 before:content-['\2014']"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
