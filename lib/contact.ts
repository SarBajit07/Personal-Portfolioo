import { z } from "zod";

/**
 * One schema, used on both sides. The client uses it to show inline errors
 * before a request is made; the route handler re-runs it on the parsed body,
 * because client validation is a courtesy and not a control (TRD §6).
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Your name, so I know who wrote.").max(120),
  email: z
    .string()
    .trim()
    .min(1, "An email address, or there is no way to reply.")
    .email("That does not look like an email address."),
  message: z
    .string()
    .trim()
    .min(10, "A little more than that — ten characters at minimum.")
    .max(5000, "Under 5000 characters, please."),
  /** Honeypot. Real people never see this field, so it must arrive empty. */
  company: z.string().max(0).optional().default(""),
  /** Milliseconds since epoch when the form was first rendered. */
  startedAt: z.number().int().nonnegative().optional(),
  /** Cloudflare Turnstile token, when a site key is configured. */
  token: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Anything larger than this is rejected before it is parsed. */
export const MAX_PAYLOAD_BYTES = 16 * 1024;

/** A form filled in faster than this was not filled in by a person. */
export const MIN_FILL_MS = 3000;

export type ContactErrorCode =
  | "validation"
  | "too_large"
  | "rate_limited"
  | "rejected"
  | "unconfigured"
  | "upstream";

export interface ContactResponse {
  ok: boolean;
  code?: ContactErrorCode;
  message?: string;
  /** Field-level messages, keyed by field name. */
  fields?: Partial<Record<"name" | "email" | "message", string>>;
}

/** The copy for each failure. Each one says what actually happened (TRD §6). */
export const errorCopy: Record<ContactErrorCode, string> = {
  validation: "Some fields need fixing before this can send.",
  too_large: "That message is too large to accept. Trim it and try again.",
  rate_limited:
    "That is several messages in a short space of time. Wait a minute and try again, or email me directly.",
  rejected:
    "That submission looked automated and was not sent. If you are not a bot, email me directly and I will sort it out.",
  unconfigured:
    "The form is not connected to its mail service yet. Email me directly in the meantime.",
  upstream:
    "The mail service rejected the message — that is my end, not yours. Email me directly and I will chase it.",
};
