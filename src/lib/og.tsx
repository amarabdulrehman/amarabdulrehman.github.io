import { ImageResponse } from "next/og";

/** 1200×630 share card in the site's identity: grid lines, one indigo accent, mono labels. */
export const OG_SIZE = { width: 1200, height: 630 };

export function caseStudyOg({ name, title, tag }: { name: string; title: string; tag: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#09090b",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, letterSpacing: 3, textTransform: "uppercase", color: "#a1a1aa" }}>
          <span style={{ color: "#8b8bfa" }}>Case study</span>
          <span>·</span>
          <span>{name}</span>
        </div>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2, maxWidth: 1000 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, color: "#a1a1aa" }}>
          <span>Amar Abdur Rehman · amarabdurrehman.me</span>
          <span style={{ display: "flex", padding: "10px 20px", borderRadius: 999, background: "#5b5bf7", color: "#fff", fontSize: 22 }}>{tag}</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
