import path from "node:path";
import type { NextConfig } from "next";

/**
 * Security headers. Phase 9.5 — on Cloudflare these lived in a `_headers` file;
 * on Vercel they are typed and versioned here instead.
 *
 * `script-src` allows inline because Next emits inline bootstrap scripts and a
 * nonce would require middleware on every request. Turnstile is allowed
 * explicitly for the contact form (Phase 8) and nothing else is.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src https://challenges.cloudflare.com",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  // Pin the workspace root so a stray lockfile elsewhere on the machine is
  // never inferred as the project root.
  turbopack: { root: path.resolve(import.meta.dirname) },

  // Deployed to Vercel, which runs Next natively. There is no `output: "export"`:
  // dropping it keeps the next/image optimiser and lets the one dynamic endpoint
  // (app/api/contact) be a Route Handler in this project rather than a separate
  // serverless function outside the build. Every page is still statically
  // prerendered — see the build output.
  trailingSlash: true,

  // Next 16 runs lint separately; CI gates it (npm run lint).
  typescript: { ignoreBuildErrors: false },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
