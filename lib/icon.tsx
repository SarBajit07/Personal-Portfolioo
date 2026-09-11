import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ogColours } from "@/lib/og";
import { findPortrait } from "@/lib/portrait";

/**
 * The favicon is the hero photo, cropped to the head.
 *
 * The crop is the whole point. The source is a full-length shot on the lake at
 * Pokhara, and scaled to fit a 32px square it renders the face about four
 * pixels across — a grey smudge. So the window below is tuned to head and
 * shoulders, in source pixels, and everything else is thrown away.
 *
 * Tuned by eye against public/sarbajit.jpeg (1196 × 1600). Swapping the photo
 * for a different one means retuning these four numbers.
 */
const CROP = { x: 297, y: 505, size: 405 } as const;

/**
 * Width and height straight from the file header, so the img is scaled by its
 * true aspect ratio rather than a number written down here that a replaced
 * photo would silently make wrong.
 */
function naturalSize(buf: Buffer): { width: number; height: number } | null {
  // PNG: IHDR width/height sit at a fixed offset after the 8-byte signature.
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  // JPEG: walk the marker chain to whichever SOFn frame header comes first.
  if (buf.length > 4 && buf.readUInt16BE(0) === 0xffd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) {
        i += 1;
        continue;
      }
      const marker = buf[i + 1]!;
      // Standalone markers carry no length field to skip over.
      if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
        i += 2;
        continue;
      }
      const isFrameHeader =
        marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isFrameHeader) {
        return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }

  return null;
}

/**
 * The icon artwork at a given edge length, or null if the photo is missing or
 * unreadable — callers fall back to the monogram rather than ship a blank
 * square.
 */
export function portraitIcon(edge: number, radius = 0) {
  const path = findPortrait();
  if (!path) return null;

  let buf: Buffer;
  try {
    buf = readFileSync(join(process.cwd(), "public", path));
  } catch {
    return null;
  }

  const natural = naturalSize(buf);
  if (!natural) return null;

  // Satori has no filesystem, so the bytes travel inline.
  const mime = path.endsWith(".png") ? "image/png" : "image/jpeg";
  const src = `data:${mime};base64,${buf.toString("base64")}`;

  // Scale the whole photo up until the crop window is exactly the icon, then
  // slide it so the window's top-left corner lands on the icon's.
  const scale = edge / CROP.size;

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius: radius,
        background: ogColours.paper,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={Math.round(natural.width * scale)}
        height={Math.round(natural.height * scale)}
        style={{
          marginLeft: -Math.round(CROP.x * scale),
          marginTop: -Math.round(CROP.y * scale),
        }}
      />
    </div>
  );
}
