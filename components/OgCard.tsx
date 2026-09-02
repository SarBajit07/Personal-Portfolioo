import { ogColours } from "@/lib/og";

/**
 * The OG layout, shared by the site card and the per-project cards. Same
 * grammar as the pages: paper ground, a hairline, a mono label, serif title.
 * Written with inline styles because Satori does not run Tailwind.
 */
export function OgCard({
  label,
  title,
  meta,
  serif,
}: {
  label: string;
  title: string;
  meta: string;
  serif: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: ogColours.paper,
        padding: "72px 80px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: ogColours.accent,
          }}
        >
          {label}
        </div>
        <div style={{ height: 1, background: ogColours.rule, marginTop: 24 }} />
      </div>

      <div
        style={{
          fontFamily: serif,
          fontSize: title.length > 34 ? 76 : 104,
          lineHeight: 1.02,
          letterSpacing: -2,
          color: ogColours.ink,
          maxWidth: 900,
          display: "flex",
        }}
      >
        {title}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ height: 1, background: ogColours.rule, marginBottom: 24 }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 }}>
          <span style={{ color: ogColours.ink2 }}>{meta}</span>
          <span style={{ color: ogColours.ink3 }}>sarbajit.dev</span>
        </div>
      </div>
    </div>
  );
}
