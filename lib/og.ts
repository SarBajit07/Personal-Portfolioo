/**
 * The OG image is set in Poppins, the site's one face, rather than a stock
 * template (Phase 9.2). next/font hands back CSS, not a buffer, so the file is
 * fetched at build time — behind a try/catch, because a link preview falling
 * back to a default face is a far smaller problem than a failed build.
 */
const LEGACY_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/533.20.25 (KHTML, like Gecko) Version/5.1 Safari/533.20.27";

let cached: ArrayBuffer | null | undefined;

export async function displayFont(): Promise<ArrayBuffer | null> {
  if (cached !== undefined) return cached;

  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=swap",
      { headers: { "User-Agent": LEGACY_UA } },
    ).then((r) => r.text());

    const url = css.match(/src:\s*url\((https:[^)]+)\)\s*format\('(?:truetype|opentype)'\)/)?.[1];
    cached = url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    cached = null;
  }

  return cached ?? null;
}

export const ogSize = { width: 1200, height: 630 } as const;
export const ogContentType = "image/png";

/** Matches the tokens in globals.css. */
export const ogColours = {
  paper: "#0a0a0f",
  paper2: "#101017",
  ink: "#edeef2",
  ink2: "#a2a4b0",
  ink3: "#6f7280",
  rule: "#26262f",
  accent: "#5b9bf8",
} as const;
