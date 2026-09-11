"use client";

/**
 * Dark is the site's default and lives on :root; this writes
 * data-theme="light" to opt out, and remembers the choice.
 *
 * Deliberately stateless. Reading the current theme into React state would
 * mean the server renders one icon and the client swaps it, which is both a
 * hydration mismatch and a visible flicker. Instead both icons are rendered
 * and globals.css shows the one matching the theme you would switch *to*, so
 * the button is correct before any JavaScript runs.
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset["theme"] === "light" ? "dark" : "light";

    if (next === "dark") delete root.dataset["theme"];
    else root.dataset["theme"] = next;

    // Private browsing and blocked storage both throw here; the toggle still
    // works for this page, it just will not be remembered.
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      /* not remembered */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle"
      aria-label="Switch between the dark and light theme"
    >
      <svg
        className="icon-sun"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.4v2.2M12 19.4v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.4 12h2.2M19.4 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
      </svg>

      <svg
        className="icon-moon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1Z" />
      </svg>
    </button>
  );
}
