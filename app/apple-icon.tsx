import { ImageResponse } from "next/og";
import { portraitIcon } from "@/lib/icon";
import { ogColours } from "@/lib/og";
import { site } from "@/lib/site";

/** The home-screen icon. Square and unrounded — iOS masks it itself. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    portraitIcon(size.width) ?? (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: ogColours.accent,
          color: ogColours.paper,
          fontSize: 116,
          fontWeight: 700,
        }}
      >
        {site.name.charAt(0)}
      </div>
    ),
    size,
  );
}
