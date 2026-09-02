import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";

/**
 * Phase 0.1 names Switzer (body) and Commit Mono (metadata), both of which are
 * paid/manual downloads. Instrument Sans and JetBrains Mono are the documented
 * fallbacks and ship first so the system is testable. Swapping in the licensed
 * faces later is a change to this file only: replace the loader with
 * next/font/local and keep the CSS variable names identical.
 *
 * Inter, Poppins and Montserrat are excluded on purpose (Phase 0.5, never #12). tell-audit-ok
 */

export const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

export const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
  display: "swap",
  preload: false,
});

export const fontVariables = `${display.variable} ${body.variable} ${mono.variable}`;
