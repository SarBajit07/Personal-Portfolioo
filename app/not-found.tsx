import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="page section flex flex-col items-start">
      <p className="label">404</p>
      <h1 className="mt-4">No page here.</h1>
      <p className="mt-5 max-w-[44ch] text-lead text-ink-2">
        The address is wrong, or something that used to live here doesn&rsquo;t
        any more. Everything on this site is on the home page.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Back home
        </Link>
        <Link href="/contact/" className="btn btn-ghost">
          Contact
        </Link>
      </div>
    </main>
  );
}
