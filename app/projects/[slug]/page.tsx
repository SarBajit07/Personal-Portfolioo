import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DraftNotice, hasTodo } from "@/components/DraftNotice";
import { IndexRow } from "@/components/IndexRow";
import { yearOf } from "@/lib/format";
import { findProject, neighbours, projectSlugs } from "@/lib/projects";
import type { ProjectMeta } from "@/types/project";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return projectSlugs().map((slug) => ({ slug }));
}

/**
 * A page is a draft while its body is still a skeleton or any metadata field
 * still carries an interview marker. Drafts are served noindex; both the notice
 * and the noindex clear themselves once the copy lands.
 */
function isDraft(meta: ProjectMeta): boolean {
  return (
    meta.draftCopy ||
    hasTodo(meta.summary, meta.role, meta.dates, meta.status, meta.problem)
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};

  const { meta } = project;

  return {
    title: meta.title,
    description: meta.summary,
    alternates: { canonical: `/projects/${meta.slug}/` },
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.summary,
      url: `/projects/${meta.slug}/`,
    },
    ...(isDraft(meta) ? { robots: { index: false, follow: false } } : {}),
  };
}

/** Gutter metadata. Sticky on wide screens so it stays beside the prose. */
function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-t-rule py-3">
      <dt className="label">{label}</dt>
      <dd className="mt-1 text-note text-ink-2">{children}</dd>
    </div>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  const { meta, Body } = project;
  const around = neighbours(slug);
  const draft = isDraft(meta);

  return (
    <main id="main" className="page pt-16 lg:pt-24">
      <div className="grid12">
        <header className="col-span-4 lg:col-span-8">
          <p className="label">Case study</p>
          <h1 className="mt-5 text-h2 lg:text-h1">{meta.title}</h1>
          <p className="mt-6 max-w-[46ch] text-lead text-ink-2">{meta.summary}</p>
        </header>
      </div>

      {/*
        Ishara gets one treatment nothing else on the site gets (Phase 6.5).
        A designer spends more time on the best project; identical templates
        across four case studies is the tell this avoids.
      */}
      {meta.slug === "ishara" ? (
        <blockquote className="mt-16 border-y border-y-rule py-10">
          <p className="max-w-[24ch] font-display text-h2 leading-[1.05] lg:max-w-[34ch] lg:text-h1">
            {meta.problem}
          </p>
        </blockquote>
      ) : null}

      <div className="grid12 mt-16 pb-16">
        <article className="case-body col-prose">
          {draft ? (
            <div className="mb-12">
              <DraftNotice />
            </div>
          ) : null}
          <Body />
        </article>

        <aside className="col-gutter mt-16 lg:mt-0">
          <div className="lg:sticky lg:top-10">
            <dl>
              <Meta label="Role">{meta.role}</Meta>
              <Meta label="Dates">{meta.dates}</Meta>
              <Meta label="Status">{meta.status}</Meta>
              <Meta label="Stack">
                <span className="font-mono text-caption text-ink-3">
                  {meta.stack.join(" · ")}
                </span>
              </Meta>
              {meta.links && meta.links.length > 0 ? (
                <Meta label="Links">
                  <ul>
                    {meta.links.map((link) => (
                      <li key={link.url}>
                        <a
                          href={link.url}
                          rel="noreferrer noopener"
                          className="underline decoration-rule underline-offset-4 hover:text-accent"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Meta>
              ) : null}
            </dl>
            <p className="mt-6">
              <Link href="/projects/" className="label no-underline hover:text-accent">
                All projects
              </Link>
            </p>
          </div>
        </aside>
      </div>

      {around ? (
        <nav aria-label="More projects" className="mt-8">
          <p className="label pb-4">Next</p>
          {[around.next, around.prev].map((n) => (
            <IndexRow
              key={n.meta.slug}
              index={n.position}
              href={`/projects/${n.meta.slug}/`}
              title={n.meta.title}
              summary={n.meta.summary}
              stack={n.meta.stack}
              year={yearOf(n.meta.dates)}
            />
          ))}
          <hr className="border-0 border-t border-t-rule" />
        </nav>
      ) : null}
    </main>
  );
}
