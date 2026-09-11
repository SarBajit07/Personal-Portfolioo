import type { Project } from "@/types/project";

/**
 * The project cards, in display order. There are no per-project routes any
 * more — a card carries the whole story, so it has to be honest at a glance.
 *
 * Blurbs and stacks come from Portfolio-Website-TRD.md §5 (the four current
 * projects) and from the old portfolio's API (Krishi Saathi). No dates,
 * outcomes or links were recorded for any of them, so `live`, `repo` and `year`
 * are left off rather than guessed — a card simply omits what it doesn't know.
 *
 * TODO(sarbajit): screenshots. Drop a file in public/projects/ and set `image`
 * to its path; until then each card renders a lettered placeholder.
 */
export const projects: readonly Project[] = [
  {
    slug: "ishara",
    title: "Ishara",
    blurb:
      "A real-time translator for Nepali Sign Language. Gesture recognition runs against a live camera feed and streams results back over a socket, so signing is read as it happens rather than after an upload.",
    stack: ["React", "MediaPipe", "TensorFlow.js", "FastAPI", "WebSockets", "PostgreSQL"],
    featured: true,
  },
  {
    slug: "nona-mart",
    title: "Nona Mart",
    blurb:
      "A B2B export platform built for a client: product catalogue, payments, and a production deployment I audited for performance rather than handed over on trust.",
    stack: ["NestJS", "Next.js", "Tailwind CSS", "shadcn/ui", "PostgreSQL"],
    featured: true,
  },
  {
    slug: "parivar",
    title: "Parivar",
    blurb:
      "A cross-border healthcare platform. Several portals over one system, with a mobile client in Flutter and a structured QA pass behind each release.",
    stack: ["NestJS", "Next.js", "Flutter", "PostgreSQL"],
    featured: true,
  },
  {
    slug: "sales-crm",
    title: "Sales CRM",
    blurb:
      "A field sales visit tracker built at Pravidhi. Deliberately small in scope — it exists to record what happened on a visit, and does not try to be a pipeline tool as well.",
    stack: ["Next.js", "Express.js", "Prisma", "PostgreSQL"],
    featured: false,
  },
  {
    slug: "krishi-saathi",
    title: "Krishi Saathi",
    blurb:
      "An agricultural web app giving farmers real-time market prices, crop disease detection from a photo, and expert advice in one place. The disease model is where I first worked in PyTorch.",
    stack: ["React", "Tailwind CSS", "PyTorch", "MongoDB"],
    featured: false,
  },
];
