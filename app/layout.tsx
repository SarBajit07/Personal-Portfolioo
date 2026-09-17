import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/lib/site";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_GB",
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  /* Default is index/follow anyway; what is worth saying explicitly are the
     googleBot limits, which are *not* the defaults — without them Google caps
     snippets and shows only a thumbnail-sized preview image. */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  /* Distinguishes this Sarbajit Timalsina from any other in a result list. */
  creator: site.name,
  publisher: site.name,
  category: "technology",
  /* Search Console's HTML-tag verification, read from the environment so the
     token is set once on Vercel rather than committed. Absent locally, in which
     case Next omits the tag entirely rather than emitting an empty one.

     Verification is not a ranking factor — it is how you get told what Google
     actually did with the site, and how you request indexing rather than wait
     for it. */
  ...(process.env["NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION"]
    ? {
        verification: {
          google: process.env["NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION"],
        },
      }
    : {}),
};

/**
 * Applies a remembered light-theme choice before the first paint. Dark is the
 * default on :root, so this only ever has to *add* the opt-out attribute —
 * which means a visitor who has never touched the toggle runs no branch at all
 * and sees no flash either way.
 */
const themeScript = `try{if(localStorage.getItem("theme")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /* The theme script writes to <html> before React hydrates. */
    <html lang={site.lang} className={fontVariables} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:bg-paper focus:px-3 focus:py-2 focus:text-small"
        >
          Skip to content
        </a>
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
