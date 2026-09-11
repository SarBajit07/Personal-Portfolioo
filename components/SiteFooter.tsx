import Link from "next/link";
import { ChatIcon, GitHubIcon, MailIcon } from "@/components/Icons";
import { site } from "@/lib/site";

/**
 * Name, where, how to reach a person. Not a sitemap.
 *
 * The link icons take no colour of their own so they ride currentColor and
 * brighten with the label on hover, rather than staying dim beside it.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-t-rule">
      <div className="page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-small text-ink-3">
          © {new Date().getFullYear()} {site.name}.
        </p>

        <ul className="flex flex-wrap gap-x-6">
          <li>
            <a
              href={`mailto:${site.email}`}
              className="nav-link flex items-center gap-2 text-small text-ink-2 no-underline hover:text-ink"
            >
              <MailIcon className="size-4" />
              Email
            </a>
          </li>
          <li>
            <a
              href={site.github}
              rel="noreferrer noopener"
              className="nav-link flex items-center gap-2 text-small text-ink-2 no-underline hover:text-ink"
            >
              <GitHubIcon className="size-4" />
              GitHub
            </a>
          </li>
          <li>
            <Link
              href="/contact/"
              className="nav-link flex items-center gap-2 text-small text-ink-2 no-underline hover:text-ink"
            >
              <ChatIcon className="size-4" />
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
