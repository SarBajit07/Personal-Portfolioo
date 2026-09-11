"use client";

import { useEffect, useRef } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type Common = {
  id: string;
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  /** Right-aligned note under the field. Used for the character count. */
  count?: string | undefined;
};

const shell =
  "mt-2 w-full rounded-md border bg-paper-2 px-3.5 py-2.5 text-body text-ink outline-none transition-colors placeholder:text-ink-3";

/**
 * The border carries the failure as well as the message does, so the field
 * itself is marked and not only the line under it. The focus ring stays the
 * accent in both states — it reports focus, not validity.
 */
function shellFor(error?: string) {
  return error
    ? `${shell} border-danger-line hover:border-danger focus:border-danger`
    : `${shell} border-rule hover:border-rule-strong focus:border-accent`;
}

/**
 * Hint and error are both pointed at by aria-describedby, so neither is text
 * that only sighted people get. They never show at once: once something is
 * wrong, the correction matters more than the advice.
 */
function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

function Frame({
  id,
  label,
  error,
  hint,
  count,
  children,
}: Common & { children: React.ReactNode }) {
  const note = error ? (
    /* Errors sit inline under the field they belong to — never a toast. No
       role="alert" here: the form announces the failure once and then moves
       focus, which reads this out as the field's description. Four alerts
       firing at once would be four things talking over each other. */
    <p id={`${id}-error`} className="text-note text-danger">
      {error}
    </p>
  ) : hint ? (
    <p id={`${id}-hint`} className="text-note text-ink-3">
      {hint}
    </p>
  ) : null;

  return (
    <div className="mb-6">
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {note || count ? (
        <div className="mt-2 flex items-start justify-between gap-4">
          <div className="min-w-0">{note}</div>
          {count ? (
            <p aria-hidden className="shrink-0 text-note tabular-nums text-ink-3">
              {count}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function Field({
  id,
  label,
  error,
  hint,
  count,
  ...props
}: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Frame id={id} label={label} error={error} hint={hint} count={count}>
      <input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={shellFor(error)}
        {...props}
      />
    </Frame>
  );
}

/**
 * Grow the message box to fit what has been typed into it.
 *
 * The height is cleared before measuring, because scrollHeight never reports
 * less than the height already set — without that the field would grow and
 * never come back down as text is deleted. Adding offsetHeight minus
 * clientHeight puts the borders back, which scrollHeight leaves out under the
 * border-box sizing everything here uses.
 *
 * The floor and the ceiling are not set here: rows gives the empty field its
 * six lines, and the max-height in the class list stops a long message from
 * pushing the Send button off the screen. Past that the textarea scrolls,
 * which it does on its own.
 */
function fit(el: HTMLTextAreaElement) {
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight + el.offsetHeight - el.clientHeight}px`;
}

export function TextField({
  id,
  label,
  error,
  hint,
  count,
  onChange,
  ...props
}: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // A field that is already filled on first paint — a browser restoring the
  // form on reload — would otherwise sit at six rows with its own scrollbar
  // until the first keystroke.
  useEffect(() => {
    if (ref.current) fit(ref.current);
  }, []);

  return (
    <Frame id={id} label={label} error={error} hint={hint} count={count}>
      {/* No drag handle: it was the one piece of chrome in a form whose other
          three fields have none, and the grip sat on the corner whether or not
          anyone wanted it. The box follows the message instead, which is what
          the handle was being used to do by hand. */}
      <textarea
        ref={ref}
        id={id}
        name={id}
        rows={6}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={`${shellFor(error)} max-h-96 resize-none`}
        onChange={(event) => {
          fit(event.currentTarget);
          onChange?.(event);
        }}
        {...props}
      />
    </Frame>
  );
}
