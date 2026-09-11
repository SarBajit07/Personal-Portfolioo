import { ImageResponse } from "next/og";
import { portraitIcon } from "@/lib/icon";
import { ogColours } from "@/lib/og";
import { site } from "@/lib/site";

/**
 * There was no favicon at all before this, which costs more than it sounds:
 * Google renders one beside every mobile result and falls back to a generic
 * globe without it.
 *
 * It is the hero photo, cropped to the head — see lib/icon.tsx. The monogram
 * below is the fallback for a missing or unreadable file, so a deleted photo
 * degrades to a letter rather than to a blank square.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    portraitIcon(size.width, 7) ?? (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: ogColours.accent,
          color: ogColours.paper,
          fontSize: 22,
          fontWeight: 700,
          borderRadius: 7,
        }}
      >
        {site.name.charAt(0)}
      </div>
    ),
    size,
  );
}
