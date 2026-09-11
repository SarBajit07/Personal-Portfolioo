import Link from "next/link";
import { site } from "@/lib/site";

/** Name, where, how to reach a person. Not a sitemap. */
export function SiteFooter() {
  return (
    <footer className="border-t border-t-rule">
      <div className="page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-small text-ink-3">
          © {new Date().getFullYear()} {site.name}. Built in {site.location}{" "}
          with Next.js.
        </p>

        <ul className="flex flex-wrap gap-x-6">
          <li>
            <a
              href={`mailto:${site.email}`}
              className="nav-link text-small text-ink-2 no-underline hover:text-ink"
            >
              Email
            </a>
          </li>
          <li>
            <a
              href={site.github}
              rel="noreferrer noopener"
              className="nav-link text-small text-ink-2 no-underline hover:text-ink"
            >
              GitHub
            </a>
          </li>
          <li>
            <Link
              href="/contact/"
              className="nav-link text-small text-ink-2 no-underline hover:text-ink"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
