import Link from "next/link";
import type { ReactNode } from "react";

export { Demo, Figure } from "./Figure";
export { MarginNote as Note } from "./MarginNote";

/**
 * The vocabulary a case study is written in. Content files import from here and
 * nowhere else, so prose stays prose: no className strings and no layout
 * decisions in `content/`.
 *
 * `H2` carries the CSS counter that numbers sections in the left margin, so
 * sections must be marked with `H2` rather than a bare `<h2>`.
 */

type Kids = { children?: ReactNode };

/**
 * A plain run of paragraphs at the measure — no section numerals, no rules.
 * Used where prose is a component of a page rather than the page itself.
 */
export function Prose({ className = "", children }: Kids & { className?: string }) {
  return <div className={`prose-body ${className}`.trim()}>{children}</div>;
}

export function H2({ children }: Kids) {
  return <h2 className="case-h2">{children}</h2>;
}

export function H3({ children }: Kids) {
  return <h3 className="case-h3">{children}</h3>;
}

export function P({ children }: Kids) {
  return <p className="case-p">{children}</p>;
}

export function UL({ children }: Kids) {
  return <ul className="case-ul">{children}</ul>;
}

export function OL({ children }: Kids) {
  return <ol className="case-ol">{children}</ol>;
}

export function LI({ children }: Kids) {
  return <li>{children}</li>;
}

export function Quote({ children }: Kids) {
  return <blockquote className="case-quote">{children}</blockquote>;
}

export function Rule() {
  return <hr className="my-14 max-w-[var(--measure)]" />;
}

export function Pre({ children }: Kids) {
  return (
    <pre className="case-pre">
      <code className="case-code">{children}</code>
    </pre>
  );
}

export function Table({ children }: Kids) {
  return (
    <div className="my-10 max-w-[var(--measure)] overflow-x-auto">
      <table className="case-table">{children}</table>
    </div>
  );
}

/**
 * External links open in a new tab and carry `rel`; internal ones go through
 * next/link so navigation stays client-side. Which one you get is decided from
 * the href, not by the author remembering.
 */
export function A({ href, children }: { href: string; children: ReactNode }) {
  const className =
    "underline decoration-rule decoration-1 underline-offset-[0.18em] hover:decoration-accent hover:text-accent";

  if (/^https?:/.test(href)) {
    return (
      <a href={href} className={className} rel="noreferrer noopener" target="_blank">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
