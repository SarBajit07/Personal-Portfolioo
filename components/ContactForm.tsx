"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { Field, TextField } from "@/components/Field";
import { contactSchema, errorCopy, type ContactResponse } from "@/lib/contact";

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;
type State = "idle" | "sending" | "sent" | "failed";

const siteKey = process.env["NEXT_PUBLIC_TURNSTILE_SITE_KEY"];

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
  const startedAt = useRef(0);

  // Set after mount, not during render: the clock is impure, and the value is
  // only ever read on submit.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const candidate = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      company: String(data.get("company") ?? ""),
      startedAt: startedAt.current || undefined,
      token: String(data.get("cf-turnstile-response") ?? ""),
    };

    const parsed = contactSchema.safeParse(candidate);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "name" || key === "email" || key === "message") {
          next[key] ??= issue.message;
        }
      }
      setErrors(next);
      setFailure(Object.keys(next).length > 0 ? errorCopy.validation : errorCopy.rejected);
      setState("failed");
      return;
    }

    setErrors({});
    setFailure(null);
    setState("sending");

    try {
      const res = await fetch("/api/contact", {
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

      setErrors(body.fields ?? {});
      setFailure(body.message ?? errorCopy.upstream);
      setState("failed");
    } catch {
      setFailure(
        "The request never reached the server. Check your connection, or email me directly.",
      );
      setState("failed");
    }
  }

  if (state === "sent") {
    return (
      <p className="border-t border-t-rule pt-6 text-lead text-ink" role="status">
        Sent. I read everything that arrives here and reply to most of it,
        usually within a couple of days.
      </p>
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

      <form onSubmit={onSubmit} noValidate>
        <Field id="name" label="Name" autoComplete="name" error={errors.name} />
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email}
        />
        <TextField
          id="message"
          label="Message"
          error={errors.message}
          hint="What you are working on, and what you want from me."
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
          <p role="alert" className="mb-6 max-w-[52ch] border-t border-t-rule pt-4 text-note text-accent">
            {failure}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={state === "sending"}
          className="border-b border-b-ink pb-1 text-body text-ink hover:border-b-accent hover:text-accent disabled:text-ink-3"
        >
          {state === "sending" ? "Sending…" : "Send"}
        </button>
      </form>
    </>
  );
}
