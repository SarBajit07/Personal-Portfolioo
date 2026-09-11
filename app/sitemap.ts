import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Two routes. Projects and About are anchor sections on the home page, not
 * pages, so they are not listed here — a fragment is not a separate URL.
 *
 * trailingSlash is on, so every URL here ends in one.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return ["/", "/contact/"].map((path) => ({
    url: new URL(path, site.url).toString(),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));
}
