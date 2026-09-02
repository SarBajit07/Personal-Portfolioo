/**
 * Single source for everything that appears in more than one place — metadata,
 * the footer, the sitemap, the OG images, the contact page.
 *
 * TODO(sarbajit): `url`, `email` and the social handles need the real values.
 * Everything else is settled.
 */
export const site = {
  name: "Sarbajit Timalsina",
  role: "Full-stack engineer",
  location: "Kathmandu",
  url: process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://sarbajit.dev",
  description:
    "Full-stack engineer in Kathmandu. Sign-language translation, B2B commerce, and cross-border health systems.",
  email: "TODO(sarbajit)@example.com",
  github: "https://github.com/SarBajit07",
  linkedin: "TODO(sarbajit) — Q5",
} as const;

export const nav = [
  { href: "/projects/", label: "Projects" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
] as const;
