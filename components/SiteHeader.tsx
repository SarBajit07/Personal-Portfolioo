import Link from "next/link";
import { nav, site } from "@/lib/site";

/**
 * No logo mark, no centred nav, no sticky bar with a blur behind it. The name
 * sits at the left where a masthead sits, the links run out to the right, and a
 * single hairline separates it from the page.
 */
export function SiteHeader() {
  return (
    <header className="border-b border-b-rule">
      <div className="page flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-5">
        <Link href="/" className="text-small no-underline hover:text-accent">
          {site.name}
        </Link>
        <nav aria-label="Primary">
          <ul className="flex gap-6">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="label no-underline hover:text-accent hover:underline hover:underline-offset-4"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
