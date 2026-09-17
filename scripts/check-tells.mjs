/**
 * The Phase 0.5 contract, made mechanical.
 *
 * Tailwind's default palette, shadows, radii and type scale are deleted in
 * globals.css, so most tells cannot resolve. Three can still slip through —
 * gradients, backdrop-filter and arbitrary hex values — and copy tells resolve
 * anywhere. This fails the build on all of them.
 *
 * Run: npm run check:tells
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const CODE_DIRS = ["app", "components", "lib"];
const COPY_DIRS = ["app", "components", "content"];

/** Patterns matched inside className values only. */
const CLASS_TELLS = [
  [/\bshadow-(?!none\b)/, "box-shadow is banned (Phase 0.3)"],
  [/\b(bg-gradient|bg-linear|bg-radial|bg-conic)\b/, "gradients (never #1)"],
  [/\b(from|via|to)-\[/, "gradient stop with an arbitrary colour (never #1)"],
  [/\b(indigo|violet|cyan|purple|fuchsia)-\d/, "AI-default palette (never #3)"],
  [/#(6366f1|8b5cf6|0ea5e9|a855f7)/i, "AI-default palette (never #3)"],
  [/\banimate-(pulse|bounce|ping|spin)\b/, "outside the motion budget (Phase 0.4)"],
];

/** Patterns matched anywhere in copy and JSX text. */
const COPY_TELLS = [
  [/passionate about/i, "banned phrase (never #11)"],
  [/crafting digital experiences/i, "banned phrase (never #11)"],
  [/turning ideas into reality/i, "banned phrase (never #11)"],
  [/let'?s build something amazing/i, "banned phrase (never #11)"],
  [/bringing ideas to life/i, "banned phrase (never #11)"],
  [/\u2728/, "sparkle emoji (never #15)"],
  [/\b(Inter|Montserrat)\b(?!\s*(is|are)?\s*excluded)/, "banned typeface (never #12)"],
  [/—/, "em dash in copy: recast it, or use a full stop"],
];

/**
 * Blank out comments, keeping every line in place so reported line numbers
 * still match the file. The em-dash rule is the reason this exists: comments
 * in this codebase use em dashes freely and are not copy, so matching a copy
 * tell against them would be noise. Quotes are tracked because the "//" in a
 * URL is not a comment; erring towards stripping can only hide a tell, never
 * invent one.
 */
function stripComments(source) {
  let out = "";
  let quote = null;
  let block = false;
  for (let i = 0; i < source.length; i += 1) {
    const c = source[i];
    const next = source[i + 1];
    if (block) {
      if (c === "*" && next === "/") {
        block = false;
        out += "  ";
        i += 1;
      } else {
        out += c === "\n" ? c : " ";
      }
      continue;
    }
    if (quote) {
      out += c;
      if (c === "\\") {
        out += next ?? "";
        i += 1;
      } else if (c === quote) {
        quote = null;
      }
      continue;
    }
    if (c === "/" && next === "*") {
      block = true;
      out += "  ";
      i += 1;
      continue;
    }
    if (c === "/" && next === "/") {
      while (i < source.length && source[i] !== "\n") i += 1;
      out += "\n";
      continue;
    }
    if (c === '"' || c === "'" || c === "`") quote = c;
    out += c;
  }
  return out;
}

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
    else out.push(full);
  }
  return out;
}

function classNameValues(source) {
  const values = [];
  const re = /className\s*=\s*(?:"([^"]*)"|'([^']*)'|\{`([\s\S]*?)`\}|\{"([^"]*)"\})/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    values.push(m[1] ?? m[2] ?? m[3] ?? m[4] ?? "");
  }
  return values;
}

function lineOf(source, needle) {
  const idx = source.indexOf(needle);
  if (idx < 0) return 1;
  return source.slice(0, idx).split("\n").length;
}

const failures = [];

for (const file of CODE_DIRS.flatMap(walk)) {
  if (![".tsx", ".ts", ".jsx", ".js"].includes(extname(file))) continue;
  const source = readFileSync(file, "utf8");
  for (const value of classNameValues(source)) {
    for (const [pattern, why] of CLASS_TELLS) {
      const hit = value.match(pattern);
      if (hit) failures.push(`${file}:${lineOf(source, value)}  ${hit[0]} — ${why}`);
    }
  }
}

for (const file of COPY_DIRS.flatMap(walk)) {
  if (![".tsx", ".ts", ".md", ".mdx"].includes(extname(file))) continue;
  if (file.includes("check-tells")) continue;
  const ext = extname(file);
  const raw = readFileSync(file, "utf8");
  const lines = (ext === ".md" || ext === ".mdx" ? raw : stripComments(raw)).split(
    /\r?\n/,
  );
  lines.forEach((line, i) => {
    // A line that names a tell in order to ban it is not a tell.
    if (line.includes("tell-audit-ok")) return;
    for (const [pattern, why] of COPY_TELLS) {
      const hit = line.match(pattern);
      if (hit) failures.push(`${file}:${i + 1}  ${hit[0]} — ${why}`);
    }
  });
}

if (failures.length > 0) {
  console.error(`\nTell audit failed — ${failures.length} finding(s):\n`);
  for (const failure of failures) console.error("  " + failure);
  console.error("\nEach one is a default this design does not use.\n");
  process.exit(1);
}

console.log("Tell audit clean.");
