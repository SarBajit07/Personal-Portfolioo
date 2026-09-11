import { education, skills } from "@/content/profile";
import { projects } from "@/content/projects";
import { findPortrait } from "@/lib/portrait";
import { absolute, site } from "@/lib/site";

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
    url: absolute("/"),
    jobTitle: site.role,
    description: site.description,
    email: `mailto:${site.email}`,
    ...(portrait ? { image: absolute(portrait) } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location,
      addressCountry: site.country,
    },
    /* The one profile the site actually links to. Listing accounts that are not
       on the page would be an unverifiable claim. */
    sameAs: [site.github],
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
    name: `${site.name} — ${site.role}`,
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
        name: `${site.name} — ${site.role}`,
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

/** Contact: the page, plus the breadcrumb that makes it legible in a result. */
export function contactGraph(): Node {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": ids.contact,
        url: absolute("/contact/"),
        name: `Contact — ${site.name}`,
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
