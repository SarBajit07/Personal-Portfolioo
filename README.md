# sarbajit.dev

Portfolio site. Next.js App Router, deployed to Vercel.

- `Portfolio-Website-TRD.md` — what gets built
- `BUILD-PLAN.md` — in what order, with exit criteria, and the design rules
- `content/QUESTIONS.md` — the interview that unblocks the copy

## Commands

| | |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | eslint |
| `npm run check:tells` | the BUILD-PLAN §0.5 design audit |
| `npm run check:content` | inventory of unanswered interview markers |
| `npm run check:launch` | the same, but fails if any survive (Phase 11.2) |

CI runs all of them on every push and PR.

## Rules that are enforced, not just documented

Tailwind's default palette, shadow scale, radius scale, type scale and font stack are **deleted**
in `app/globals.css`, not overridden. `bg-indigo-500`, `shadow-lg`, `rounded-2xl` and `text-4xl`
compile to nothing. What remains:

- colour: `paper`, `paper-2`, `ink`, `ink-2`, `ink-3`, `rule`, `accent`
- type: `text-caption` `note` `small` `body` `lead` `h3` `h2` `h1` `display` (12 → 96)
- radius: `rounded-hair` (2px), `rounded-sm` (4px). There is no larger one.

`npm run check:tells` catches what the token deletion cannot — gradients, `backdrop-filter`,
arbitrary hex colours, and the banned copy phrases.

There is no `Card` component and there will not be one. Separation is done with
`1px solid var(--rule)` and whitespace.

## Layout

12 columns. Prose sits in columns 2–8 (`col-prose`), the gutter at 9–12 (`col-gutter`) carries
dates, stack labels, footnotes and margin notes. Content is not centred.

## Content

One `.tsx` file per project in `content/projects/`, listed in `content/projects/index.ts`. Each
file exports its metadata and its prose; the route, the OG image, the index rows and the sitemap
entry all follow from the register.

Metadata is checked by the compiler — a typo'd or missing key is a type error, not a runtime
surprise. What a type cannot express (slug shape, duplicate slugs, the 90-character summary) is
asserted in the register and throws during prerender, so a malformed project fails the build rather
than rendering blank. There is no `order` field: the array *is* the order. A `draft: true` project
neither routes nor appears in any listing.

Prose is written with components imported from `components/prose.tsx` — `H2`, `P`, `Quote`,
`Figure`, `Demo`, `Note` and the rest — so content files carry no class names and no layout
decisions. `H2` holds the CSS counter that numbers sections in the left margin. Plain `<strong>`,
`<em>`, `<code>` and `<a>` are styled without an import. Images go through `Figure` or `Demo` only,
which forces true dimensions and a caption.

Writing guidance for each section is in `content/QUESTIONS.md`, deliberately not in the content
files: the file you edit is the file that ships.

## Interview markers

Copy is still the working brief. Every gap is a literal `TODO(sarbajit)` marker, and every body
that is still a skeleton carries `draftCopy: true`. Either one makes its page render a draft notice
and be served `noindex, nofollow`, so nothing half-written can be indexed by accident.
`draftCopy` starts `true`, so publishing unfinished prose has to be deliberate rather than
forgotten. `npm run check:content` lists what is left.

## Fonts

Fraunces (display, variable axes wired) ships now. Switzer and Commit Mono are licensed downloads
still to be added; Instrument Sans and JetBrains Mono stand in. Swapping them is a change to
`app/fonts.ts` alone.

## Deploy

Vercel, framework preset Next.js, Node 24. No build-command override and no output directory to
set — every page is prerendered and the one dynamic route is `app/api/contact`.

Environment variables (Production and Preview) are listed in `.env.example`. `RESEND_API_KEY`,
`CONTACT_FROM`, `CONTACT_TO` and `TURNSTILE_SECRET_KEY` are server-side only: they are read in the
route handler, which no client component imports, and they must never appear under `.next/static`.

If DNS stays on Cloudflare, set the record to DNS-only rather than proxied — a proxied record fights
Vercel's certificate issuance.
