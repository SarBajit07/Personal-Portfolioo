/**
 * Single source for everything that appears in more than one place — metadata,
 * the footer, the sitemap, the OG images, the structured data, the contact page.
 *
 * Values here are taken from the previous portfolio and its API, not invented.
 */

/**
 * Canonical origin, in order of trust:
 *
 *   1. NEXT_PUBLIC_SITE_URL — set this on Vercel once the real domain is bought.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel sets this on every deployment to
 *      the project's production host, so a preview still emits canonicals that
 *      point at production rather than at itself.
 *   3. localhost — a development fallback that is obviously wrong if it escapes.
 *
 * The old fallback was a hardcoded domain that nobody owns. That is the one
 * mistake here with real consequences: a wrong <link rel="canonical"> tells
 * Google the real pages are duplicates of somebody else's site.
 */
function resolveUrl(): string {
  const explicit = process.env["NEXT_PUBLIC_SITE_URL"]?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env["VERCEL_PROJECT_PRODUCTION_URL"]?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export const site = {
  name: "Sarbajit Timalsina",
  role: "Full-stack web developer",
  location: "Kathmandu",
  /** ISO 3166-1 alpha-2, for the PostalAddress in the structured data. */
  country: "NP",
  url: resolveUrl(),
  /** Matches og:locale and <html lang>. */
  locale: "en_GB",
  lang: "en-GB",
  description:
    "Full-stack web developer in Kathmandu. Next.js, Express.js and PostgreSQL front to back, with machine-learning work in Python.",
  email: "sarbajeet4604@gmail.com",
  github: "https://github.com/SarBajit07",
} as const;

/** Absolute URL for a site-relative path — structured data may not use relative ones. */
export function absolute(path: string): string {
  return new URL(path, site.url).toString();
}

/**
 * About and Projects are sections on the home page, not routes. The hrefs are
 * absolute ("/#about") so they also resolve from /contact.
 */
export const nav = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/contact/", label: "Contact" },
] as const;
