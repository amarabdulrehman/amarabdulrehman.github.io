import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/case-studies";
import { flagship, profile } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: profile.site, changeFrequency: "monthly", priority: 1 },
    { url: `${profile.site}${flagship.caseStudy}`, changeFrequency: "monthly", priority: 0.8 },
    ...caseStudies.map((c) => ({ url: `${profile.site}/work/${c.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
