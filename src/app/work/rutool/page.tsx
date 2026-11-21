import { CaseStudyView, caseStudyMetadata } from "@/components/case-study-view";

const SLUG = "rutool";

export const metadata = caseStudyMetadata(SLUG);

export default function Page() {
  return <CaseStudyView slug={SLUG} />;
}
