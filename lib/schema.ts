import { education, skills } from "@/content/profile";
import { projects } from "@/content/projects";
import { findPortrait } from "@/lib/portrait";
import { absolute, nameVariants, profiles, site } from "@/lib/site";

/**
 * JSON-LD for the site (Phase 10 — SEO).
 *
 * Everything below is derived from content/ and lib/site.ts rather than typed
 * out again, because structured data that disagrees with the visible page is
 * worse than none at all: Google treats the mismatch as a reason to distrust
 * the markup.
 *
 * Nodes are emitted in a single @graph per page and cross-referenced by @id,
 * so the Person is described once and pointed at from everywhere else.
 */

type Node = Record<string, unknown>;

export const ids = {
  person: absolute("/#person"),
  website: absolute("/#website"),
  home: absolute("/#webpage"),
  contact: absolute("/contact/#webpage"),
} as const;

const ref = (id: string) => ({ "@id": id });

/**
 * The entity the whole site is about. `worksFor` is deliberately absent — the
 * NTCS role has an end date in content/profile.ts, and schema.org has no way to
 * say "used to work for" without asserting the present tense.
 */
function person(): Node {
  const portrait = findPortrait();

  return {
    "@type": "Person",
    "@id": ids.person,
    name: site.name,
    /* Split out as well as given whole. A name query is matched against the
       entity, and spelling out the parts is what lets Google treat "Timalsina"
       on its own as this person's surname rather than an unparsed token. */
    givenName: "Sarbajit",
    familyName: "Timalsina",
    alternateName: [...nameVariants],
    url: absolute("/"),
    /* Names the page this Person is the subject of. Without it the Person is a
       free-floating node; with it, the home page *is* the page about Sarbajit
       Timalsina, which is precisely what a search for the name is asking for. */
    mainEntityOfPage: ref(ids.home),
    jobTitle: site.role,
    description: site.description,
    email: `mailto:${site.email}`,
    knowsLanguage: ["en", "ne"],
    ...(portrait ? { image: absolute(portrait) } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location,
      addressCountry: site.country,
    },
    /* Every profile the site actually links to, and only those. This is the
       strongest signal available for a name query: it is how Google decides
       that this site, the LinkedIn profile and the GitHub account are one
       person rather than three, and consolidates their authority here. */
    sameAs: profiles.map((profile) => profile.href),
    knowsAbout: skills.flatMap((group) => [...group.items]),
    alumniOf: education.map((entry) => ({
      "@type": "CollegeOrUniversity",
      name: entry.organization,
    })),
  };
}

function website(): Node {
  return {
    "@type": "WebSite",
    "@id": ids.website,
    url: absolute("/"),
    name: `${site.name} · ${site.role}`,
    description: site.description,
    inLanguage: site.lang,
    publisher: ref(ids.person),
    /* No potentialAction/SearchAction: there is no search on this site, and
       claiming one gets the sitelinks searchbox dropped, not granted. */
  };
}

/**
 * The project cards, as works.
 *
 * `contributor` rather than `creator` throughout, and that is deliberate: one
 * of these (Parivar) was a QA engagement, not a build, and content/projects.ts
 * carries no field distinguishing the two. `contributor` is true of every card;
 * `creator` would overclaim on one of them.
 */
function works(): Node[] {
  return projects.map((project) => ({
    "@type": "CreativeWork",
    "@id": absolute(`/#project-${project.slug}`),
    name: project.title,
    description: project.blurb,
    contributor: ref(ids.person),
    inLanguage: site.lang,
    ...(project.stack.length ? { keywords: [...project.stack] } : {}),
    ...(project.year ? { dateCreated: project.year } : {}),
    ...(project.image ? { image: absolute(project.image) } : {}),
    ...(project.live ? { url: project.live } : {}),
  }));
}

/** Home: a profile page about the Person, plus the work it shows. */
export function homeGraph(): Node {
  return {
    "@context": "https://schema.org",
    "@graph": [
      person(),
      website(),
      {
        "@type": "ProfilePage",
        "@id": ids.home,
        url: absolute("/"),
        name: `${site.name} · ${site.role}`,
        description: site.description,
        inLanguage: site.lang,
        isPartOf: ref(ids.website),
        about: ref(ids.person),
        mainEntity: ref(ids.person),
      },
      ...works(),
    ],
  };
}

/**
 * Contact: the page, plus the breadcrumb that makes it legible in a result.
 *
 * The Person is emitted here too rather than only referenced. `about` pointed
 * at an @id that existed only in the home page's graph, which left the node
 * dangling for any crawler that fetched this page on its own — and it is the
 * Person, with its `sameAs`, that a search for the name needs to resolve.
 */
export function contactGraph(): Node {
  return {
    "@context": "https://schema.org",
    "@graph": [
      person(),
      {
        "@type": "ContactPage",
        "@id": ids.contact,
        url: absolute("/contact/"),
        name: `Contact · ${site.name}`,
        description: `Get in touch with ${site.name}, a ${site.role.toLowerCase()} in ${site.location}.`,
        inLanguage: site.lang,
        isPartOf: ref(ids.website),
        about: ref(ids.person),
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absolute("/") },
            { "@type": "ListItem", position: 2, name: "Contact", item: absolute("/contact/") },
          ],
        },
      },
    ],
  };
}
