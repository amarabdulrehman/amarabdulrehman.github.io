/** Every numbered section on the page, in order. Nav, side index and headers all read from here. */
export const SECTIONS = [
  { id: "about", label: "About" },
  { id: "work", label: "ToffeeOS" },
  { id: "projects", label: "Projects" },
  { id: "hackathons", label: "Hackathons" },
  { id: "websites", label: "Websites" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const sectionNumber = (id: SectionId) =>
  String(SECTIONS.findIndex((s) => s.id === id) + 1).padStart(2, "0");

export const sectionLabel = (id: SectionId) => SECTIONS.find((s) => s.id === id)!.label;
