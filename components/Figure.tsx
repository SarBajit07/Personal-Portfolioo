import Image from "next/image";
import type { ReactNode } from "react";

/**
 * The only way an image enters a case study. Markdown's `![]()` is deliberately
 * not wired up: every figure has to declare its true dimensions and carry a
 * caption that says something the alt text does not.
 *
 * `bleed` breaks the figure out of the prose column into the full grid width —
 * used sparingly, and one of the few asymmetries on the page.
 */
export function Figure({
  src,
  alt,
  width,
  height,
  caption,
  bleed = false,
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: ReactNode;
  bleed?: boolean;
  priority?: boolean;
}) {
  return (
    <figure className={bleed ? "my-14 lg:col-span-full" : "my-12"}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={bleed ? "100vw" : "(min-width: 64rem) 56rem, 100vw"}
        className="block h-auto w-full border border-rule"
      />
      <figcaption className="mt-3 max-w-[52ch] text-note text-ink-3">
        {caption}
      </figcaption>
    </figure>
  );
}

/**
 * A screen capture that loops. Muted and playsinline so mobile Safari plays it
 * without going fullscreen; under prefers-reduced-motion the browser is given
 * the poster and the controls instead of an autoplaying loop.
 */
export function Demo({
  src,
  poster,
  width,
  height,
  caption,
}: {
  src: string;
  poster: string;
  width: number;
  height: number;
  caption: ReactNode;
}) {
  return (
    <figure className="my-14">
      <video
        className="block h-auto w-full border border-rule"
        width={width}
        height={height}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        controls
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
      </video>
      <figcaption className="mt-3 max-w-[52ch] text-note text-ink-3">
        {caption}
      </figcaption>
    </figure>
  );
}
