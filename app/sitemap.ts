import type { MetadataRoute } from "next";
import { allProjects } from "@/lib/projects";
import { site } from "@/lib/site";

/** trailingSlash is on, so every URL here ends in one. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = ["/", "/projects/", "/about/", "/contact/"].map((path) => ({
    url: new URL(path, site.url).toString(),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  const projects = allProjects().map((project) => ({
    url: new URL(`/projects/${project.meta.slug}/`, site.url).toString(),
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...pages, ...projects];
}
