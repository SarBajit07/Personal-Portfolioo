import type { Metadata } from "next";
import Link from "next/link";
import { About, draftCopy } from "@/content/about";
import { DraftNotice } from "@/components/DraftNotice";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.role} in ${site.location}. Background, current role, and how I work.`,
  alternates: { canonical: "/about/" },
  ...(draftCopy ? { robots: { index: false, follow: false } } : {}),
};

/**
 * Phase 7.2. Same prose components as a case study, deliberately looser —
 * larger body, no section numerals, no rules between sections. The density
 * change is the point: it should not read as the same template with different
 * words.
 */
export default function AboutPage() {
  return (
    <main id="main" className="page pt-20 pb-16 lg:pt-28">
      <div className="grid12">
        <header className="col-span-4 lg:col-span-7">
          <h1 className="text-h2 lg:text-h1">About</h1>
        </header>
      </div>

      <div className="grid12 mt-14">
        <div className="about-body case-body col-prose">
          {draftCopy ? (
            <div className="mb-12">
              <DraftNotice />
            </div>
          ) : null}
          <About />
        </div>

        <aside className="col-gutter mt-12 lg:mt-2">
          <p className="label">Elsewhere</p>
          <ul className="mt-3 space-y-1">
            <li>
              <a
                href={site.github}
                rel="noreferrer noopener"
                className="text-note no-underline hover:text-accent"
              >
                GitHub
              </a>
            </li>
            <li>
              <Link href="/contact/" className="text-note no-underline hover:text-accent">
                Contact
              </Link>
            </li>
          </ul>
        </aside>
      </div>
    </main>
  );
}
