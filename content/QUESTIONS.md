# Phase 1 — content interview

Answer inline under each question. Nothing here gets invented on your behalf: fabricated numbers are the fastest way to make a portfolio read as generated, because they are always round, always flattering, and never surprising.

Anything you genuinely don't have, write `skip` and the draft will be rewritten to not need it.

---

## A. Decisions still open (TRD §12)

1. **Domain** — final domain name?
2. **Resend addresses** — the `from` address (e.g. `portfolio@yourdomain`) and the `to` address (where messages land)?
3. **CV PDF** — downloadable from About in v1? yes / no
4. **Writing section** — reserve a `/writing` MDX route now, or leave it out entirely? (Leaving it out is fine; an empty blog is worse than none.)
5. **Dark mode** — ship both themes in v1, or light only? (Light-only is defensible for this direction and saves a QA pass.)

---

## B. You

6. Current role and employer, with start month/year.
7. Education — institution, programme, years.
8. Where you're based, and whether you're open to remote/contract work right now.
9. Two or three sentences on what you actually do day to day — not the job title, the work.
10. What you want this site to *get you*. Job offers? Client work? Collaborators? The hero copy points at whichever it is.
11. One thing you're genuinely good at that doesn't show up on a CV.

---

## C. Per project

Answer these four times — once each for **Ishara**, **Nona Mart**, **Parivar**, **Sales CRM**. Short answers are fine; specific ones matter more than long ones.

12. **Dates** — started when, shipped when, still running?
13. **Team** — solo, or how many people and who did what? What was *your* part, precisely?
14. **Client or self-initiated?** If client work, what can you say publicly, and what can't you?
15. **The problem in one sentence** — what was broken before this existed?
16. **The hardest technical constraint you hit.** Not "scaling" in the abstract — the specific one that cost you days.
17. **A decision you made that a different engineer would have made differently**, and why you went the way you did.
18. **Something that didn't work.** A rewritten module, a wrong abstraction, a feature that shipped and got pulled, a performance assumption that was false. This is the section that most makes the writing read as human — every case study needs one.
19. **Numbers you actually have.** Any of: latency, throughput, users, records, orders, dataset size, model accuracy, build time, Lighthouse score, uptime, bundle size. Give real figures with units, or `skip`.
20. **Current status** — live, archived, handed over, in maintenance?
21. **Links** you're willing to publish — live URL, repo, demo, case study elsewhere.
22. **Screenshots** — can you get them? For each project, which two or three screens best show the actual work rather than a landing page?

### Ishara only

23. Which sign vocabulary, and how large? How was the training data sourced?
24. Where does inference run — browser, server, both? What's the measured end-to-end latency?
25. Can you record a 5–10 second screen capture of it recognising signs? This is the intended hero artefact for the whole site.
26. Did you work with any Deaf signers or NSL speakers on it? If so, what changed as a result?

---

## D. Media

27. A photo of you — optional, but if you have one that isn't a LinkedIn headshot, it helps.
28. Anything visual and specific to the work: a whiteboard, an architecture sketch, a terminal, a failed output. Real artefacts beat polished mockups.

---

## Why these questions

Questions 16, 17 and 18 do most of the work. A generated case study describes what a system does. A written one describes what it cost, what was traded away, and what the author would change. Answer those three honestly per project and the copy will not read as machine-made regardless of how the rest is phrased.

---

## E. Writing guidance, section by section

This used to sit inside the content files themselves. It lives here now so the
file you edit is the file that ships — nothing to delete as you write.

Prose is written in `content/projects/<slug>.tsx` and `content/about.tsx`, using
components imported from `@/components/prose`:

| | |
|---|---|
| `H2` | a numbered section. The numeral in the left margin is a CSS counter — use `H2`, not a bare `<h2>`, or the numbering skips |
| `H3` | subheading inside a section |
| `P` | paragraph |
| `UL` / `OL` / `LI` | lists |
| `Quote` | pull quote |
| `A` | link. External vs internal is decided from the href, not by you |
| `Table` | wraps a `<tbody>`; scrolls sideways rather than breaking the grid |
| `Figure` / `Demo` | image and looping screen capture. Both require real dimensions and a caption |
| `Note` | margin note — sits in the right gutter beside its paragraph |
| `Pre` / `Rule` | code block, section break |

Plain `<strong>`, `<em>`, `<code>` and `<a>` are styled without an import.

**Set `draftCopy: false` in the file's `meta` once the prose is real.** Until you
do, the page shows a draft notice and is served `noindex`.

### Case study sections

- **The problem** — Q15. What was broken before this existed, for whom, concretely. Frame it as a specific person unable to do a specific thing, not as a market gap.
- **My role** — Q13, Q14. Solo or team, and exactly which parts were yours. If parts weren't, say so; claiming a whole system is a tell.
- **Constraints** — Q16. The real one that cost you days, with the budget you were working to and whether you hit it.
- **Approach and the decisions** — Q17. Name the decision a different engineer would have made differently, and say why you went your way.
- **What didn't work** — Q18. The section that most makes writing read as human. Every case study needs one.
- **Outcome** — Q19, Q20. Real figures with units, or say you don't have them.

Ishara is the lead: target 900–1200 words, and it carries one layout element
nothing else on the site has. Sales CRM is deliberately the shortest at 350–450
words — four studies at identical length is a template tell.

### About

Target 350–500 words, first person, airier than a case study. No mission
statement, no values list, no skill bars.

- **Opening** — Q6, Q9. Two or three sentences, present tense: the role, the employer, what you're working on this month.
- **How I got here** — Q7. If the route was unusual, say so plainly. Ordinary routes are fine; just don't dress them up.
- **How I work** — Q9, Q11. The paragraph most portfolios waste on adjectives. Replace it with something falsifiable.
- **Stack** — a plain two-column table. Not logo badges, not percentage bars, not a rating out of five. A line naming what you *don't* do is worth more than another row.
- **Outside the work** — Q11. One short paragraph, or cut the section. Specific: a place, a habit, a thing you make. Not "hiking and coffee".

If Q3 is yes, the CV PDF sits under the opening paragraph as a plain text link
with the file size beside it — not a download button. A photo, if Q27 produces
one, sits in the right gutter at column width, uncropped and unfiltered.
