/**
 * WCAG contrast for every text/ground pair in the token set, both themes.
 * Part of the Phase 10.2 accessibility pass, done mechanically so a token tweak
 * cannot quietly drop a pair below threshold.
 *
 * Run: npm run check:contrast
 */

import { readFileSync } from "node:fs";

const css = readFileSync("app/globals.css", "utf8");

function tokens(block) {
  const out = {};
  for (const [, name, value] of block.matchAll(/--(paper|paper-2|ink|ink-2|ink-3|rule|accent|danger):\s*(#[0-9a-f]{6})/gi)) {
    out[name] = value;
  }
  return out;
}

// Dark is the default palette and lives on bare :root; light is the opt-out
// block the header toggle switches to. Both must clear the same thresholds.
const dark = tokens(css.slice(css.indexOf(":root {"), css.indexOf(':root[data-theme="light"]')));
const light = tokens(css.slice(css.indexOf(':root[data-theme="light"]'), css.indexOf("@theme inline")));

function luminance(hex) {
  const channels = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** [foreground, background, minimum, what it is used for] */
const PAIRS = [
  ["ink", "paper", 7, "body ground"],
  ["ink-2", "paper", 4.5, "prose"],
  ["ink-3", "paper", 3, "labels and captions (>=14px, non-essential)"],
  ["accent", "paper", 4.5, "links and focus ring"],
  ["danger", "paper", 4.5, "validation errors"],
  ["ink", "paper-2", 7, "hovered index row"],
  ["ink-2", "paper-2", 4.5, "prose on the second ground"],
  ["accent", "paper-2", 4.5, "links on the second ground"],
  ["danger", "paper-2", 4.5, "validation errors on a filled field"],
];

let failed = 0;

for (const [label, theme] of [["dark", dark], ["light", light]]) {
  console.log(`\n${label}`);
  for (const [fg, bg, min, use] of PAIRS) {
    const r = ratio(theme[fg], theme[bg]);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(
      `  ${ok ? "ok  " : "FAIL"} ${r.toFixed(2).padStart(5)}:1  (min ${min})  ${fg} on ${bg} — ${use}`,
    );
  }
}

console.log("");
if (failed > 0) {
  console.error(`${failed} pair(s) below threshold.\n`);
  process.exit(1);
}
console.log("Contrast clean.\n");
