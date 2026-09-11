import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
  alternates: { canonical: "/contact/" },
};

/**
 * The one route besides the home page. The form is never the only way out —
 * the address and the GitHub profile sit beside it, so a broken endpoint is an
 * inconvenience rather than a dead end.
 */
export default function ContactPage() {
  return (
    <main id="main" className="page section">
      <p className="label">Contact</p>
      <h1 className="mt-3">Get in touch</h1>
      <p className="mt-5 max-w-[50ch] text-lead text-ink-2">
        A role, project work, a question about something on this site, or a
        correction — all welcome.
      </p>

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
        <div className="card p-6 sm:p-8">
          <ContactForm />
        </div>

        <aside className="space-y-8">
          <div>
            <p className="label">Email</p>
            <a
              href={`mailto:${site.email}`}
              className="mt-1 inline-block py-1.5 text-small break-all text-accent no-underline hover:underline"
            >
              {site.email}
            </a>
          </div>

          <div>
            <p className="label">GitHub</p>
            <a
              href={site.github}
              rel="noreferrer noopener"
              className="mt-1 inline-block py-1.5 text-small text-ink-2 no-underline hover:text-ink"
            >
              {new URL(site.github).pathname.replace("/", "@")}
            </a>
          </div>

          <div>
            <p className="label">Location</p>
            <p className="mt-2 text-small text-ink-2">{site.location}, Nepal</p>
            <p className="mt-2 max-w-[32ch] text-note text-ink-3">
              UTC+5:45, so replies land at odd hours for most of the world.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
