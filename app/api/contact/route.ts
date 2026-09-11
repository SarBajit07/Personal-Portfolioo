import { NextResponse } from "next/server";
import {
  contactSchema,
  errorCopy,
  MAX_PAYLOAD_BYTES,
  MIN_FILL_MS,
  type ContactErrorCode,
  type ContactResponse,
} from "@/lib/contact";

/**
 * The site's only dynamic endpoint. On Cloudflare this was a Pages
 * Function outside the build; on Vercel it is a Route Handler, which means it
 * shares the schema in lib/contact.ts with the form rather than duplicating it.
 *
 * RESEND_API_KEY is read from the server environment and never reaches the
 * client bundle. Nothing in this file is imported by a client component.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Best-effort per-IP throttle. Serverless instances are not shared, so this
 * catches the naive case and nothing more — Turnstile is the actual control.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function fail(code: ContactErrorCode, status: number, extra?: ContactResponse) {
  return NextResponse.json<ContactResponse>(
    { ok: false, code, message: errorCopy[code], ...extra },
    { status },
  );
}

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env["TURNSTILE_SECRET_KEY"];
  if (!secret) return true; // Not configured; the honeypot and timing check stand alone.
  if (!token) return false;

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token, remoteip: ip }),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

export async function POST(request: Request): Promise<Response> {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  // Cap the payload before parsing it, by header and then by actual length.
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_PAYLOAD_BYTES) return fail("too_large", 413);

  const raw = await request.text();
  if (raw.length > MAX_PAYLOAD_BYTES) return fail("too_large", 413);

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return fail("validation", 400);
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    const fields: ContactResponse["fields"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "name" || key === "email" || key === "message") {
        fields[key] ??= issue.message;
      } else {
        // Honeypot or timing field failed — say nothing useful about which.
        return fail("rejected", 400);
      }
    }
    return fail("validation", 400, { ok: false, fields });
  }

  const { name, email, message, company, startedAt, token } = parsed.data;

  if (company !== "") return fail("rejected", 400);
  if (startedAt !== undefined && Date.now() - startedAt < MIN_FILL_MS) {
    return fail("rejected", 400);
  }
  if (rateLimited(ip)) return fail("rate_limited", 429);
  if (!(await verifyTurnstile(token, ip))) return fail("rejected", 400);

  const apiKey = process.env["RESEND_API_KEY"];
  const from = process.env["CONTACT_FROM"];
  const to = process.env["CONTACT_TO"];
  if (!apiKey || !from || !to) return fail("unconfigured", 503);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject: `Portfolio — ${name}`,
      text: [`From: ${name} <${email}>`, "", message].join("\n"),
    }),
  });

  if (!res.ok) {
    console.error("Resend rejected the message", res.status, await res.text());
    return fail("upstream", 502);
  }

  return NextResponse.json<ContactResponse>({ ok: true });
}
