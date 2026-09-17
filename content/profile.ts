/**
 * Everything the About section renders.
 *
 * Values here come from Sarbajit's own record of the work — the NTCS role, the
 * degree and college, the skill groups. Nothing is invented: where there is no
 * answer, there is no field.
 */

export const bio = [
  "I'm a full-stack web developer in Kathmandu. I finished a B.Sc. in Computer Science and Information Technology at Madan Bhandari Memorial College in 2026, and spent most of that final year building production features at New Tech Consultancy Service.",
  "Day to day that meant Next.js on the front, Express.js and PostgreSQL behind it, across whichever client project needed the work. That was an e-commerce marketplace one week and a live news platform the next. The parts I enjoy most are the unglamorous ones: real-time currency exchange that has to stay correct, cart and product queries that have to stay fast.",
  "Not every problem fits an endpoint. Crop disease detection didn't, so that one went to Python and PyTorch. What I care about is that the architecture stays legible and the thing stays fast, from the database all the way to the browser.",
] as const;

export interface SkillGroup {
  readonly category: string;
  readonly items: readonly string[];
}

export const skills: readonly SkillGroup[] = [
  {
    category: "Frontend",
    items: ["Next.js", "React", "JavaScript", "TypeScript", "Tailwind CSS", "HTML5", "CSS3"],
  },
  {
    category: "Backend & ML",
    items: ["Node.js", "Express.js", "REST APIs", "Python", "PyTorch"],
  },
  {
    category: "Databases & Tools",
    items: ["PostgreSQL", "SQL", "Git", "GitHub", "Vercel", "Postman"],
  },
  {
    category: "Testing & QA",
    items: ["Manual QA", "Functional testing", "Bug reporting"],
  },
];

export interface TimelineEntry {
  readonly period: string;
  readonly title: string;
  readonly organization: string;
  readonly description: string;
  /** Specific work worth naming. Omitted where there is nothing to name. */
  readonly highlights?: readonly string[];
}

export const education: readonly TimelineEntry[] = [
  {
    period: "2022–2026",
    title: "B.Sc. in CSIT",
    organization: "Madan Bhandari Memorial College",
    description:
      "Four years of computer science and IT, with coursework in web development, database management, and data structures.",
  },
];

export const experience: readonly TimelineEntry[] = [
  {
    period: "Dec 2025 – Aug 2026",
    title: "Full Stack Web Developer",
    organization: "New Tech Consultancy Service (NTCS) · Full-time · Hybrid, Kathmandu",
    description:
      "Developed and maintained full-stack features in Express.js, PostgreSQL and Next.js across client projects, working with cross-functional teams to debug and ship production-ready work across the stack.",
    highlights: [
      "Built performance and backend features for Nonamart, an e-commerce marketplace, including real-time currency exchange handling and optimisations to the product and cart data flows.",
      "Contributed to 24 Ghanta Nepal, a live news platform, as part of the development team.",
    ],
  },
  {
    period: "Ongoing",
    title: "Independent Developer",
    organization: "Self-directed projects",
    description:
      "Building full-stack applications end to end, including agricultural tooling like Krishi Saathi, and working on deep-learning integrations inside React architectures.",
  },
];
