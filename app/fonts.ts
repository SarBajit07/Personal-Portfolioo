import { Poppins } from "next/font/google";

/**
 * The whole site is set in Poppins — display, body and metadata alike.
 * Poppins is a static family, so every weight the CSS asks for has to be
 * declared here; 400/500/600/700 covers body, UI, and headings.
 *
 * One loader feeds all three CSS variables (see globals.css) so the existing
 * `font-display` / `font-body` / `font-mono` utilities keep resolving.
 */
export const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const fontVariables = poppins.variable;
