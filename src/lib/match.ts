/**
 * Client-side Role-Fit Matcher. Scores a job description against Amar's real stack
 * and featured projects. Pure functions, no network: what you see is deterministic.
 */

import { profile, projectTech, stats, type ProjectKey } from "./content";

type Term = { label: string; re: RegExp };

const t = (label: string, ...patterns: string[]): Term => ({
  label,
  re: new RegExp(`(?:^|[^a-z0-9+#.])(?:${patterns.join("|")})(?![a-z0-9+#])`, "i"),
});

/** Technologies and practices Amar has shipped with (labels match `stack` where possible). */
const KNOWN: Term[] = [
  t("Python", "python"),
  t("TypeScript", "typescript", "\\bts\\b"),
  t("JavaScript", "javascript", "\\bjs\\b", "es6"),
  t("Next.js", "next\\.?js", "nextjs", "app router"),
  t("React", "react(?:\\.js)?"),
  t("Node.js", "node(?:\\.js)?", "nodejs"),
  t("Tailwind CSS", "tailwind"),
  t("FastAPI", "fastapi"),
  t("Flask", "flask"),
  t("REST APIs", "rest(?:ful)?(?: apis?)?", "apis?"),
  t("PostgreSQL", "postgres(?:ql)?", "\\bsql\\b"),
  t("Supabase", "supabase"),
  t("Prisma", "prisma", "\\borm\\b"),
  t("Playwright", "playwright", "e2e", "end[- ]to[- ]end"),
  t("Vitest", "vitest", "jest", "unit tests?"),
  t("pytest", "pytest"),
  t("Testing & CI", "ci/cd", "\\bci\\b", "test automation", "automated tests?", "tdd"),
  t("PyTorch", "pytorch", "torch"),
  t("OpenCV", "opencv", "computer vision", "ocr"),
  t("NLP", "nlp", "natural language", "tf-?idf", "text classification", "ranking"),
  t("LLMs & agents", "llms?", "gpt", "gemini", "openai", "anthropic", "claude", "ai agents?", "agents?", "agentic", "rag", "prompt", "chatbots?", "conversational ai"),
  t("Machine learning", "machine learning", "\\bml\\b", "scikit", "sklearn"),
  t("n8n & automation", "n8n", "workflow automation", "automations?", "workflows?"),
  t("Claude Code", "claude code"),
  t("Cursor", "cursor"),
  t("Zapier", "zapier"),
  t("Make.com", "make\\.com", "integromat"),
  t("MongoDB", "mongo(?:db)?"),
  t("Go", "golang"),
  t("Google Sheets / Gmail APIs", "google sheets", "gmail(?: api)?", "google workspace"),
  t("Flutter", "flutter", "dart"),
  t("Realtime", "real[- ]?time", "websockets?", "socket\\.io"),
  t("Offline-first", "offline", "pwa", "sync"),
  t("Multi-tenant SaaS", "multi[- ]?tenant", "saas", "b2b"),
  t("Vercel", "vercel"),
  t("AWS", "aws", "ec2"),
  t("Git", "git(?:hub)?"),
  t("MQTT & IoT", "mqtt", "iot"),
  t("C++", "c\\+\\+"),
  t("Product ownership", "founding", "0 ?(?:to|->|→) ?1", "zero to one", "ownership", "end[- ]to[- ]end ownership", "ship(?:ped|ping)? (?:to )?production", "startup"),
];

/**
 * Tools Amar hasn't used: shown honestly under "Not yet" and counted against the
 * coverage score, so a JD that names them can never read as 100%.
 */
const GAPS: Term[] = [
  t("HubSpot", "hubspot"),
  t("Salesforce", "salesforce"),
  t("Ruby / Rails", "ruby", "rails"),
  t("PHP / Laravel", "php", "laravel"),
  t("LangChain", "langchain", "langgraph"),
  t("Svelte", "svelte(?:kit)?"),
  t("Docker", "docker", "containers?"),
  t("Kubernetes", "kubernetes", "k8s"),
  t("GraphQL", "graphql"),
  t("Django", "django"),
  t("Redis", "redis"),
  t("Kafka", "kafka"),
  t("Terraform", "terraform"),
  t("Vue", "vue(?:\\.js)?"),
  t("Angular", "angular"),
  t("GCP / Azure", "gcp", "google cloud", "azure"),
];

type ProjectProfile = { key: ProjectKey; terms: string[]; proof: string; why: (hits: string[]) => string; link: string };

const PROJECTS: ProjectProfile[] = [
  {
    key: "toffeeos",
    terms: ["TypeScript", "JavaScript", "Next.js", "React", "Node.js", "PostgreSQL", "Supabase", "Prisma", "Playwright", "Vitest", "Testing & CI", "Realtime", "Offline-first", "Multi-tenant SaaS", "Vercel", "REST APIs", "Product ownership", "Git"],
    proof: "ToffeeOS: multi-tenant, offline-first POS running 2 cafés (~5,000 real orders so far), gated by 561 automated tests",
    why: (h) => `Production proof for ${h.slice(0, 4).join(", ")}: I built and maintain it; live at SPILL and Loom, 333 Playwright + 228 Vitest tests before every release.`,
    link: "/work/toffeeos",
  },
  {
    key: "recruitai",
    terms: ["Python", "Flask", "NLP", "Machine learning", "REST APIs", "Vercel"],
    proof: "RecruitAI: ranks 1,000 resumes in one batch with TF-IDF + cosine similarity, every score explainable",
    why: (h) => `Shows ${h.slice(0, 3).join(", ")} applied to a real hiring problem, with zero per-resume API cost.`,
    link: "https://screenerresume.vercel.app/",
  },
  {
    key: "leaddesk",
    terms: ["n8n & automation", "LLMs & agents", "Google Sheets / Gmail APIs", "REST APIs"],
    proof: "Lead Desk: n8n + Gemini workflow that scores each enquiry hot/warm/cold/spam and replies in English, Roman Urdu or Arabic in under 10s in testing, with retries and AI-output guards (built and tested, not yet deployed to a client)",
    why: (h) => `Automation work on ${h.slice(0, 3).join(", ")}: scores leads, replies in the customer’s language, retries on failure and validates AI output before it sends. Built and tested, not yet deployed to a client.`,
    link: "/#hackathons",
  },
  {
    key: "meowmeow",
    terms: ["n8n & automation", "LLMs & agents", "Google Sheets / Gmail APIs", "REST APIs"],
    proof: "Meow Meow AI Front Desk: n8n + Gemini vet-clinic receptionist that books on Google Calendar and rolls back failed writes; 1st Runner-Up, AI Agents Arena 2.0",
    why: (h) => `An AI agent on ${h.slice(0, 3).join(", ")} that acts on real systems: the model reads, tested code decides, and failed calendar writes roll back. 1st Runner-Up at AI Agents Arena 2.0.`,
    link: "/work/meow-meow-ai-front-desk",
  },
  {
    key: "autotwin",
    terms: ["Python", "FastAPI", "MQTT & IoT", "Flutter", "Realtime", "REST APIs"],
    proof: "AutoTwin: Unreal Engine 5.5 zero-trust sandbox with 50+ simulated agents, FastAPI + MQTT telemetry",
    why: (h) => `Systems work across ${h.slice(0, 3).join(", ")}: event streams from a 3D simulation into analytics.`,
    link: "/#work",
  },
  {
    key: "dentalos",
    terms: ["TypeScript", "Next.js", "React", "PostgreSQL", "Supabase", "Multi-tenant SaaS", "Product ownership"],
    proof: "DentalOS: multi-tenant clinic SaaS (scheduling, billing, inventory), in development",
    why: (h) => `A second multi-tenant product on ${h.slice(0, 3).join(", ")}, designed tenant-scoped from the schema up.`,
    link: "/#work",
  },
  {
    key: "echallan",
    terms: ["Python", "OpenCV", "Machine learning", "PyTorch"],
    proof: "Automated E-Challan: seatbelt detection → OCR plate read → challan dispatch, no manual steps",
    why: (h) => `A full ${h.slice(0, 2).join(" + ")} pipeline from camera frame to action.`,
    link: "/#work",
  },
];

export type MatchResult = {
  matched: string[];
  gaps: string[];
  /** 0–100: share of the JD's recognised requirements Amar covers. */
  score: number;
  top: { key: ProjectKey; title: string; why: string; link: string; hits: string[] }[];
  pitch: string;
};

/** JD wording that makes Lead Desk and Meow Meow the most relevant work. */
const AI_ROLE = /\bn8n\b|automat|\bagents?\b|agentic|\bllms?\b|workflows?|chatbots?/i;
/** "Go" the language, read case-sensitively from the original JD so the verb "go" doesn't count. */
const GO_LANG = /(?:^|[\s,(/])Go(?=$|[\s,)/.;])(?!\s+(?:to|live|ahead|beyond|further|out|back|for|from|with)\b)/;

const find = (terms: Term[], text: string) => terms.filter((x) => x.re.test(text)).map((x) => x.label);

export function matchRole(jd: string, role = "this role"): MatchResult {
  const text = ` ${jd.toLowerCase()} `;
  const matched = find(KNOWN, text);
  const gaps = find(GAPS, text);
  if (!matched.includes("Go") && GO_LANG.test(jd)) matched.push("Go");
  const recognised = matched.length + gaps.length;
  const score = recognised === 0 ? 0 : Math.round((matched.length / recognised) * 100);

  // AI / automation JDs: agent and workflow work outranks everything else, in this order
  const aiRole = AI_ROLE.test(text);
  const ranked = PROJECTS.map((p) => {
    const hits = p.terms.filter((x) => matched.includes(x));
    // weight production proof slightly: ToffeeOS is live with real users
    let weight = hits.length + (p.key === "toffeeos" && hits.length > 0 ? 0.5 : 0);
    if (aiRole && p.key === "leaddesk") weight += 101;
    if (aiRole && p.key === "meowmeow") weight += 100;
    return { p, hits, weight };
  })
    .filter((r) => r.hits.length > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 2);

  const top = ranked.map(({ p, hits }) => ({
    key: p.key,
    title: projectTech[p.key].title,
    why: p.why(hits),
    link: p.link.startsWith("/") ? `${profile.site}${p.link}` : p.link,
    hits,
  }));

  const head = matched.slice(0, 6).join(", ");
  const bullets = [
    `• Stack fit for ${role}: ${head || "full-stack TypeScript and Python"}${gaps.length ? ` (open to ramping on ${gaps.slice(0, 2).join(", ")})` : ""}.`,
    ...ranked.map(({ p }) => `• ${p.proof}.`),
  ];
  // always three bullets
  const fallback = [
    `• ${stats[3].value} ${stats[3].label}; ${stats[0].value} ${stats[0].label}.`,
    `• ${stats[1].value} ${stats[1].label}.`,
  ];
  while (bullets.length < 3) bullets.push(fallback[bullets.length - 1] ?? fallback[0]);

  const pitch = [
    `${profile.name}: ${profile.role}`,
    ...bullets.slice(0, 3),
    `Remote, ${profile.hours}, UTC+5 (4+ hrs overlap with EU/UK & US East). Graduating ${profile.graduation}.`,
    `${profile.email} · ${profile.site}`,
  ].join("\n");

  return { matched, gaps, score, top, pitch };
}

export const PRESETS: { label: string; jd: string }[] = [
  {
    label: "Full-Stack Next.js Engineer",
    jd: "We're hiring a Full-Stack Engineer (remote) to build our multi-tenant SaaS. Stack: Next.js App Router, React, TypeScript, Node.js, PostgreSQL with Prisma, Supabase auth and realtime, Tailwind CSS, deployed on Vercel. You'll own features end to end, write Playwright end-to-end and Vitest unit tests, and keep CI green. Bonus: offline-first or PWA experience, Docker.",
  },
  {
    label: "Python / AI Engineer",
    jd: "Python / AI Engineer to build LLM-powered agents and ML pipelines. Requirements: Python, FastAPI or Flask, REST APIs, NLP and text ranking, experience with OpenAI or Gemini APIs, prompt design and evaluation, pytest. Nice to have: PyTorch, computer vision (OpenCV), workflow automation with n8n, AWS, Docker.",
  },
  {
    label: "Founding Product Engineer",
    jd: "Founding Product Engineer at an early-stage startup. You'll take products from 0 to 1 and ship to production with real customers. TypeScript, React/Next.js, Node.js, Postgres, plus Python for AI features with LLMs. Strong ownership, product sense, automated testing and CI/CD, comfortable talking to users. Experience with B2B SaaS and multi-tenant systems is a plus.",
  },
];
