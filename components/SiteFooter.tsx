import Link from "next/link";
import {
  ChatIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
} from "@/components/Icons";
import { profiles, site } from "@/lib/site";

/** Keyed by the labels in `profiles`, so adding one there is a type error here
    until it is given a mark. */
const PROFILE_ICONS: Record<
  (typeof profiles)[number]["label"],
  (props: { className?: string }) => React.ReactNode
> = {
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
  Instagram: InstagramIcon,
};

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
          {/* Driven by the same list as the `sameAs` in the structured data,
              so a profile can never be claimed there without being linked
              here. `me` is the relevant rel: it says these identities are the
              same person, which is exactly the claim being made. */}
          {profiles.map(({ label, href }) => {
            const Icon = PROFILE_ICONS[label];
            return (
              <li key={label}>
                <a
                  href={href}
                  rel="me noreferrer noopener"
                  className="nav-link flex items-center gap-2 text-small text-ink-2 no-underline hover:text-ink"
                >
                  <Icon className="size-4" />
                  {label}
                </a>
              </li>
            );
          })}
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
