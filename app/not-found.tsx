import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="page grid12 pt-24 pb-32">
      <div className="col-prose">
        <p className="index-numeral">404</p>
        <h1 className="mt-5 text-h2 lg:text-h1">No page here.</h1>
        <p className="mt-6 max-w-[44ch] text-lead text-ink-2">
          The address is wrong, or something that used to live here does not any
          more. The four case studies are all on the projects page.
        </p>
        <p className="mt-8">
          <Link
            href="/projects/"
            className="text-body underline decoration-rule underline-offset-4 hover:text-accent"
          >
            Projects
          </Link>
        </p>
      </div>
    </main>
  );
}
