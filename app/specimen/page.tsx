import type { Metadata } from "next";
import { Rule } from "@/components/Rule";
import { Prose } from "@/components/prose";
import { MarginNote } from "@/components/MarginNote";
import { IndexRow } from "@/components/IndexRow";
import { Field, TextField } from "@/components/Field";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Specimen",
  robots: { index: false, follow: false },
};

const SIZES = [
  ["display", "6rem / 96px", "text-display"],
  ["h1", "4rem / 64px", "text-h1"],
  ["h2", "2.5rem / 40px", "text-h2"],
  ["h3", "1.75rem / 28px", "text-h3"],
  ["lead", "1.3125rem / 21px", "text-lead"],
  ["body", "1.125rem / 18px", "text-body"],
  ["small", "1rem / 16px", "text-small"],
  ["note", "0.875rem / 14px", "text-note"],
  ["caption", "0.75rem / 12px", "text-caption"],
] as const;

const SWATCHES = [
  ["--paper", "bg-paper"],
  ["--paper-2", "bg-paper-2"],
  ["--rule", "bg-rule"],
  ["--ink-3", "bg-ink-3"],
  ["--ink-2", "bg-ink-2"],
  ["--ink", "bg-ink"],
  ["--accent", "bg-accent"],
] as const;

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-t-rule pt-8 pb-20">
      <p className="label mb-10">
        {n} — {title}
      </p>
      {children}
    </section>
  );
}

export default function Specimen() {
  return (
    <main id="main" className="page py-16">
      <header className="mb-16 flex flex-wrap items-baseline justify-between gap-6">
        <div>
          <h1 className="text-h2">Specimen</h1>
          <p className="mt-2 text-note text-ink-3">
            Private. Deleted at Phase 11. Everything on this page is the whole
            system — if something is not here, it does not exist.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <Section n="01" title="Type scale">
        <div className="space-y-8">
          {SIZES.map(([name, size, cls]) => (
            <div key={name} className="grid12 items-baseline">
              <p className="label col-span-1 lg:col-start-1">{name}</p>
              <p
                className={`col-span-3 lg:col-start-2 lg:col-span-8 ${cls} ${
                  name === "display" || name === "h1" || name === "h2" || name === "h3"
                    ? "font-display"
                    : ""
                }`}
              >
                Kathmandu, 2026
              </p>
              <p className="index-numeral col-span-4 lg:col-start-11 lg:col-span-2 lg:text-right">
                {size}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section n="02" title="Colour">
        <div className="grid grid-cols-2 gap-px sm:grid-cols-4 lg:grid-cols-7">
          {SWATCHES.map(([token, cls]) => (
            <div key={token}>
              <div className={`h-24 border border-rule ${cls}`} />
              <p className="index-numeral mt-2">{token}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-note text-ink-3">
          One accent, three appearances per viewport at most. There is no second
          accent, no gradient, and no shadow utility in the build.
        </p>
      </Section>

      <Section n="03" title="Prose at measure, with a margin note">
        <div className="grid12">
          <Prose className="col-prose">
            <p>
              A paragraph set at 18px on a 1.6 rhythm, capped at 66 characters.
              The measure is the reason the page reads as typeset rather than
              generated: a full-width column of body copy is the fastest way to
              make a site look like a template with the sidebar removed.
            </p>
            <p>
              Body copy sits in columns 2 through 8 of twelve. The remaining four
              carry dates, stack labels, footnotes and notes like the one to the
              right. Nothing here is centred.<sup className="font-mono text-caption text-accent">1</sup>
            </p>
          </Prose>
          <div className="col-gutter">
            <MarginNote label="Note">
              Margin notes align to the paragraph they annotate. On narrow
              screens they collapse inline beneath it, rule-marked rather than
              boxed.
            </MarginNote>
          </div>
        </div>

        <div className="grid12 mt-10">
          <div className="col-prose">
            <Rule />
            <p className="mt-4 text-note text-ink-3">
              <sup className="font-mono text-caption text-accent">1</sup>{" "}
              Footnotes are real: numbered in the text, resolved at the foot of
              the section, and linkable. Phase 6 wires the return links.
            </p>
          </div>
        </div>
      </Section>

      <Section n="04" title="Index rows">
        <div>
          <IndexRow
            index={1}
            href="/specimen/"
            title="Ishara"
            summary="Real-time Nepali Sign Language translation in the browser."
            stack={["React", "MediaPipe", "FastAPI"]}
            year="2025"
          />
          <IndexRow
            index={2}
            href="/specimen/"
            title="Nona Mart"
            summary="B2B export platform: catalogue, orders, cross-border payment."
            stack={["NestJS", "Next.js", "PostgreSQL"]}
            year="2025"
          />
          <div className="border-t border-t-rule" />
        </div>
        <p className="mt-8 text-note text-ink-3">
          This replaces the card grid. The whole row is the hit target; the only
          separator is a hairline.
        </p>
      </Section>

      <Section n="05" title="Form fields and focus">
        <div className="grid12">
          <form className="col-prose" action="#">
            <Field id="name" label="Name" placeholder="" autoComplete="name" />
            <Field
              id="email"
              label="Email"
              type="email"
              hint="Used once, to reply."
              autoComplete="email"
            />
            <TextField
              id="message"
              label="Message"
              error="Say a little more — under 20 characters rarely gets a useful reply."
            />
            <button
              type="button"
              className="border border-rule px-6 py-3 text-small hover:border-accent hover:text-accent"
            >
              Send
            </button>
          </form>
          <div className="col-gutter">
            <MarginNote label="Focus">
              Tab through this form. Every interactive element takes a 2px
              accent outline at 2px offset — no element loses its focus ring.
            </MarginNote>
          </div>
        </div>
      </Section>

      <Section n="06" title="Rules and rhythm">
        <Rule />
        <p className="mt-4 text-note text-ink-3">
          1px solid var(--rule). This and whitespace do all separation work on
          the site.
        </p>
      </Section>
    </main>
  );
}
