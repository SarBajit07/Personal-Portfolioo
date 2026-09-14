import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Two routes. Projects and About are anchor sections on the home page, not
 * pages, so they are not listed here — a fragment is not a separate URL.
 *
 * trailingSlash is on, so every URL here ends in one.
 *
 * No `lastModified`. It used to be `new Date()`, which meant every redeploy —
 * a dependency bump, a copy tweak — told Google both pages had just changed.
 * A lastmod that is always "now" is one Google learns to ignore, and it takes
 * the rest of the sitemap's credibility with it. Two URLs do not need a crawl
 * hint anyway; omitting the field is the honest signal.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/contact/"].map((path) => ({
    url: new URL(path, site.url).toString(),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));
}
