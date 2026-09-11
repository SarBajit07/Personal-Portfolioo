/**
 * Inventory of the gaps left in the copy.
 *
 * A gap is a literal TODO(sarbajit) marker in the source. They are meant to be
 * visible while the site is being written and gone before it ships, and this is
 * what proves which.
 *
 * Run: npm run check:content            reports, exits 0
 *      npm run check:launch             fails if anything survives
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const DIRS = ["content", "app", "components", "lib"];
const EXTS = [".ts", ".tsx", ".md", ".mdx"];
const MARKER = "TODO" + "(sarbajit)";
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
let total = 0;

for (const file of DIRS.flatMap(walk)) {
  if (file.includes("check-content")) continue;
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  const hits = [];
  lines.forEach((line, i) => {
    if (line.includes("todo-audit-ok")) return;
    if (line.includes(MARKER)) hits.push(i + 1);
  });
  if (hits.length > 0) {
    byFile.set(file, hits);
    total += hits.length;
  }
}

if (total === 0) {
  console.log("Content audit clean — no TODO markers left.");
  process.exit(0);
}

const label = strict ? "Content audit failed" : "Content audit";
console.log(`\n${label} — ${total} open marker(s):\n`);
for (const [file, lines] of [...byFile].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${String(lines.length).padStart(3)}  ${file}  (lines ${lines.join(", ")})`);
}

console.log("\nEach one marks copy that is still owed something real.");

if (strict) {
  console.log("");
  process.exit(1);
}
console.log("");
