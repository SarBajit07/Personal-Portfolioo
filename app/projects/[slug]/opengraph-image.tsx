import { ImageResponse } from "next/og";
import { OgCard } from "@/components/OgCard";
import { displayFont, ogContentType, ogSize } from "@/lib/og";
import { findProject, projectSlugs } from "@/lib/projects";

export const alt = "Case study";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams(): { slug: string }[] {
  return projectSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = findProject(slug);
  const font = await displayFont();
  const serif = font ? "Fraunces" : "serif";

  return new ImageResponse(
    (
      <OgCard
        label="Case study"
        title={project?.meta.title ?? "Project"}
        meta={project?.meta.stack.slice(0, 3).join(" · ") ?? ""}
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
