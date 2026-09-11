import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { nav, site } from "@/lib/site";

/**
 * Sticky, one hairline, no blur panel. The nav links are absolute anchors
 * ("/#about") rather than bare fragments, so they also work from /contact —
 * the one page that is not the home page.
 *
 * Three links and a switch do not earn a hamburger, so the bar stays one row at
 * every width and gives way instead: the wordmark drops to the first name below
 * 640px, and carries `truncate` so that even at 280px it ellipsises rather than
 * pushing the page sideways.
 */
export function SiteHeader() {
  const shortName = site.name.split(" ")[0] ?? site.name;

  return (
    <header className="sticky top-0 z-20 border-b border-b-rule bg-paper/85 backdrop-blur-sm">
      <div className="page flex h-16 items-center justify-between gap-3 sm:gap-6">
        <Link
          href="/"
          className="min-w-0 truncate text-small font-semibold no-underline hover:text-accent"
        >
          <span className="sm:hidden">{shortName}</span>
          <span className="hidden sm:inline">{site.name}</span>
        </Link>

        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-4 text-note sm:gap-7 sm:text-small">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="nav-link text-ink-2 no-underline hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
