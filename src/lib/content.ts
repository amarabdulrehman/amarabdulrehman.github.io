/**
 * Single source of truth for the portfolio.
 * Every section of the site AND the "Ask Amar" chatbot read from this file,
 * so updating a fact here updates it everywhere.
 */

/**
 * ToffeeOS orders per day: the 30-day average across SPILL and Loom, from the
 * ToffeeOS pulse endpoint (`avgDailyOrders30d`). Every "orders a day" claim on
 * the site reads this, so update it here only. Leave `value` null to hide the number.
 */
export const ordersPerDay: { value: string | null; asOf: string } = {
  // pulse avgDailyOrders30d = 82.4 on 2026-11-21, 79 on 2026-11-22 (ACTIVE tenants, voided/cancelled excluded).
  // "~80" stays true while the live average drifts a little either side of 80; never use "80+".
  value: "~80",
  asOf: "Nov 2026",
};
const ORDERS = ordersPerDay.value;

export const profile = {
  name: "Amar Abdur Rehman",
  firstName: "Amar",
  role: "Full-Stack & Python Engineer",
  location: "Islamabad, Pakistan",
  email: "amar@amarabdurrehman.me",
  linkedin: "https://www.linkedin.com/in/amarabdurrehman/",
  github: "https://github.com/amarabdulrehman",
  site: "https://amarabdurrehman.me",
  cv: "/cv.pdf",
  whatsapp: "+92 329 1555121",
  whatsappUrl: "https://wa.me/923291555121",
  portrait: "/amar-cutout.webp",
  availability: "Available for remote engineering roles (30–40 hrs/week)",
  hours: "30–40 hrs/week",
  timezone: "Islamabad, PK (UTC+5) · 4+ hrs overlap with EU/UK & US East",
  graduation: "July 2027",
  headline: "Software that real businesses run on.",
  intro:
    `I’m Amar, a final-year CS student at COMSATS Islamabad. Two cafés run every order through the restaurant system I built${ORDERS ? ` (${ORDERS} orders a day, 30-day avg)` : ""}, and I’ve shipped software for 20+ clients since 2024.`,
};

/** The hero's code-style status card. Only facts stated elsewhere on the site. */
export const config: { key: string; value: string | string[] }[] = [
  { key: "role", value: "Full-stack & Python engineer" },
  { key: "based", value: "Islamabad, PK · UTC+5" },
  { key: "status", value: "Open to remote roles · 30–40 hrs/week" },
  { key: "shipping", value: ["ToffeeOS", "RecruitAI", "Meow Meow AI"] },
  { key: "clients", value: "20+ since 2024" },
  { key: "graduating", value: "July 2027 · COMSATS" },
];

/**
 * The hero's headline numbers. Plain strings, rendered as-is on first paint
 * (no count-up), so they always match the copy around them.
 */
export const stats = [
  ORDERS
    ? { value: ORDERS, label: "orders a day on ToffeeOS (30-day avg)" }
    : { value: "~5,000", label: "real orders processed on ToffeeOS" },
  { value: "561", label: "automated tests before every release" },
  { value: "1,000", label: "resumes ranked in a single batch" },
  { value: "20+", label: "clients since 2024" },
];

/** Short proof points on the portrait tile. */
export const proof = [
  { strong: "Ships production software.", rest: "ToffeeOS runs two cafés every day." },
  { strong: "Builds AI that behaves.", rest: "Models read; plain, tested code decides and acts." },
  { strong: "Final-year CS at COMSATS.", rest: "Graduating July 2027." },
];

/** The "About" bento numbers: production depth that complements the hero stats. */
export const productionStats = [
  { value: "2", label: "cafés live on ToffeeOS: SPILL and Loom" },
  { value: "~5,000", label: "real orders processed in production" },
  { value: "~4,500", label: "real payments processed in production" },
  { value: "3 yrs", label: "shipping software for clients" },
];

export const flagship = {
  name: "ToffeeOS",
  tagline: "Restaurant software two cafés run on every day.",
  summary:
    "Multi-tenant restaurant software that runs SPILL and Loom in Bahawalpur: the till, the kitchen screen, inventory, delivery riders, QR table ordering and reports.",
  url: "https://toffeeos.com/",
  caseStudy: "/work/toffeeos",
  caseStudyPdf: "/toffeeos-case-study.pdf",
  image: "/work/toffeeos.webp",
  features: [
    {
      title: "Works offline.",
      body: "Keeps taking orders and cash payments when the internet drops, then syncs the moment it’s back.",
    },
    {
      title: "Tax, handled.",
      body: "Applies Punjab’s 16% cash / 8% card tax split on every single bill.",
    },
    {
      title: "Tested before it ships.",
      body: "333 Playwright end-to-end and 228 Vitest unit tests run before every release. They caught a Prisma transaction timeout before it reached production.",
    },
  ],
  metrics: [
    { value: "2", label: "live cafés: SPILL and Loom" },
    ORDERS
      ? { value: ORDERS, label: "orders a day (30-day avg)" }
      : { value: "~5,000", label: "real orders processed" },
    { value: "561", label: "tests before every release" },
  ],
  stack: ["Next.js", "TypeScript", "Prisma", "Supabase", "Playwright", "Vercel"],
};

export type Link = { label: string; href: string };

export const lately: {
  kicker: string;
  badge?: string;
  title: string;
  body: string;
  tech: string;
  links: Link[];
  /** path of the full write-up under /work, if there is one */
  caseStudy?: string;
}[] = [
  {
    kicker: "Hackathon · Nov 2026",
    badge: "1st Runner-Up",
    title: "Meow Meow AI Front Desk",
    body: "An AI receptionist for a vet clinic, built in n8n. It books, cancels and reschedules on Google Calendar, logs to Sheets and hands anything medical to staff. The AI reads the message; plain code decides and acts, and rolls the calendar back if a write fails. Took 1st Runner-Up at AI Agents Arena 2.0 (CAIS, CUI Tech Fest), then I extended it for the PayPal AI Hackathon with refundable Braintree no-show deposits, automatic refunds and AI visit billing that staff approve.",
    tech: "n8n · Gemini · PayPal Braintree · Google Calendar",
    caseStudy: "/work/meow-meow-ai-front-desk",
    links: [
      { label: "Demo video", href: "https://youtu.be/TzSrkGklnqM" },
      { label: "Devpost", href: "https://devpost.com/software/meow-meow-ai-front-desk" },
      { label: "Code", href: "https://github.com/amarabdulrehman/meow-meow-ai-front-desk" },
    ],
  },
  {
    kicker: "Hackathon · Nov 2026",
    title: "MTM Planner",
    body: "Built at MTM Version 2.0 (GDGoC CUI Wah). Reads emails, WhatsApp texts and notices in English or Roman Urdu and plans a whole event: venue, schedule, food, judging and budget. The model only reads; the arithmetic and six validity checks run in code, and every model call is traced.",
    tech: "Node.js · Gemini Flash-Lite",
    caseStudy: "/work/mtm-planner",
    links: [
      { label: "Live demo", href: "https://mtm-planner.vercel.app" },
      { label: "Code", href: "https://github.com/amarabdulrehman/mtm-planner" },
    ],
  },
  {
    kicker: "Research · Roman Urdu",
    badge: "In progress",
    title: "RUTool benchmark",
    body: "Tests whether AI agents pick the right tool when people write in Roman Urdu or Hinglish, where “kal” means both yesterday and tomorrow and “paune do lakh” means 175,000. The announcement post passed 40,000 impressions on LinkedIn.",
    tech: "Python · LLM evaluation",
    caseStudy: "/work/rutool",
    links: [],
  },
  {
    kicker: "Automation · Krimsols",
    title: "Lead Desk",
    body: "An n8n workflow that scores each enquiry hot, warm, cold or spam and replies in the customer’s own language (English, Roman Urdu or Arabic) in under 10 seconds in testing. Retries on failure, guards against broken AI output, logs to Google Sheets and alerts the owner about hot leads.",
    tech: "n8n · Gemini · Gmail · Google Sheets",
    links: [],
  },
];

export const recruitAI = {
  kicker: "NLP · Hiring",
  title: "RecruitAI",
  body: "Ranks up to 1,000 resumes against a job description in one batch with TF-IDF and cosine similarity. No per-resume API cost, and every score traces back to the terms that matched.",
  tech: "Python · Flask · NLP",
  demo: "https://screenerresume.vercel.app/",
  ranking: [
    { name: "Candidate 0412", score: 92 },
    { name: "Candidate 0087", score: 88 },
    { name: "Candidate 0731", score: 81 },
    { name: "Candidate 0256", score: 74 },
  ],
  matched: ["python", "fastapi", "postgresql", "docker", "pytest"],
};

export type ProjectVisual = "autotwin" | "dentalos" | "echallan";

/**
 * Selected work under RecruitAI. Each card has a visual slot and a link slot:
 * drop a screenshot path into `image` to replace the coded diagram, and add
 * repo/demo URLs to `links` when they're public.
 */
export const projects: {
  kicker: string;
  badge?: string;
  title: string;
  body: string;
  tech: string;
  visual: ProjectVisual;
  visualLabel: string;
  image?: string;
  links: Link[];
}[] = [
  {
    kicker: "Final-year project · Simulation",
    title: "AutoTwin",
    body: "Zero-trust security sandbox: a JSON floor plan becomes a 3D building where 50+ simulated agents pass access checkpoints while attacks run. I lead the frontend and analytics.",
    tech: "Unreal Engine 5.5 · FastAPI · MQTT · Flutter",
    visual: "autotwin",
    visualLabel: "System architecture",
    links: [],
  },
  {
    kicker: "Clinic software · SaaS",
    badge: "In development",
    title: "DentalOS",
    body: "Multi-tenant dental clinic software: scheduling, billing and inventory, with WhatsApp appointment reminders in progress.",
    tech: "Next.js · TypeScript · Supabase",
    visual: "dentalos",
    visualLabel: "Data model preview",
    links: [],
  },
  {
    kicker: "Computer vision",
    title: "Automated E-Challan",
    body: "Flags drivers without seatbelts, reads the number plate with OCR and pulls the owner’s record to issue the challan with no manual steps.",
    tech: "Python · OpenCV · OCR",
    visual: "echallan",
    visualLabel: "Detection pipeline",
    links: [],
  },
];

/** Older and coursework projects. Not shown on the page; the chatbot still knows them. */
export const archiveProjects = [
  { title: "Real-time Object Detection", body: "Detects and labels 50+ types of real-world objects from live video. Python, OpenCV, YOLO, PyTorch." },
  { title: "Parallel Computing", body: "C++ programs parallelised with OpenMP and run on AWS EC2, plus distributed-memory MPI programs in C." },
  { title: "Face Mask Detection", body: "Real-time deep learning on live video, with visual and audio alerts." },
  { title: "Heart Disease Prediction", body: "Classification models estimating risk from healthcare data." },
  { title: "Melodify", body: "Offline music app in Flutter with caching and background playback." },
  { title: "File Security Tool", body: "Python tool for file encryption and access control." },
];

export type Website = {
  name: string;
  kind: string;
  summary: string;
  url: string;
  image: string;
  accent: string;
  /** "production": a business runs on it today. "prototype": a live, clickable build made for the client. */
  status: "production" | "prototype";
};

export const STATUS_LABEL: Record<Website["status"], string> = {
  production: "Live Production",
  prototype: "Live Prototype",
};

export const websites: Website[] = [
  {
    name: "SPILL",
    kind: "Specialty coffee · Bahawalpur",
    summary: "Scroll-driven brand story with a QR scan-to-join loyalty card wired into ToffeeOS, the till SPILL rings up every order on.",
    url: "https://spillpk.com/",
    image: "/work/spill.webp",
    accent: "#1d1d1f",
    status: "production",
  },
  { name: "Blanco Bake Shop", kind: "Bakery & café · Wah Cantt", summary: "Menu, custom cake requests and FoodPanda ordering.", url: "https://blancoo.vercel.app/", image: "/work/blanco.webp", accent: "#b0855b", status: "prototype" },
  { name: "Brula by Janan", kind: "Boutique coffee · Bahawalpur", summary: "An editorial menu and a feel for the space.", url: "https://brula.vercel.app/", image: "/work/brula.webp", accent: "#6b4a35", status: "prototype" },
  { name: "Al-Kousar Properties", kind: "Real estate · DHA Bahawalpur", summary: "180+ listings, services and lead forms.", url: "https://alkousarproperties.vercel.app/", image: "/work/alkousar.webp", accent: "#0b5d3b", status: "prototype" },
  { name: "CAKOO", kind: "Bakery & pizza · Wah Cantt", summary: "Full menu with WhatsApp ordering.", url: "https://cakooo.vercel.app/", image: "/work/cakoo.webp", accent: "#d6336c", status: "prototype" },
  { name: "The Trim Town Studio", kind: "Barbershop · Bahawalpur", summary: "Services menu with one-tap booking.", url: "https://trimtown.vercel.app/", image: "/work/trimtown.webp", accent: "#0071e3", status: "prototype" },
];

export const experience = [
  { period: "2024 – now", role: "Founder", org: "Krimsols", body: "Websites, restaurant software and AI tools for cafés, restaurants and small businesses. 20+ clients." },
  { period: "Jul – Sep 2026", role: "AI/ML Intern", org: "GOFTECH Solutions · remote", body: "Built RecruitAI; data preprocessing, ML models in Python and batch processing at scale." },
  { period: "Mar – Apr 2025", role: "Python Developer Intern", org: "CodeAlpha · remote", body: "Python automation and scripting on real-world projects, with SQL." },
  { period: "Nov 2023 – Nov 2025", role: "Web Developer", org: "Evangeline Media", body: "Part-time web development and social media." },
  { period: "2023 – 2027", role: "BS Computer Science", org: "COMSATS University Islamabad", body: "Final year, graduating July 2027. Coursework includes Parallel and Distributed Computing and Advanced Web Development." },
];

export const stack = [
  { group: "Languages", items: ["Python", "TypeScript", "C++"] },
  { group: "Web", items: ["Next.js", "React", "Node.js", "Tailwind CSS"] },
  { group: "APIs", items: ["FastAPI", "Flask"] },
  { group: "Data", items: ["PostgreSQL", "Supabase", "Prisma"] },
  { group: "AI & Automation", items: ["n8n", "Gemini API", "Google Sheets / Gmail APIs", "Claude Code"] },
  { group: "Testing", items: ["Playwright", "Vitest", "pytest"] },
  { group: "ML & Vision", items: ["PyTorch", "OpenCV"] },
  { group: "Mobile", items: ["Flutter"] },
  { group: "Ship", items: ["Git", "Vercel", "AWS EC2"] },
];

/**
 * Extra facts only the chatbot uses (not shown as page sections).
 * Fill these in to make "Ask Amar" more personal. Leave a line out
 * rather than guess: the bot is told never to invent facts.
 */
export const botExtras: string[] = [
  // Target roles
  "Looking for remote, paid roles at fast-moving startups and product teams. Open to junior full-stack, frontend, backend, AI/automation engineering, n8n development, computer vision / ML engineering, QA and test automation, AI training and evaluation, developer support, and agency web development.",
  "Contract, part-time or full-time all work for him. He's most useful where software meets real small businesses: restaurants, retail, clinics and services.",
  // Availability
  "Available now, with no notice period, for 30–40 hours a week alongside his final year. Works remotely from Islamabad (Pakistan Standard Time, UTC+5): can cover European hours fully and overlaps about 4 hours with US hours.",
  "Happy to start with a paid trial project to prove himself. Paid internships are fine; he doesn't do unpaid work.",
  // Story
  "Has built software for real clients for about 3 years: web developer at Evangeline Media (2023–2025), then founded Krimsols, a software company in Islamabad that has delivered work for 20+ clients since 2024.",
  "He started Krimsols because local businesses were running on paper and WhatsApp and he knew he could build them something better. That's how ToffeeOS was born.",
  "Graduates with a BS in Computer Science from COMSATS University Islamabad in July 2027, while running Krimsols.",
  // How he works
  "ToffeeOS: Amar built and maintains it, and shipped it to two real cafés where it runs in production. Never describe it as built solo or by himself.",
  "Ships fast because he builds with AI coding agents like Claude Code every day.",
  "Tests before he trusts: his automations retry on failure, check AI output before anything goes out, and alert a person when something breaks.",
  // Proudest work and what's next
  "ToffeeOS (Next.js, TypeScript, Postgres) has processed about 5,000 real orders and 4,500 real payments in production.",
  "Also built a construction-tracking desktop app with cloud backup.",
  // Status of specific projects (answer plainly if asked)
  "Lead Desk (the n8n lead-scoring and auto-reply workflow) is built and tested, not yet deployed to a client. If asked whether a real client uses it, say exactly that: \"It's built and tested, not yet deployed to a client.\"",
  "Next, he wants to build AI agents and vision systems that small businesses can actually rely on with real customers, in the languages those customers speak.",
  // Outside work
  "Speaks English and Urdu (his bots also reply in Arabic, but he doesn't speak it himself).",
  "Outside code, he tinkers with ESP32 hardware. His first gadget is a tiny desk charm that shows whatever's playing on his Spotify. He likes taking software he uses every day off the screen and into something physical he can hold.",
  "He got into software by building websites for local cafés and saw that most of them ran their orders on paper and WhatsApp. ToffeeOS started from that.",
  "He regularly competes in hackathons and the Huawei ICT Competition, and likes building things under a deadline with a team.",
  "He's curious by nature, and that curiosity usually turns into something real: noticing cafés on paper led to ToffeeOS, and noticing AI agents misread Roman Urdu (where 'kal' means both yesterday and tomorrow) led to his RUTool benchmark.",
  // Extra skills not shown on the site
  "Other skills: JavaScript, HTML/CSS, responsive and animated sites, REST APIs, webhooks, Socket.IO, SQL, LLM workflows and agents, prompt design, AI output validation, multilingual replies (English, Roman Urdu, Arabic), Gemini API, Google Sheets and Gmail APIs, Java, Rust, C#, Go, MongoDB, Zapier, Make.com, Cursor, WordPress/WooCommerce.",
  // Contact
  "Best way to reach him: email amar@amarabdurrehman.me, or LinkedIn.",
];

/** Topics the bot must not discuss; it redirects them to email instead. */
export const botOffLimits = [
  "salary, rates or pay expectations",
  "committing to a specific start date or exact schedule (it may say he's available now for 30–40 hours a week, and his time-zone overlap)",
  "his age",
  "his grades",
  "client details beyond what's public on this site",
  "his personal life",
];

export const suggestedQuestions = [
  "What’s his strongest project?",
  "Has he shipped software to real users?",
  "Is he available for remote roles?",
  "What’s his experience with AI?",
];

/**
 * Which tools each featured project actually uses (labels match `stack` items).
 * Drives the Stack filter and the Role-Fit Matcher, so keep it truthful.
 */
export type ProjectKey = "toffeeos" | "recruitai" | "leaddesk" | "meowmeow" | "autotwin" | "dentalos" | "echallan";

export const projectTech: Record<ProjectKey, { title: string; anchor: string; tech: string[] }> = {
  toffeeos: {
    title: "ToffeeOS",
    anchor: "toffeeos",
    tech: ["TypeScript", "Next.js", "React", "Node.js", "PostgreSQL", "Supabase", "Prisma", "Playwright", "Vitest", "Git", "Vercel"],
  },
  recruitai: { title: "RecruitAI", anchor: "work", tech: ["Python", "Flask", "Git", "Vercel"] },
  leaddesk: { title: "Lead Desk", anchor: "hackathons", tech: ["n8n", "Gemini API", "Google Sheets / Gmail APIs"] },
  meowmeow: { title: "Meow Meow AI Front Desk", anchor: "hackathons", tech: ["n8n", "Gemini API", "Google Sheets / Gmail APIs"] },
  autotwin: { title: "AutoTwin", anchor: "work", tech: ["Python", "FastAPI", "Flutter", "Git"] },
  dentalos: { title: "DentalOS", anchor: "work", tech: ["TypeScript", "Next.js", "React", "PostgreSQL", "Supabase", "Git"] },
  echallan: { title: "Automated E-Challan", anchor: "work", tech: ["Python", "OpenCV", "Git"] },
};

export const projectsUsing = (tech: string) =>
  (Object.keys(projectTech) as ProjectKey[]).filter((k) => projectTech[k].tech.includes(tech));


/**
 * Client and colleague quotes. VERBATIM ONLY, from a real person who has agreed to be
 * quoted by name (a LinkedIn recommendation, a WhatsApp or email message, a review).
 * Never paraphrase or write one on someone's behalf: recruiters do check.
 * While this list is empty the "Kind words" section is hidden and drops out of the
 * numbering, so the site never shows placeholder quotes.
 */
export type Testimonial = {
  quote: string;
  name: string;
  /** e.g. "Owner" */
  role: string;
  /** e.g. "SPILL, Bahawalpur" */
  org: string;
  /** what Amar did for them, e.g. "ToffeeOS client since 2025" */
  context: string;
  /** optional public source, e.g. the LinkedIn recommendation URL */
  source?: string;
};

export const testimonials: Testimonial[] = [];
