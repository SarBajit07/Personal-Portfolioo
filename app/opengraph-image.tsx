import { ImageResponse } from "next/og";
import { OgCard } from "@/components/OgCard";
import { displayFont, ogContentType, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.role}`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  const font = await displayFont();
  const serif = font ? "Fraunces" : "serif";

  return new ImageResponse(
    (
      <OgCard
        label={site.name}
        title="Sign-language translation, B2B commerce, health systems."
        meta={`${site.role} · ${site.location}`}
        serif={serif}
      />
    ),
    {
      ...size,
      ...(font
        ? { fonts: [{ name: "Fraunces", data: font, style: "normal" as const, weight: 400 as const }] }
        : {}),
    },
  );
}
