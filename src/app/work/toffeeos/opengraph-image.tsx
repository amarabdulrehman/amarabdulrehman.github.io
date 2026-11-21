import { caseStudyOg, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "ToffeeOS case study by Amar Abdur Rehman";

export default function Image() {
  return caseStudyOg({
    name: "ToffeeOS",
    title: "Restaurant software two cafés run on every day.",
    tag: "Live in production · 561 tests",
  });
}
