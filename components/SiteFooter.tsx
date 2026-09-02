import Link from "next/link";
import { site } from "@/lib/site";

/**
 * BUILD-PLAN 5.4: the footer carries the specific human detail. Not a sitemap,
 * not four columns of links, not a newsletter box. Where the site was built, in
 * what, and how to reach a person.
 */
export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-t-rule">
      <div className="page grid12 gap-y-8 py-12">
        <div className="col-span-4 lg:col-span-5">
          <p className="text-small text-ink-2">
            Written and built by {site.name} in {site.location}.
          </p>
          <p className="mt-2 max-w-[46ch] text-note text-ink-3">
            {/* TODO(sarbajit): Q11 — replace with the true detail. Where you
                actually wrote it, on what, over how long. Specific beats warm. */}
            TODO(sarbajit) — one honest sentence about how this site was made.
          </p>
        </div>

        <div className="col-span-4 lg:col-start-9 lg:col-span-4 lg:text-right">
          <ul className="space-y-1">
            <li>
              <Link href="/contact/" className="text-small no-underline hover:text-accent">
                Contact
              </Link>
            </li>
            <li>
              <a
                href={site.github}
                rel="noreferrer noopener"
                className="text-small no-underline hover:text-accent"
              >
                GitHub
              </a>
            </li>
          </ul>
          <p className="index-numeral mt-6">
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
