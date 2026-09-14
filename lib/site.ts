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
  linkedin: "https://www.linkedin.com/in/sarbajit-timalsina-083571244",
  instagram: "https://www.instagram.com/sarbajit_timalsina/",
} as const;

/**
 * The off-site profiles, in one list so the footer, the contact page and the
 * `sameAs` in the structured data cannot drift apart.
 *
 * Order matters: it is the order they render, and LinkedIn sits first because
 * it is the profile a search for the name is most likely to surface alongside
 * this site. Every entry here is rendered as a real link on the page — Google
 * treats `sameAs` as a claim, and a claim it cannot see a link for is one it
 * has no reason to believe.
 */
export const profiles = [
  { label: "LinkedIn", href: site.linkedin, handle: "Sarbajit Timalsina" },
  { label: "GitHub", href: site.github, handle: "@SarBajit07" },
  { label: "Instagram", href: site.instagram, handle: "@sarbajit_timalsina" },
] as const;

/**
 * Spellings of the same name that a searcher may plausibly type.
 *
 * These become `alternateName` in the Person graph, which is how Google is told
 * that these strings denote one entity rather than several. "Timilsina" is the
 * commoner transliteration of the surname, and "Sarbajeet" is the spelling in
 * the email address above — both are real variants, not invented ones.
 *
 * Keep this list to spellings that are genuinely Sarbajit's. Padding it with
 * near-miss names is keyword stuffing, and Google treats structured data that
 * overclaims as a reason to discount all of it.
 */
export const nameVariants = [
  "Sarbajit Timilsina",
  "Sarbajeet Timalsina",
  "Sarbajeet Timilsina",
] as const;

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
