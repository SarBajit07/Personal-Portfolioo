/**
 * Inventory of what the interview has not yet answered.
 *
 * Two things count as unanswered. A literal marker in the source is one. A
 * `draftCopy: true` flag is the other — prose lives in .tsx now, so a body that
 * is still a skeleton cannot always be spotted by a string match, and the flag
 * says so explicitly. It starts true, so publishing half-written prose has to
 * be a deliberate act rather than a thing you forget.
 *
 * Either one makes its page render a draft notice and be served noindex, so
 * nothing half-written can be indexed by accident — but both have to be cleared
 * before launch, and this is what proves it.
 *
 * Run: npm run check:content            reports, exits 0
 *      npm run check:launch             fails if anything survives (Phase 11.2)
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const DIRS = ["content", "app", "components", "lib"];
const EXTS = [".ts", ".tsx", ".md", ".mdx"];
const MARKER = "TODO" + "(sarbajit)";
const DRAFT_FLAG = /\bdraftCopy\s*[:=]\s*true\b/;
const strict = process.argv.includes("--strict");

function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (EXTS.includes(extname(full))) out.push(full);
  }
  return out;
}

const byFile = new Map();
const draftBodies = [];
let total = 0;

for (const file of DIRS.flatMap(walk)) {
  if (file.includes("check-content")) continue;
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  const hits = [];
  lines.forEach((line, i) => {
    if (line.includes("todo-audit-ok")) return;
    if (line.includes(MARKER)) hits.push(i + 1);
    if (DRAFT_FLAG.test(line)) draftBodies.push(`${file}:${i + 1}`);
  });
  if (hits.length > 0) {
    byFile.set(file, hits);
    total += hits.length;
  }
}

if (total === 0 && draftBodies.length === 0) {
  console.log("Content audit clean — no unanswered interview markers.");
  process.exit(0);
}

const label = strict ? "Content audit failed" : "Content audit";
console.log(`\n${label} — ${total} unanswered marker(s):\n`);
for (const [file, lines] of [...byFile].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${String(lines.length).padStart(3)}  ${file}  (lines ${lines.join(", ")})`);
}

if (draftBodies.length > 0) {
  console.log(`\n${draftBodies.length} body still flagged as a skeleton:\n`);
  for (const where of draftBodies) console.log(`       ${where}`);
  console.log("\n  Clear the flag once the prose is written, not before.");
}

console.log("\nAnswer content/QUESTIONS.md, then replace them.");

if (strict) {
  console.log("Pages carrying a marker are served noindex until it is cleared.\n");
  process.exit(1);
}
console.log("");
