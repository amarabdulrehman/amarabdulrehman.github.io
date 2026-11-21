import { caseStudyBySlug } from "@/lib/case-studies";
import { caseStudyOg, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Case study by Amar Abdur Rehman";

export default function Image() {
  const cs = caseStudyBySlug("meow-meow-ai-front-desk")!;
  return caseStudyOg({ name: cs.name, title: cs.title.replace("|", ""), tag: cs.ogTag });
}
