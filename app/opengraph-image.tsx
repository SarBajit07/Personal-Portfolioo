import { ImageResponse } from "next/og";
import { OgCard } from "@/components/OgCard";
import { displayFont, ogContentType, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name} · ${site.role}`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  const font = await displayFont();
  const display = font ? "Poppins" : "sans-serif";

  return new ImageResponse(
    (
      <OgCard
        label={site.name}
        title="E-commerce, live news, health systems."
        meta={`${site.role} · ${site.location}`}
        serif={display}
      />
    ),
    {
      ...size,
      ...(font
        ? { fonts: [{ name: "Poppins", data: font, style: "normal" as const, weight: 600 as const }] }
        : {}),
    },
  );
}
