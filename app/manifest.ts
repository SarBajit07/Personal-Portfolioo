import type { MetadataRoute } from "next";
import { ogColours } from "@/lib/og";
import { site } from "@/lib/site";

/**
 * Not a PWA — there is no service worker and nothing to install. The manifest
 * is here so the browser has a name and a theme colour to use when the site is
 * pinned or added to a home screen, instead of the URL.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.role}`,
    short_name: site.name.split(" ")[0] ?? site.name,
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: ogColours.paper,
    theme_color: ogColours.paper,
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
