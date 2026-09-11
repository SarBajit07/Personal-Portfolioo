/**
 * Renders a JSON-LD graph into the document.
 *
 * `<` is escaped because a "</script>" inside any string — a project blurb, say
 * — would otherwise close the tag early and put the rest of the graph into the
 * page as markup. JSON.stringify does not do this for you.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\u003c"),
      }}
    />
  );
}
