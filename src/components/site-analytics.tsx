"use client";

/**
 * Vercel Web Analytics: page views plus the handful of actions that show whether a
 * recruiter or client actually engaged. Link clicks are tracked with one delegated
 * listener, so new CV / case-study / WhatsApp links are counted without extra wiring.
 * No cookies and no personal data: event properties are file names and paths only.
 */

import { track } from "@vercel/analytics";
import { Analytics } from "@vercel/analytics/next";
import { useEffect } from "react";

export type SiteEvent =
  | "Copy email"
  | "Download"
  | "Open case study"
  | "Email link"
  | "WhatsApp"
  | "LinkedIn"
  | "GitHub"
  | "Role fit matched"
  | "Role fit pitch copied"
  | "Lead sent"
  | "Recruiter mode";

export function trackEvent(name: SiteEvent, props?: Record<string, string | number | boolean | null>) {
  try {
    track(name, props);
  } catch {
    /* analytics must never break the page */
  }
}

function classify(a: HTMLAnchorElement): [SiteEvent, Record<string, string>?] | null {
  const href = a.getAttribute("href") ?? "";
  if (a.hasAttribute("download") || /\.pdf($|\?)/i.test(href)) return ["Download", { file: href.split("/").pop() ?? href }];
  if (href.startsWith("/work/")) return ["Open case study", { path: href.split("#")[0] }];
  if (href.startsWith("mailto:")) return ["Email link"];
  if (href.includes("wa.me/")) return ["WhatsApp"];
  if (href.includes("linkedin.com")) return ["LinkedIn"];
  if (href.includes("github.com")) return ["GitHub", { path: new URL(href).pathname }];
  return null;
}

export function SiteAnalytics() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      try {
        const hit = classify(a as HTMLAnchorElement);
        if (hit) trackEvent(hit[0], hit[1]);
      } catch {
        /* malformed href: ignore */
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return <Analytics />;
}
