/**
 * Every numbered section on the page, in order. Headers and the side index read from here.
 * `nav: true` sections also appear in the top navigation, which stays short on purpose.
 */
export const SECTIONS = [
  { id: "about", label: "About", nav: false },
  { id: "toffeeos", label: "ToffeeOS", nav: true },
  { id: "work", label: "Work", nav: true },
  { id: "hackathons", label: "Hackathons", nav: false },
  { id: "client-sites", label: "Client Sites", nav: true },
  { id: "experience", label: "Experience", nav: true },
  { id: "stack", label: "Stack", nav: true },
  { id: "contact", label: "Contact", nav: true },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const NAV_SECTIONS = SECTIONS.filter((s) => s.nav);

export const sectionNumber = (id: SectionId) =>
  String(SECTIONS.findIndex((s) => s.id === id) + 1).padStart(2, "0");

export const sectionLabel = (id: SectionId) => SECTIONS.find((s) => s.id === id)!.label;
