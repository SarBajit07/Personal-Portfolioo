# Personal Portfolio Website — Technical Requirements Document

| | |
|---|---|
| **Author** | Sarbajit Timalsina |
| **Document version** | 1.0 (MVP scope) |
| **Date** | September 2026 |
| **Status** | Draft — for build kickoff |
| **Project type** | Personal / portfolio |

A statically generated, professionally engineered portfolio site presenting Sarbajit Timalsina's full-stack development work, built to avoid templated or "vibe-coded" execution.

---

## 1. Purpose & Scope

This document defines the technical requirements for a personal portfolio website. The site's job is to present Sarbajit's full-stack engineering work — client projects, side projects, and professional background — to prospective employers, clients, and collaborators, with a level of craft and content depth that reads as deliberately built rather than auto-generated.

In scope: a statically exported marketing-style site with a home page, project case studies, an about page, and a working contact form. Out of scope for v1: a CMS/admin panel, a blog, multi-language support, and user accounts.

## 2. Goals & Non-Goals

### Goals

- Present 3–4 real projects as case studies (problem, role, stack, decisions, outcome) rather than a bare project grid.
- Load fast and score well on Core Web Vitals by shipping mostly static HTML with minimal client JS.
- Read as intentionally designed: a distinct type and color system, not a default template look.
- Provide a reliable way for visitors to make contact, without exposing any secrets client-side.
- Be easy to extend — adding a new project should mean adding a data file, not editing layout code.

### Non-Goals (v1)

- No CMS or admin UI — content is edited directly in the repository.
- No blog/articles section (may be added later as an MDX collection).
- No user authentication or dynamic personalization.

## 3. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router) | Static export via `output: 'export'` |
| Language | TypeScript | Strict mode enabled across the project |
| Styling | Tailwind CSS | Custom design tokens layered on top, not default palette |
| Content | MDX / typed data files | Projects and case studies as structured content, not hardcoded JSX |
| Contact form backend | Resend | Called from a serverless function, never from the client directly |
| Serverless runtime | Cloudflare Pages Functions | Keeps the rest of the site fully static; one dynamic endpoint |
| Hosting | Cloudflare Pages | Git-based deploys, consistent with existing Cloudflare usage (R2, DNS) |
| Analytics | Cloudflare Web Analytics | Privacy-respecting, no cookie banner required |
| CI | GitHub Actions | Lint, type-check, and build on every push |

## 4. Information Architecture

| Route | Purpose |
|---|---|
| `/` | Home — hero, brief positioning, featured projects, entry points to case studies and contact |
| `/projects` | Full list of projects with short summaries |
| `/projects/[slug]` | Individual case study — problem, role, stack, decisions, outcome |
| `/about` | Background, current role, education, skills |
| `/contact` | Contact form + direct email/GitHub links |

## 5. Content Model

Each project is defined as typed, structured content rather than embedded directly in a page component, so new projects are additions to data — not layout rewrites.

```ts
// types/project.ts
export interface Project {
  slug: string;
  title: string;
  summary: string;          // one-line, shown in project cards
  role: string;             // e.g. "Full-stack developer & QA"
  stack: string[];          // e.g. ["NestJS", "Next.js", "PostgreSQL"]
  problem: string;          // what the project solves
  approach: string;         // key technical decisions made
  outcome: string;          // result / current status
  featured: boolean;
  links?: { label: string; url: string }[];
  coverImage: string;
}
```

Candidate v1 case studies, drawn from existing work:

| Project | Stack | Angle for the case study |
|---|---|---|
| Ishara (NSL Translator) | React, MediaPipe / TensorFlow.js, FastAPI, WebSockets, PostgreSQL | Real-time accessibility tool for Nepali Sign Language — leads the page as the most technically distinctive project |
| Nona Mart | NestJS, Next.js, Tailwind, shadcn/ui | Client B2B export platform — payments, catalog, performance auditing, production deployment |
| Parivar | NestJS, Next.js, Flutter | Cross-border healthcare platform — multi-portal system with structured QA |
| Sales CRM (Pravidhi) | Next.js, Express.js, Prisma, PostgreSQL | Field sales visit tracker — smaller-scope, shows stack breadth |

## 6. Contact Form & Resend Integration

The site is statically exported, so the contact form cannot call Resend directly from client code — that would expose the API key. Instead, the site ships one dynamic endpoint, and everything else remains static.

> **Flow:** Browser form → `POST /api/contact` (Cloudflare Pages Function) → Resend API (server-side, key stored as a Cloudflare secret) → confirmation returned to the browser → optional auto-reply to the sender.

### Requirements

- Client-side validation: required name/email/message fields, email format check.
- Server-side re-validation in the function — never trust client validation alone.
- Basic abuse protection: honeypot field plus either IP-based rate limiting or Cloudflare Turnstile before the message is accepted.
- `RESEND_API_KEY` stored only as a Cloudflare Pages environment secret, never bundled into client JS.
- Clear success/error states in the UI; errors state what happened, not a generic "something went wrong."

```ts
// functions/api/contact.ts (Cloudflare Pages Function)
export const onRequestPost: PagesFunction<{ RESEND_API_KEY: string }> = async (ctx) => {
  const { name, email, message } = await ctx.request.json();
  // validate, then:
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ctx.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'portfolio@yourdomain.com',
      to: 'you@yourdomain.com',
      subject: `New message from ${name}`,
      reply_to: email,
      text: message,
    }),
  });
  return new Response(JSON.stringify({ ok: res.ok }), { status: res.ok ? 200 : 502 });
};
```

## 7. Design Requirements

- One deliberate typographic and color system defined before any component is built — not Tailwind's default palette or a generic dark-mode-with-one-accent look.
- Content-first hero: leads with the most characteristic thing about the work (e.g. a glimpse of the Ishara gesture-recognition demo), not a generic headline-plus-gradient block.
- Line lengths under ~80 characters for body copy; a clear type scale with intentional weights.
- Motion limited to one deliberate moment (e.g. a single load-in sequence) rather than scattered fade-ins on every section.
- Fully responsive down to mobile widths; visible keyboard focus states; respects `prefers-reduced-motion`.

## 8. Performance & SEO

- Target Lighthouse scores of 95+ across Performance, Accessibility, Best Practices, and SEO.
- Static export means near-zero server response time; keep client JS to interactive islands only (e.g. the contact form, any project demo widgets).
- Semantic HTML throughout; descriptive meta tags and Open Graph images per page.
- `sitemap.xml` and `robots.txt` generated at build time.
- Images served in modern formats (WebP/AVIF) and sized appropriately per breakpoint.

## 9. Security Considerations

- No secrets in client-side bundles — the Resend key lives only in the Cloudflare Pages Function environment.
- Contact endpoint validates and sanitizes input server-side; rejects oversized payloads.
- Rate limiting / bot mitigation (Turnstile or IP throttling) on the contact endpoint to prevent abuse of the Resend quota.
- Standard security headers (CSP, X-Content-Type-Options, Referrer-Policy) set via Cloudflare Pages configuration.

## 10. Deployment & CI/CD

- Repository hosted on GitHub; Cloudflare Pages connected for automatic deploys on push to `main`.
- GitHub Actions workflow: install → type-check (`tsc --noEmit`) → lint → build, run on every push and pull request.
- Preview deployments for pull requests via Cloudflare Pages' built-in preview URLs.
- Custom domain connected with DNS managed the same way as existing projects (Cloudflare DNS).

## 11. Phased Roadmap

| Phase | Deliverable |
|---|---|
| 1. Content | Final copy for About, 4 project case studies, contact page |
| 2. Scaffold | Next.js + TypeScript + Tailwind project, static export config, CI pipeline |
| 3. Data layer | Typed `Project` model, MDX/JSON content files for each case study |
| 4. Design system | Token system (color, type, spacing) and one hero treatment |
| 5. Pages | Home, project list, project detail, about, contact — built against the design system |
| 6. Contact integration | Form UI, Cloudflare Pages Function, Resend wiring, rate limiting |
| 7. QA & performance | Lighthouse pass, accessibility check, cross-browser/mobile testing |
| 8. Launch | Domain connection, final deploy, sitemap/robots submission |

## 12. Open Questions

- Should a resume/CV PDF be downloadable directly from the About page in v1?
- Is a blog/writing section likely enough in the near term to reserve an MDX route for it now?
- Final domain name and email address to use as the Resend "from" and "to" addresses.
