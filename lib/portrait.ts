import { existsSync } from "node:fs";
import { join } from "node:path";

/* The hero photo, by convention rather than configuration. Any of these
   extensions works; if none is present the hero renders a monogram instead of
   a broken frame. */
const PORTRAIT_CANDIDATES = [
  "/sarbajit.jpg",
  "/sarbajit.jpeg",
  "/sarbajit.png",
] as const;

/**
 * Shared by the hero and the Person structured data, so a search engine is
 * never told about a photo the page does not actually show.
 */
export function findPortrait(): string | null {
  // Checked per render rather than once at module load, so dropping the file
  // in during `next dev` shows up on the next refresh without a restart.
  return (
    PORTRAIT_CANDIDATES.find((src) =>
      existsSync(join(process.cwd(), "public", src)),
    ) ?? null
  );
}
