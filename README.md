# sarbajit.com.np

Portfolio site. Next.js App Router, deployed to Vercel.

## Commands

| | |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | eslint |
| `npm run check:tells` | the design audit — gradients, arbitrary hex, banned copy |
| `npm run check:contrast` | WCAG contrast over the token palette |
| `npm run check:content` | lists open `TODO(sarbajit)` markers |
| `npm run check:launch` | the same, but fails if any survive |

CI runs all of them on every push and PR.

## Shape

One page. `app/page.tsx` carries the hero, the about section and the project
grid; `/contact` is the only other route with a UI, and `app/api/contact` is the
only dynamic one. Everything else is prerendered.

There are no per-project routes. A card carries the whole story, which means the
blurb has to be honest at a glance rather than deferring to a case study.

## Content

Three files, all typed:

- `content/profile.ts` — bio, skills, education, experience
- `content/projects.ts` — the project cards, in display order
- `lib/site.ts` — name, role, location, links; anything that appears in more
  than one place, so metadata, the footer, the sitemap and the OG image can't
  drift apart

The array *is* the order. Metadata is checked by the compiler — a typo'd or
missing key is a type error, not a runtime surprise (`types/project.ts`).

Screenshots go in `public/projects/`; see the README there for the crop. A card
with no `image` renders a lettered placeholder rather than a broken frame.

## Rules that are enforced, not just documented

Tailwind's default palette, type scale, radius scale and font stack are
**deleted** in `app/globals.css`, not overridden. `bg-indigo-500` and
`text-4xl` compile to nothing. What remains:

- colour: `paper`, `paper-2`, `surface`, `ink`, `ink-2`, `ink-3`, `rule`,
  `rule-strong`, `accent`, `accent-soft`
- type: `text-caption` `note` `small` `body` `lead` `h3` `h2` `h1` `display`
- radius: `rounded-sm` `md` `lg` `full`

`npm run check:tells` catches what deleting the tokens cannot — gradients,
`backdrop-filter`, arbitrary hex colours, and the copy phrases every portfolio
uses.

Both themes are defined as custom properties on `:root` and swapped by
`ThemeToggle`; no colour is written anywhere else.

## Fonts

The whole site is set in Poppins, loaded once in `app/fonts.ts` and fed to the
`font-display` / `font-body` / `font-mono` variables together. Swapping the
family is a change to that one file.

## SEO

The site is built to rank for one query above all: **Sarbajit Timalsina**. A
name query is an *entity* question - Google is not matching keywords, it is
deciding which person the name denotes and which page is that person's home.
Everything below serves that.

On-page, and already done:

- the `<h1>` on `/` is the name. It was the tagline, which meant the strongest
  heading on the site answered a question nobody asked
- one `Person` node in the JSON-LD graph, cross-referenced by `@id` from the
  `WebSite`, the `ProfilePage` and every project, carrying `givenName`,
  `familyName`, `alternateName` (spelling variants) and `mainEntityOfPage`
- `sameAs` listing every off-site profile, generated from `profiles` in
  `lib/site.ts` - the same array that renders the footer and contact links, so
  a profile cannot be claimed in the markup without being linked on the page
- `<title>`, canonical, OG and sitemap all derived from `lib/site.ts`

**`NEXT_PUBLIC_SITE_URL` must be set to `https://sarbajit.com.np` in the Vercel
production environment.** Without it the fallback is the Vercel deployment
host, and every canonical, OG URL and sitemap entry points at `*.vercel.app`
instead - which tells Google the real domain is the duplicate.

The rest is off-site, and no amount of code substitutes for it:

1. Verify the domain in Google Search Console, set
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, submit `/sitemap.xml`, then use URL
   Inspection -> Request Indexing on both URLs.
2. Put `https://sarbajit.com.np` in the LinkedIn profile's Website field, the
   GitHub profile's Website field, and the Instagram bio link. `sameAs` is a
   claim; these links are what corroborate it, and the pair is what merges the
   three profiles and this site into one entity.
3. Keep the name spelled identically everywhere - profiles, bylines, the CV.
   Split spellings split the entity.

Ranking for a personal name is mostly a waiting game once the above is true:
the competition is other people with the name, and an exact-match domain with
corroborated profiles wins it in weeks, not days.

## Deploy

Vercel, framework preset Next.js, Node 24. No build-command override and no
output directory to set.

Environment variables (Production and Preview) are listed in `.env.example`.
`RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO` and `TURNSTILE_SECRET_KEY` are
server-side only: they are read in the route handler, which no client component
imports, and they must never appear under `.next/static`.

If DNS stays on Cloudflare, set the record to DNS-only rather than proxied — a
proxied record fights Vercel's certificate issuance.
