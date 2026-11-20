import type { MetadataRoute } from "next";
import { flagship, profile } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: profile.site, changeFrequency: "monthly", priority: 1 },
    { url: `${profile.site}${flagship.caseStudy}`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
