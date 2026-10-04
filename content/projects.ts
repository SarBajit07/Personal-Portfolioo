import type { Project } from "@/types/project";

/**
 * The project cards, in display order. There are no per-project routes any
 * more — a card carries the whole story, so it has to be honest at a glance.
 *
 * Blurbs and stacks come from the NTCS work (Nonamart, 24 Ghanta Nepal), the
 * client QA engagement (Parivar), the Pana Productions frontend build and the
 * old portfolio's API (Krishi Saathi). Links were not recorded for all of them,
 * so `live` and `repo` are left off rather than guessed — a card simply omits
 * what it doesn't know.
 *
 */
export const projects: readonly Project[] = [
  {
    slug: "nonamart",
    title: "Nonamart",
    blurb:
      "An e-commerce marketplace built at NTCS. I worked the backend and the performance side of it: real-time currency exchange handling that has to stay correct across a session, and optimisations to the product and cart data flows that carry the checkout.",
    stack: ["Next.js", "Express.js", "PostgreSQL", "Tailwind CSS"],
    image: "/projects/nonamart.jpg",
    /* Checked 2026-09-11: the domain resolves, but the Nonamart deployment is
       not on it — the host answers every name with its default vhost, whose
       certificate is issued for thimar.com, so a browser warns before showing
       an unrelated site. Kept live at Sarbajit's request; worth re-checking. */
    live: "https://nonamart.com/",
    year: "2026",
    featured: true,
  },
  {
    slug: "24-ghanta-nepal",
    title: "24 Ghanta Nepal",
    blurb:
      "A live Nepali news platform I worked on with the team at NTCS. Editors file into desks: politics, society, sports, technology, long-form research. Stories carry bylines, read times, and breaking flags that have to surface within minutes. The read path is nearly all of the traffic, so the work was keeping it fast under a constant stream of new articles.",
    stack: ["Next.js", "Express.js", "PostgreSQL"],
    image: "/projects/24-ghanta-nepal.jpg",
    live: "https://24ghantanepal.com/",
    year: "2026",
    featured: true,
  },
  {
    slug: "pana-productions",
    title: "Pana Productions",
    blurb:
      "A Kathmandu creative production house that needed three sites rather than one, and I built the frontend for all of them. The main site carries the whole studio (events, commercial shoots, film making, digital), while Pana Events sits on its own domain for weddings and ceremonies, with a selected-work gallery of the films, and Pana Studio sells the pre-lit rooms themselves: the chroma set, the talk set, what is already rigged before a client walks in. Three front ends on one identity, carrying a lot of full-bleed video and photography that still has to load fast on a Nepali mobile connection.",
    stack: ["Next.js", "React", "Tailwind CSS"],
    image: "/projects/pana-productions.jpg",
    live: "https://panaproductions.com.np/",
    alsoLive: [
      { label: "Pana Events", href: "https://events.panaproductions.com.np/" },
      { label: "Pana Studio", href: "https://studio.panaproductions.com.np/" },
    ],
    year: "2026",
    featured: true,
  },
  {
    slug: "parivar",
    title: "Parivar",
    blurb:
      "A cross-border healthcare platform, built for a client. Family members abroad subscribe to arrange in-home nursing visits for elderly parents in Nepal, read the clinical reports that come back, coordinate with hospitals, and put questions to an AI assistant. Three more roles sit behind that one: field nurses running the visits and capturing vitals, doctors giving remote clinical oversight, admins running operations. I wasn’t on the build here. I was the manual QA, working every portal feature by feature, from nurse sign-up and KYC verification through the visit, vitals and reporting flows.",
    /* Not a stack. Listing one would claim authorship of a codebase I tested
       rather than wrote — these are the shape of the contribution instead. */
    stack: ["Manual QA", "Functional testing", "Multi-portal flows"],
    image: "/projects/parivar.jpg",
    live: "https://parivar.com.au/",
    year: "2026",
    featured: true,
  },
  {
    slug: "krishi-saathi",
    title: "Krishi Saathi",
    blurb:
      "My college final year project: an agricultural web app giving farmers real-time market prices, crop disease detection from a photo, and expert advice in one place. The disease model is where I first worked in PyTorch.",
    stack: ["React", "Tailwind CSS", "PyTorch", "MongoDB"],
    year: "2025",
    featured: false,
  },
];
