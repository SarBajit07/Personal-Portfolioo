import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
  alternates: { canonical: "/contact/" },
};

/**
 * Phase 8.1. The form is never the only route out — the address and the GitHub
 * profile sit beside it, so a broken endpoint is an inconvenience rather than a
 * dead end.
 */
export default function ContactPage() {
  return (
    <main id="main" className="page pt-20 pb-16 lg:pt-28">
      <div className="grid12">
        <header className="col-span-4 lg:col-span-7">
          <h1 className="text-h2 lg:text-h1">Contact</h1>
          <p className="mt-6 max-w-[44ch] text-lead text-ink-2">
            Work, a question about something on this site, or a correction —
            all welcome.
          </p>
        </header>
      </div>

      <div className="grid12 mt-16">
        <div className="col-prose">
          <ContactForm />
        </div>

        <aside className="col-gutter mt-16 lg:mt-0">
          <p className="label">Or directly</p>
          <ul className="mt-3 space-y-2">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="text-note underline decoration-rule underline-offset-4 hover:text-accent"
              >
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.github}
                rel="noreferrer noopener"
                className="text-note underline decoration-rule underline-offset-4 hover:text-accent"
              >
                GitHub
              </a>
            </li>
          </ul>
          <p className="mt-6 max-w-[30ch] text-note text-ink-3">
            Based in {site.location}, which is UTC+5:45 — replies land at odd
            hours for most of the world.
          </p>
        </aside>
      </div>
    </main>
  );
}
