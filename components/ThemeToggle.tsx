"use client";

import { useEffect, useState } from "react";

/** Specimen-only control for checking both themes side by side (Phase 10). */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="flex gap-4">
      {(["system", "light", "dark"] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setTheme(t)}
          className={`label ${t === theme ? "text-accent underline underline-offset-4" : ""}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
