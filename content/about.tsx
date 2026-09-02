import { H2, P, Table } from "@/components/prose";

/**
 * Target 350–500 words, first person. Guidance for each section is in
 * content/QUESTIONS.md — this file holds the prose that ships and nothing else.
 */

/** While true the page renders a draft notice and is served noindex. */
export const draftCopy = true;

export function About() {
  return (
    <>
      <P>TODO(sarbajit) — Q6, Q9. What you do now, in the present tense.</P>

      <H2>How I got here</H2>
      <P>TODO(sarbajit) — Q7.</P>

      <H2>How I work</H2>
      <P>TODO(sarbajit) — Q9, Q11.</P>

      <H2>Stack</H2>
      <Table>
        <tbody>
          <tr>
            <th scope="row">Day to day</th>
            <td>TODO(sarbajit) — Q9.</td>
          </tr>
          <tr>
            <th scope="row">Also worked in</th>
            <td>TODO(sarbajit) — real, but less current.</td>
          </tr>
          <tr>
            <th scope="row">Learning now</th>
            <td>TODO(sarbajit) — optional.</td>
          </tr>
        </tbody>
      </Table>

      <H2>Outside the work</H2>
      <P>TODO(sarbajit) — Q11. One paragraph, or cut the section.</P>
    </>
  );
}
