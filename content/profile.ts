/**
 * Everything the About section renders.
 *
 * Every value here was taken from the previous portfolio and its API
 * (personal-portfolio-n76z.onrender.com): the degree and college, the semester,
 * the three skill groups, the one experience entry. Nothing is invented — where
 * the old site had no answer, there is no field here.
 */

export const bio = [
  "I'm a full-stack developer in Kathmandu, in the eighth semester of a B.Sc. in Computer Science and Information Technology at Madan Bhandari Memorial College.",
  "Most of what I build is React on the front and Node.js on the back, with a relational database underneath. I design REST APIs with Express, keep data in PostgreSQL, and deploy on Vercel and Render. When a problem doesn't fit an endpoint — crop disease detection, for one — I reach for Python and PyTorch instead.",
  "What I care about is that the architecture stays legible and the thing stays fast, from the database all the way to the browser.",
] as const;

export interface SkillGroup {
  readonly category: string;
  readonly items: readonly string[];
}

export const skills: readonly SkillGroup[] = [
  {
    category: "Frontend",
    items: ["React", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Vite"],
  },
  {
    category: "Backend & ML",
    items: ["Node.js", "Express", "REST APIs", "Python", "PyTorch"],
  },
  {
    category: "Databases & Tools",
    items: ["PostgreSQL", "SQL", "Git", "GitHub", "Vercel", "Postman"],
  },
];

export interface TimelineEntry {
  readonly period: string;
  readonly title: string;
  readonly organization: string;
  readonly description: string;
}

export const education: readonly TimelineEntry[] = [
  {
    period: "2022 — Present",
    title: "B.Sc. in CSIT",
    organization: "Madan Bhandari Memorial College",
    description:
      "Currently in the 8th semester. Coursework in web development, database management, and data structures.",
  },
];

export const experience: readonly TimelineEntry[] = [
  {
    period: "Ongoing",
    title: "Independent Developer",
    organization: "Self-directed projects",
    description:
      "Building full-stack applications end to end, including agricultural tooling like Krishi Saathi, and working on deep-learning integrations inside React architectures.",
  },
];
