/**
 * Single source for everything that appears in more than one place — metadata,
 * the footer, the sitemap, the OG images, the contact page.
 *
 * Values here are taken from the previous portfolio and its API, not invented.
 *
 * TODO(sarbajit): `url` still needs the real domain (QUESTIONS.md Q1). Until
 * it is bought, set NEXT_PUBLIC_SITE_URL on the Vercel project — the fallback
 * below is a placeholder and will emit wrong canonical URLs if it ships.
 */
export const site = {
  name: "Sarbajit Timalsina",
  role: "Full-stack developer",
  location: "Kathmandu",
  url: process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://sarbajit.dev",
  description:
    "Full-stack developer in Kathmandu. React and Node.js front to back, with machine-learning work in Python.",
  email: "sarbajeet4604@gmail.com",
  github: "https://github.com/SarBajit07",
} as const;

/**
 * About and Projects are sections on the home page, not routes. The hrefs are
 * absolute ("/#about") so they also resolve from /contact.
 */
export const nav = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/contact/", label: "Contact" },
] as const;
