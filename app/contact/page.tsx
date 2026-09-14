import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  PinIcon,
} from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { contactGraph } from "@/lib/schema";
import { profiles, site } from "@/lib/site";

const PROFILE_ICONS: Record<
  (typeof profiles)[number]["label"],
  (props: { className?: string }) => React.ReactNode
> = {
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
  Instagram: InstagramIcon,
};

/* The old description was four words and said nothing a searcher could match
   on. This one carries the role and the city, which is what someone typing
   "web developer Kathmandu" is actually looking for. */
const description = `Get in touch with ${site.name}, a ${site.role.toLowerCase()} in ${site.location}. Available for project work, roles, and questions about anything on this site.`;

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact/" },
  openGraph: {
    type: "profile",
    title: `Contact — ${site.name}`,
    description,
    url: "/contact/",
  },
};

/**
 * The one route besides the home page. The form is never the only way out —
 * the address and the GitHub profile sit beside it, so a broken endpoint is an
 * inconvenience rather than a dead end.
 *
 * Both columns are headed sections. Before that the form was the only thing on
 * the page with no heading of its own, which left the document outline going
 * straight from the h1 to nothing.
 */
export default function ContactPage() {
  return (
    <main id="main" className="page section">
      <JsonLd data={contactGraph()} />

      <p className="label">Contact</p>
      <h1 className="mt-3">Get in touch</h1>
      <p className="mt-5 max-w-[50ch] text-lead text-ink-2">
        A role, project work, a question about something on this site, or a
        correction — all welcome.
      </p>

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
        <section aria-labelledby="form-heading" className="card p-6 sm:p-8">
          <h2 id="form-heading" className="text-h3">
            Send a message
          </h2>
          <p className="mt-2 mb-8 max-w-[44ch] text-small text-ink-2">
            Three fields, and it goes straight to my inbox.
          </p>
          <ContactForm />
        </section>

        <aside aria-labelledby="direct-heading">
          <h2 id="direct-heading" className="text-h3">
            Or reach me directly
          </h2>

          {/*
            Each icon sits in the label row and the value is indented to clear
            it — 1rem of icon plus the 0.5rem gap — so the three values line up
            with each other rather than stepping out under their own marks.
          */}
          <dl className="mt-6 border-t border-rule">
            <div className="border-b border-rule py-5">
              <dt className="label flex items-center gap-2">
                <MailIcon className="size-4 text-ink-3" />
                Email
              </dt>
              <dd className="mt-1.5 pl-6">
                <a
                  href={`mailto:${site.email}`}
                  className="text-small break-all text-accent no-underline hover:underline"
                >
                  {site.email}
                </a>
              </dd>
            </div>

            {/* Same list as the footer and the `sameAs` in the structured
                data — one source, so a profile is never claimed anywhere it is
                not also linked. */}
            {profiles.map(({ label, href, handle }) => {
              const Icon = PROFILE_ICONS[label];
              return (
                <div key={label} className="border-b border-rule py-5">
                  <dt className="label flex items-center gap-2">
                    <Icon className="size-4 text-ink-3" />
                    {label}
                  </dt>
                  <dd className="mt-1.5 pl-6">
                    <a
                      href={href}
                      rel="me noreferrer noopener"
                      className="text-small text-ink-2 no-underline hover:text-ink"
                    >
                      {handle}
                    </a>
                  </dd>
                </div>
              );
            })}

            <div className="border-b border-rule py-5">
              <dt className="label flex items-center gap-2">
                <PinIcon className="size-4 text-ink-3" />
                Location
              </dt>
              <dd className="mt-1.5 pl-6 text-small text-ink-2">
                {site.location}, Nepal
                <span className="mt-1.5 block max-w-[32ch] text-note text-ink-3">
                  UTC+5:45, so replies land at odd hours for most of the world.
                </span>
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </main>
  );
}
