"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { Field, TextField } from "@/components/Field";
import { contactSchema, errorCopy, type ContactResponse } from "@/lib/contact";

type FieldName = "name" | "email" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;
type State = "idle" | "sending" | "sent" | "failed";

const siteKey = process.env["NEXT_PUBLIC_TURNSTILE_SITE_KEY"];

/** Source order, which is also the order corrections are asked for in. */
const FIELDS: readonly FieldName[] = ["name", "email", "message"];

const NAME_MAX = 120;
const MESSAGE_MAX = 5000;
/** The counter stays out of the way until the cap is actually in reach. */
const COUNTER_FROM = 4500;

type Issue = { readonly path: readonly PropertyKey[]; readonly message: string };

/**
 * Only the three real fields get a visible message. A honeypot or timing
 * failure is deliberately not explained to whatever tripped it.
 */
function toFieldErrors(issues: readonly Issue[]): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (key === "name" || key === "email" || key === "message") {
      out[key] ??= issue.message;
    }
  }
  return out;
}

/**
 * One field, checked against its own branch of the same schema. Going through
 * the field schema rather than re-parsing the whole form keeps this out of the
 * form element entirely, so no ref is read while rendering.
 */
function checkOne(field: FieldName, value: string): string | undefined {
  const parsed = contactSchema.shape[field].safeParse(value);
  return parsed.success ? undefined : parsed.error.issues[0]?.message;
}

function focusField(form: HTMLFormElement, field: FieldName) {
  const el = form.elements.namedItem(field);
  if (el instanceof HTMLElement) el.focus();
}

/**
 * Phase 8.2. Validation runs against the same schema the route handler uses,
 * so the messages a person sees are the messages the server would have sent.
 * Errors render inline under their field; the form-level failure renders above
 * the submit. Nothing here is a toast, and nothing disappears on a timer.
 */
export function ContactForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<State>("idle");
  const [failure, setFailure] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [length, setLength] = useState(0);

  const sentRef = useRef<HTMLParagraphElement>(null);
  const startedAt = useRef(0);

  // Set after mount, not during render: the clock is impure, and the value is
  // only ever read on submit.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // The confirmation replaces the form, so focus has to be sent to it or it
  // falls back to the top of the document with nothing announced.
  useEffect(() => {
    if (state === "sent") sentRef.current?.focus();
  }, [state]);

  function read(form: HTMLFormElement) {
    const data = new FormData(form);
    return {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      company: String(data.get("company") ?? ""),
      startedAt: startedAt.current || undefined,
      token: String(data.get("cf-turnstile-response") ?? ""),
    };
  }

  /**
   * Re-check a single field. Nothing runs before the first submit — a form
   * that argues while you are still typing your name is worse than one that
   * waits to be asked. After that, a corrected field clears itself, rather
   * than making someone submit again to find out whether the fix worked.
   */
  function recheck(field: FieldName, value: string) {
    if (!attempted) return;
    const found = checkOne(field, value);

    setErrors((prev) => {
      if (prev[field] === found) return prev;
      const next = { ...prev };
      if (found) next[field] = found;
      else delete next[field];
      return next;
    });
  }

  function fieldProps<T extends HTMLInputElement | HTMLTextAreaElement>(
    field: FieldName,
  ) {
    return {
      error: errors[field],
      onBlur: (event: React.FocusEvent<T>) =>
        recheck(field, event.currentTarget.value),
      onChange: (event: React.ChangeEvent<T>) => {
        if (errors[field]) recheck(field, event.currentTarget.value);
      },
    };
  }

  /** Mark the failure, then put the cursor where the work is. */
  function report(next: FieldErrors, message: string, form: HTMLFormElement) {
    setErrors(next);
    setFailure(message);
    setState("failed");
    const first = FIELDS.find((f) => next[f]);
    if (first) focusField(form, first);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setAttempted(true);

    const parsed = contactSchema.safeParse(read(form));
    if (!parsed.success) {
      const next = toFieldErrors(parsed.error.issues);
      report(
        next,
        Object.keys(next).length > 0 ? errorCopy.validation : errorCopy.rejected,
        form,
      );
      return;
    }

    setErrors({});
    setFailure(null);
    setState("sending");

    try {
      // Trailing slash to match next.config.ts. Without it every submission
      // spends a 308 redirect before the POST actually lands.
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = (await res.json()) as ContactResponse;

      if (body.ok) {
        setState("sent");
        form.reset();
        return;
      }

      report(body.fields ?? {}, body.message ?? errorCopy.upstream, form);
    } catch {
      report(
        {},
        "The request never reached the server. Check your connection, or email me directly.",
        form,
      );
    }
  }

  if (state === "sent") {
    return (
      <div>
        <p ref={sentRef} tabIndex={-1} className="text-lead text-ink">
          Sent. I read everything that arrives here and reply to most of it,
          usually within a couple of days.
        </p>
        <button
          type="button"
          className="btn btn-ghost mt-6"
          onClick={() => {
            setState("idle");
            setAttempted(false);
            setErrors({});
            setFailure(null);
            setLength(0);
            startedAt.current = Date.now();
          }}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <>
      {siteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
        />
      ) : null}

      <form
        onSubmit={onSubmit}
        noValidate
        aria-busy={state === "sending"}
      >
        <Field
          id="name"
          label="Name"
          autoComplete="name"
          maxLength={NAME_MAX}
          {...fieldProps<HTMLInputElement>("name")}
        />
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          {...fieldProps<HTMLInputElement>("email")}
        />
        <TextField
          id="message"
          label="Message"
          hint="What you are working on, and what you want from me."
          maxLength={MESSAGE_MAX}
          count={
            length >= COUNTER_FROM
              ? `${(MESSAGE_MAX - length).toLocaleString()} left`
              : undefined
          }
          {...fieldProps<HTMLTextAreaElement>("message")}
          onChange={(event) => {
            setLength(event.currentTarget.value.length);
            if (errors.message) recheck("message", event.currentTarget.value);
          }}
        />

        {/* Honeypot. Hidden from people and from screen readers; bots fill it. */}
        <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {siteKey ? (
          <div className="mb-8 cf-turnstile" data-sitekey={siteKey} data-theme="auto" />
        ) : null}

        {failure ? (
          <p role="alert" className="mb-6 max-w-[52ch] rounded-md border border-danger-line bg-danger-soft px-4 py-3 text-note text-danger">
            {failure}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <button
            type="submit"
            disabled={state === "sending"}
            className="btn btn-primary"
          >
            {state === "sending" ? "Sending…" : "Send"}
          </button>
          <p className="text-note text-ink-3">
            Usually answered within a couple of days.
          </p>
        </div>
      </form>
    </>
  );
}
