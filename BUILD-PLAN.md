# Portfolio Build Plan — Phased

Companion to `Portfolio-Website-TRD.md`. The TRD says *what* to build; this says *in what order*, *with what exit criteria*, and *how the design avoids reading as machine-generated*.

**Direction locked (Phase 0):** editorial / print — warm paper ground, serif display over grotesk body, asymmetric columns, hairline rules and whitespace instead of cards.

**Working assumption on effort:** ~11–13 focused days. Phases are sequential where marked *blocking*; a few can overlap.

---

## Phase 0 — Direction & decisions lock

*Status: DONE. ~0.5 day. Blocking for everything else.*

Nothing gets coded until the type, colour and layout rules exist as written decisions. This is the phase that determines whether the site looks hand-made, and it is the phase most portfolios skip.

### 0.1 Type system

| Role | Face | Why this one |
|---|---|---|
| Display | **Fraunces** (variable: `opsz`, `wght`, `SOFT`, `WONK`) | Has real axes to tune. Setting `WONK=1` at display sizes and `WONK=0` at small sizes is a decision no template makes. |
| Body / UI | **Switzer** (Fontshare) — fallback: Instrument Sans | Grotesk with slightly humanist terminals. Not Inter, not Poppins, not Montserrat. |
| Metadata / stack labels | **Commit Mono** — fallback: JetBrains Mono | Used only for structural data (years, stack lists, index numbers), never for body prose. |

Self-host all three via `next/font/local` (Switzer and Commit Mono are downloads; Fraunces can come through `next/font/google`). Subset to Latin. Preload display + body only; mono loads with `swap`.

**Hand-tuned scale** — not a blind modular ratio; the jumps widen deliberately at the top:

```
12  14  16  18  21  28  40  64  96
```

- Display sizes (40+): tracking `-0.022em`, `line-height: 0.95–1.05`
- Body: 18px / `line-height: 1.6` / measure **62–68ch** (TRD §7 asks for under 80ch — 66 is the target)
- Small-caps labels: 12px, tracking `+0.09em`, uppercase, `--ink-3`
- `text-wrap: pretty` on body, `text-wrap: balance` on headings only

### 0.2 Colour tokens

```css
:root {
  --paper:   #FAF8F3;  /* ground — warm, never #FFF */
  --paper-2: #F2EDE4;  /* recessed blocks, table zebra */
  --ink:     #171512;  /* primary text — warm black, never #000 */
  --ink-2:   #4A443C;  /* secondary prose */
  --ink-3:   #8A8177;  /* metadata, captions, footnotes */
  --rule:    #DED6C8;  /* hairlines — 1px, the main separator on the site */
  --accent:  #9E3D22;  /* terracotta — links, the index rule, one hero mark */
}
```

Dark mode inverts to `--paper: #14120F` / `--ink: #EFE9DE` / `--accent: #D4703F`. **Accent appears no more than three times per viewport.** There is no second accent.

### 0.3 Layout rules

- 12-column grid, but content is **not centred**: prose sits in columns 2–8, the gutter at 9–12 carries margin notes, dates and footnotes.
- Separation is done with `1px solid var(--rule)` and whitespace. **Box-shadow is banned.** `border-radius` maxes at `4px`, and is mostly `0`.
- Section rhythm varies on purpose: About breathes; a case study is dense.
- Mobile collapses margin notes to inline asides beneath their paragraph — not into a card.

### 0.4 Motion budget

One moment, once, on first paint: hero lines rise 8px and fade in, staggered 40ms. That is the entire animation budget for the site. No scroll-triggered reveals anywhere. `prefers-reduced-motion: reduce` disables it and renders the final state.

### 0.5 The anti-AI-tell contract

Re-used as an audit checklist in Phase 10.

**Never ships:**

1. Gradient text, gradient buttons, aurora / blob / mesh backgrounds, glow
2. Glassmorphism — any `backdrop-filter` card
3. Indigo, violet, cyan (`#6366F1`, `#8B5CF6`, `#0EA5E9` and their neighbours)
4. `rounded-2xl` + `shadow-lg` as the default container
5. A three-up grid of equal-height project cards
6. Scroll-triggered fade-ins on every section
7. Skill percentage bars, star ratings, "years of experience" counters
8. A wall of tech-logo badges in brand colours
9. An icon or emoji beside every heading — icons only where they carry meaning
10. Centred hero: name + tagline + two buttons
11. Copy containing "passionate about", "crafting digital experiences", "turning ideas into reality", "let's build something amazing"
12. Inter / Poppins / Montserrat as the primary voice
13. Dotted-grid or noise-mesh hero backgrounds, 3D blobs, stock illustration
14. Typewriter effect on the role line
15. Sparkle emoji, anywhere, ever

**Must ship — the fingerprints:**

1. Hanging punctuation and negative indent on opening quotes and index numerals
2. Asymmetry — the content column is not centred on the page
3. Real numbers throughout: latency in ms, dataset sizes, user counts, months rather than bare years
4. At least one paragraph per case study on **what didn't work**, or what you would do differently. Generated copy never contains regret.
5. Hand-set line breaks in the hero, placed where a typesetter would break them
6. A running index (`01`, `02`, `03`) with real dates
7. Real footnotes, with real footnote behaviour
8. Screenshots at true aspect ratio, hand-cropped, with no perspective mockup frames
9. One idiosyncratic element — candidates: a live Ishara gesture-recognition loop in the hero, or a Devanagari letterform as the site mark
10. A footer carrying something specific and human — Kathmandu time, last-deployed date

**Exit criteria:** tokens written down, three faces downloaded and licensed, this contract agreed.

---

## Phase 1 — Content first

*~2–3 days. Blocking for Phases 5–7.*

Copy is written before any layout. This ordering is the single biggest defence against a templated look: real sentences of irregular length force a real layout, whereas designing first produces boxes that then get filled with filler.

### Tasks

1. A `content/` directory of plain markdown drafts — no framework yet.
2. Draft four case studies against a fixed spine: **Problem → Role → Constraints → Approach and the decisions → What broke → Outcome**.
   - Ishara (NSL translator) — the lead study, most technically distinctive
   - Nona Mart (B2B export platform)
   - Parivar (cross-border healthcare)
   - Sales CRM, Pravidhi (stack breadth, deliberately shorter)
3. Write About: current role, background, education, how you actually work. First person, specific, no mission statement.
4. Write the hero: 15 words at most, naming what you actually build. Not a job title.
5. Collect the hard numbers per project — latency, record counts, users, dates, team size. Gaps get `TODO(sarbajit)` markers rather than invented figures.
6. Answer TRD §12: CV PDF on About (yes/no), reserve a `/writing` route (yes/no), final domain plus Resend from/to addresses.

**Exit criteria:** every page's copy exists in draft, every `TODO(sarbajit)` is filled or explicitly deferred, and each case study contains at least one real number and one honest failure.

---

## Phase 2 — Scaffold & CI

*Status: DONE except step 5, which needs a Vercel account. ~0.5 day. Can overlap Phase 1.*

Built on Next 16.3 / React 19.2 / Tailwind 4.3 / TypeScript 6, scaffolded by hand rather than by
`create-next-app` so none of the default boilerplate — the Geist fonts, the starter `globals.css`,
the sample page — ever entered the repo.

1. `create-next-app` — TypeScript strict, App Router, Tailwind, ESLint. Node 24 is installed locally; pin it in CI.
2. `next.config.ts`: `trailingSlash: true`, security headers via `headers()`, `turbopack.root` pinned.
3. The one dynamic endpoint is a Route Handler at `app/api/contact/route.ts`, inside the Next build.
4. GitHub Actions: install → `tsc --noEmit` → lint → tell audit → content audit → build, on push and PR.
5. Connect the repo to Vercel; confirm a preview URL builds. **Outstanding.** Framework preset
   Next.js, no build-command override, Node 24.

### Hosting: Cloudflare Pages → Vercel

Decided after Phase 3, before anything was connected, so it cost a config rewrite and nothing else.
The plan originally assumed Cloudflare Pages, which serves static files and therefore forced
`output: 'export'`. That single line was the source of two constraints that no longer apply:

- **The image optimiser was off**, so Phase 9 had to hand-generate AVIF/WebP at fixed widths and
  serve them through `<picture>`. On Vercel `next/image` does that work. Phase 9.1 is now a
  cropping task, not a pipeline.
- **The contact endpoint had to live outside the build**, in a `functions/` directory Cloudflare
  served alongside `out/`. It is now `app/api/contact/route.ts`, sharing the Zod schema in
  `lib/contact.ts` with the form instead of duplicating validation on each side.

Two smaller consequences: security headers moved from a `_headers` file into `headers()` in
`next.config.ts`, where they are typed and versioned; and Cloudflare Web Analytics is no longer
implied by the host — it still works as a script tag if wanted, otherwise Vercel Analytics.

Every page is still prerendered. Dropping `output: 'export'` did not make the site dynamic; the
build output shows one `ƒ` route, and it is the contact endpoint.

Deviations from the original step list, both forced:

- Next 16 dropped the `eslint` key from `next.config.ts`, and `eslint-config-next` now ships flat
  config directly, so `eslint.config.mjs` imports it without `FlatCompat`. Lint runs as its own CI
  step rather than during the build.
- `turbopack.root` is pinned in `next.config.ts`; without it Next inferred a stray lockfile in the
  home directory as the workspace root.

CI runs install -> typecheck -> lint -> **tell audit** -> **content audit** -> build.

**Exit criteria:** local `npm run build` prerenders every page, typecheck and lint are clean.
Vercel preview deploys remain to be confirmed.

---

## Phase 3 — Design system in code

*Status: DONE, pending the licensed body and mono faces. ~1–1.5 days. Blocking for Phases 5–8.*

1. Tokens from 0.2 into `globals.css` as CSS custom properties; the Tailwind theme references them. Tailwind's default palette and default font stack are **removed**, not merely overridden — if `bg-indigo-500` still resolves, it will eventually get used.
2. Fonts wired via `next/font/local`, with the Fraunces axis settings applied per size band.
3. Build the specimen — a private page rendering the whole system: every type size in context, colour swatches, rules, a real paragraph at 66ch, footnote and margin-note treatments, form fields, focus states. Delete or `noindex` it before launch.
   - It lives at **`/specimen`**, not `/_specimen`: the App Router treats a leading underscore as a private folder and refuses to route it. It carries `robots: noindex, nofollow` and a theme switcher for checking both palettes.
4. Primitives only: `Prose`, `MarginNote`, `Rule`, `IndexRow`, `Field`. Explicitly **no** `Card` component — its absence is what enforces the layout rules.
5. Focus states: 2px `--accent` outline at 2px offset, visible on every interactive element.

### What actually enforces 0.5

Deleting the theme namespaces in `@theme inline` (`--color-*`, `--shadow-*`, `--radius-*`,
`--text-*`, `--font-*`, `--blur-*`) makes most of the "never" list unreachable: `bg-indigo-500`,
`shadow-lg`, `rounded-2xl` and `text-4xl` now compile to nothing. Verified against a scratch file
containing all four.

Three tells survive that, so they are caught mechanically instead:

- gradients and `backdrop-filter` still resolve as structural utilities
- arbitrary hex values can always smuggle a palette back in
- copy tells resolve anywhere

`scripts/check-tells.mjs` (`npm run check:tells`, wired into CI) scans `className` values for
shadows, oversized radii, backdrop filters, gradients, the indigo/violet/cyan family and
off-budget animations, and scans copy for the banned phrases, the sparkle emoji and the banned
typefaces. A line that names a tell in order to ban it is exempted with a `tell-audit-ok` marker.

Tailwind source detection is set to `source(none)` with explicit `@source` entries, because
automatic detection scanned this plan and the audit script — both of which name banned utilities —
and duly generated them.

### Fonts as shipped

Fraunces is wired with its real axes (`opsz`, `SOFT`, `WONK`), set to `WONK 1` at h1/h2 and `WONK 0`
at h3 and below, exactly as 0.1 specifies. Switzer and Commit Mono are paid/manual downloads and are
**not yet in the repo**; their documented fallbacks — Instrument Sans and JetBrains Mono — ship in
their place. Swapping them in is a change to `app/fonts.ts` only: the CSS variable names
(`--font-grotesk`, `--font-mono-face`) stay put.

**Exit criteria:** `/specimen` reads as one coherent system, and nothing on it looks like a default Tailwind page.

---

## Phase 4 — Content layer

*Status: DONE. ~0.5 day. Needs Phases 1 and 2.*

1. `types/project.ts` as TRD §5, plus `dates`, `status`, `draft` and `draftCopy` — the gutter and
   the draft mechanism need them. `problem`, `approach` and `outcome` stay as one-line abstracts for
   the index, the OG card and the page description; the long form of each is the body.
2. One `.tsx` file per project in `content/projects/`, each exporting `meta` and `Body`, listed in
   `content/projects/index.ts`.
3. Validation is split. Metadata shape is the compiler's job — a typo'd or missing key is a type
   error. What a type cannot express (slug shape, duplicate slugs, the 90-character summary, empty
   stack, relative link URLs) is asserted in the register and throws during prerender, so a
   malformed project fails the build rather than rendering blank. Drafts never route and never
   appear in a listing.
4. `generateStaticParams` for `/projects/[slug]`, with `dynamicParams = false`.

### Why not MDX

The first cut of this phase compiled MDX with `@mdx-js/mdx`'s `evaluate`. It worked, but the
content files it produced were briefs wearing content's clothes: writing instructions, draft shapes
and build notes sitting in the file that renders, to be deleted by hand as the prose landed. Prose
is TSX now and the guidance moved to `content/QUESTIONS.md`, so the file you edit is the file that
ships.

What that cost: four dependencies (`@mdx-js/mdx`, `gray-matter`, `remark-gfm`, `@types/mdx`), the
runtime Zod schema, and the property that adding a project is adding *one* file — the register
needs a line too, because TypeScript cannot glob.

What it bought: metadata errors move from prerender to the editor; `order` disappears entirely,
because the register array *is* the order, which deletes the "two projects claim order 2" failure
mode instead of validating for it; and prose can use any component in the codebase without a
provider.

Prose is written with components from `components/prose.tsx` — `H2`, `P`, `Quote`, `Table`,
`Figure`, `Demo`, `Note` and the rest — so content carries no class names. `H2` holds the section
counter, so a bare `<h2>` would break the numbering. Inline `<strong>`, `<em>`, `<code>` and `<a>`
are styled by descendant selector and need no import. There is no markdown image syntax to misuse:
`Figure` and `Demo` both require true dimensions and a caption.

### Interview markers, and why the build stays green

Phase 1's briefs are unanswered — 66 `TODO(sarbajit)` markers across the content and three source
files, plus five bodies flagged `draftCopy: true`. Rather than block the build, each is
load-bearing:

- `npm run check:content` inventories them by file and line.
- Any page carrying either renders a draft notice and is served `noindex, nofollow`, so nothing
  half-written can be indexed by accident.
- `npm run check:launch` is the same script with `--strict`; it fails if anything survives, and it
  is the mechanical form of Phase 11.2.

`draftCopy` starts `true` on every body. A skeleton cannot always be caught by a string match, so
the flag says it outright, and publishing unfinished prose has to be a deliberate act.

**Exit criteria:** met. Setting a summary to 120 characters fails the build with the file name, the
actual length and the limit, rather than rendering a broken index row.

---

## Phase 5 — Home & hero

*Status: BUILT, awaiting real copy. ~1–1.5 days.*

1. Hero: the left column carries the hand-broken statement; the right column carries the characteristic artefact (Ishara demo loop, or a real screenshot), with a margin note annotating it. Not centred, no button pair.
2. Featured projects as a numbered **index**, not a card grid — `01 / title / one-line / stack in mono / year`, separated by hairlines, with the whole row as the hit target.
3. The single load-in animation from 0.4.
4. Header and footer. The footer gets the specific human detail.

Hero copy is candidate A from `content/hero.md`, the recommended one, set on three hand-broken
lines. The gutter carries the "Currently" line — still a marker until Q6 and Q8 are answered. The
artefact beside the hero waits on Q25; the hero was built to work without it, which is the point of
the exit criterion.

**Exit criteria:** met on structure. The hero is three lines of type and a gutter note, so it is
legible with images disabled by construction; nothing on the page is a card; the tell audit passes.
Re-check once the real "Currently" line lands.

---

## Phase 6 — Case study template

*Status: BUILT, awaiting real copy. ~1.5 days. The most important page on the site.*

1. `/projects/[slug]` long-form layout: prose in columns 2–8, the gutter carrying stack, role, dates, links and margin notes.
2. The section spine from Phase 1, with real footnotes.
3. Figures: full-bleed or column-width, with real captions that say something rather than repeating the alt text.
4. Prev/next at the foot as index rows, matching the home page.
5. Ishara gets one extra treatment the others do not have — deliberate inconsistency, because a real designer spends more effort on the best project.

Section numerals are a CSS counter on `.case-body`, hanging in the left margin above 80rem, so the
spine of a long article is visible without a sidebar. Lists take an en dash rather than a bullet.
Margin notes carry the asides that footnotes would; prev/next wrap, so the foot of the best page on the site
is not a dead end.

Ishara's one extra treatment (6.5) is a full-bleed epigraph between the header and the article: its
`problem` line set in display type across all twelve columns, between two hairlines. Nothing else on
the site gets it. It needs no media, so it stands whether or not Q25 produces a capture.

**Exit criteria:** structure met; the reading test needs the real copy. The print stylesheet holds.

---

## Phase 7 — Projects index & About

*Status: BUILT, awaiting real copy. ~1 day.*

1. `/projects` — the full index, same row language as home, no filters. Filter UI over four items is itself a tell.
2. `/about` — deliberately airier than the case studies. Background, current role, education, skills as prose or a plain table, never as bars or ratings.
3. CV PDF link, if Phase 1 decided yes.

About shares the element map with the case studies and overrides it: no section numerals, no rules
between sections, body at `--text-lead` with looser leading. The density difference is the whole
point — it must not read as the same template with different words.

CV PDF link: still open, waiting on Q3.

**Exit criteria:** the density difference is in place. The "reads like a person wrote it" half waits
on the interview.

---

## Phase 8 — Contact & Resend integration

*Status: BUILT, awaiting a Resend account. ~1 day. Needs Phases 2 and 3.*

1. `/contact` — the form plus direct email and GitHub links, so the form is never the only route.
2. Client validation against `lib/contact.ts`, the same Zod schema the server uses, so the message a
   person sees is the message the server would have sent. Inline under the field, never a toast.
3. `app/api/contact/route.ts` per TRD §6 — a Route Handler now rather than a Pages Function:
   - the payload is capped at 16 KB by header and again by actual length, before it is parsed;
   - server-side re-validation on the parsed body, independent of the client;
   - a honeypot field, hidden from people and from screen readers;
   - a minimum fill time of 3s, because a form completed faster than that was not completed by a person;
   - Turnstile verification when `TURNSTILE_SECRET_KEY` is set, and a best-effort per-IP throttle
     (3 per 10 minutes) regardless. The throttle is per serverless instance and catches only the naive
     case; Turnstile is the actual control, which is why it is worth configuring.
4. `RESEND_API_KEY`, `CONTACT_FROM` and `CONTACT_TO` are Vercel Environment Variables, read only in
   the route handler. Nothing in that file is imported by a client component. Verified: no match for
   `RESEND_API_KEY`, `TURNSTILE_SECRET` or `re_` anywhere under `.next/static`.
5. Six distinct failures, each with its own copy in `errorCopy`: validation, too large, rate limited,
   rejected as automated, not yet configured, upstream rejected. A missing API key says the form is
   not connected yet rather than pretending the message failed.
6. Auto-reply to the sender: still open.

**Exit criteria:** code complete and the secret-leak check passes. A real message from a preview
deploy, and the honeypot and rate-limit rejections, need `RESEND_API_KEY` set — see
`.env.example`.

---

## Phase 9 — Media, SEO & OG

*Status: DONE except the media itself. ~0.5 day.*

1. Hand-crop every screenshot at true aspect ratio. **Outstanding — needs the screenshots.** The
   AVIF/WebP pipeline this step originally described is gone with `output: 'export'`: `next/image`
   handles formats and widths, and `components/Figure.tsx` requires true dimensions and a caption
   for every figure. `Demo` covers the Ishara capture — muted, looping, `playsinline`, with a poster
   and controls so `prefers-reduced-motion` has somewhere to land.
2. Per-page metadata done. OG images are generated by `next/og` from `components/OgCard.tsx` — paper
   ground, hairlines, mono label, the title in Fraunces. The face is fetched at build time behind a
   try/catch: a preview card in a fallback serif is a much smaller problem than a failed build.
3. `app/sitemap.ts` and `app/robots.ts`, generated at build time. `/api/` and `/specimen/` are
   disallowed.
4. Semantic landmarks and one `h1` per page, plus a skip link.
5. Security headers (CSP, X-Content-Type-Options, Referrer-Policy, X-Frame-Options,
   Permissions-Policy, HSTS) in `headers()` in `next.config.ts`. CSP allows Turnstile explicitly and
   nothing else off-origin. Analytics: still open — Vercel Analytics, or Cloudflare Web Analytics as
   a script tag, whichever is preferred.

**Exit criteria:** titles, descriptions and OG images are correct on every page. Link previews on
two platforms need a deploy.

---

## Phase 10 — QA, performance & the tell audit

*~1 day.*

1. Lighthouse 95+ on all four categories, on `/`, `/projects/ishara`, `/about` and `/contact`.
2. Accessibility: a full keyboard pass, visible focus everywhere, axe clean, contrast checked in both themes, `prefers-reduced-motion` honoured.
3. Cross-browser: Safari (iOS especially), Firefox, Chrome. Test at 360px, 768px and 1440px.
4. **Tell audit** — walk the 15 "never" items and the 10 "must" items from 0.5 explicitly, page by page, and fix anything that drifted back in during the build.
5. Show it to two people cold and ask whether it looks generated. Their hesitation is the signal, not their answer.

**Exit criteria:** scores met, audit clean, both reviewers read it as hand-built.

---

## Phase 11 — Launch

*~0.5 day.*

1. Custom domain on Vercel; HTTPS and redirects verified. If DNS stays on Cloudflare, the record
   must be DNS-only rather than proxied, or certificate issuance fights the proxy.
2. Delete `/specimen`; run `npm run check:launch`, which fails while any `TODO(sarbajit)` survives.
3. Production deploy from `main`; submit the sitemap.
4. Verify the contact form on the live domain.

**Exit criteria:** live on the custom domain, form working in production, analytics recording.

---

## Dependency map

```
Phase 0 ──┬─> Phase 1 (content) ───┐
          │                        ├─> 5 ──> 6 ──> 7 ──┐
          └─> Phase 2 (scaffold) ──┤                   ├─> 9 ──> 10 ──> 11
                  └─> Phase 3 (design system) ─┬─> 4 ──┤
                                               └─> 8 ──┘
```

Phases 1 and 2 run in parallel. Phase 8 can be built any time after Phase 3.

## Standing risks

| Risk | Mitigation |
|---|---|
| Design drifts back to defaults mid-build | Tailwind default palette and font stack deleted in Phase 3; tell audit in Phase 10 |
| Case study copy stays generic | The Phase 1 gate requires a real number and a real failure per study |
| Static export breaks image handling | Decided in Phase 2, executed in Phase 9 with hand-generated formats |
| Resend key leaks into the bundle | A build-time grep of `out/` as a Phase 8 exit criterion |
| The Ishara demo is heavy | Ship a short looping video first; the live model only if it stays inside the performance budget |
