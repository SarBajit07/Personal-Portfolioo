import { H2, P } from "@/components/prose";
import type { ProjectMeta } from "@/types/project";

export const meta: ProjectMeta = {
  slug: "ishara",
  title: "Ishara",
  summary: "TODO(sarbajit) — Q15, one line under 90 characters",
  role: "TODO(sarbajit) — Q13",
  stack: ["React", "MediaPipe", "TensorFlow.js", "FastAPI", "WebSockets", "PostgreSQL"],
  problem: "TODO(sarbajit) — Q15, one sentence.",
  approach: "TODO(sarbajit) — Q17, one sentence.",
  outcome: "TODO(sarbajit) — Q19, one sentence with a real number in it.",
  featured: true,
  dates: "TODO(sarbajit) — Q12",
  status: "TODO(sarbajit) — Q20",
  links: [],
  draft: false,
  draftCopy: true,
};

export function Body() {
  return (
    <>
      <H2>The problem</H2>
      <P>TODO(sarbajit) — Q15.</P>

      <H2>My role</H2>
      <P>TODO(sarbajit) — Q13, Q14.</P>

      <H2>Constraints</H2>
      <P>TODO(sarbajit) — Q16, Q24.</P>

      <H2>Approach and the decisions</H2>
      <P>TODO(sarbajit) — Q17, Q23, Q24.</P>

      <H2>What didn&rsquo;t work</H2>
      <P>TODO(sarbajit) — Q18.</P>

      <H2>Working with signers</H2>
      <P>TODO(sarbajit) — Q26.</P>

      <H2>Outcome</H2>
      <P>TODO(sarbajit) — Q19, Q20.</P>
    </>
  );
}
