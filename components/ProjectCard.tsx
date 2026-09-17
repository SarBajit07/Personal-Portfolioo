import Image from "next/image";
import type { Project } from "@/types/project";

/**
 * A project is a card and nothing else — there is no case-study route behind
 * it, so everything known about the project is on this surface.
 *
 * Fields the data does not have are not rendered: no image means a lettered
 * placeholder rather than a broken frame, and no links means no link row rather
 * than a dead "#" href, which is what the previous site shipped.
 */
export function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  const { title, blurb, stack, image, live, alsoLive, repo, year } = project;
  const hasLinks = Boolean(live ?? repo ?? alsoLive?.length);

  return (
    /* `index` is only ever read for its parity: two cards sitting in the
       same grid row are at the same scroll position, so the second is given a
       later reveal range and the row arrives as a pair rather than a slab. */
    <article
      className={`card card-interactive reveal flex min-w-0 flex-col overflow-hidden${
        index % 2 === 1 ? " reveal-late" : ""
      }`}
    >
      <div className="shot">
        {image ? (
          <Image
            src={image}
            alt={`Screenshot of ${title}`}
            fill
            sizes="(min-width: 64rem) 32rem, (min-width: 48rem) 50vw, 100vw"
          />
        ) : (
          <div className="shot-placeholder" aria-hidden>
            {title.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3>{title}</h3>
          {year ? <span className="text-caption text-ink-3">{year}</span> : null}
        </div>

        <p className="mt-3 text-small text-ink-2">{blurb}</p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {stack.map((tech) => (
            <li key={tech} className="pill">
              {tech}
            </li>
          ))}
        </ul>

        {hasLinks ? (
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-t-rule pt-4">
            {live ? (
              <a
                href={live}
                rel="noreferrer noopener"
                className="text-small font-medium text-accent no-underline hover:underline"
              >
                Live site
              </a>
            ) : null}
            {/* A project can ship as several sites; each gets its own name. */}
            {alsoLive?.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                rel="noreferrer noopener"
                className="text-small font-medium text-accent no-underline hover:underline"
              >
                {label}
              </a>
            ))}
            {repo ? (
              <a
                href={repo}
                rel="noreferrer noopener"
                className="text-small text-ink-2 no-underline hover:text-ink"
              >
                Source
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
