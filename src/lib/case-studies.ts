/**
 * Case studies rendered by /work/[slug]. ToffeeOS has its own hand-built page.
 *
 * Every claim here comes from the project's own README / progress log. Keep it that way:
 * if a number isn't in the repo, it doesn't go on the page. In `paragraphs`, **bold**
 * marks the phrase a skimming reader should catch.
 */

import type { Link } from "./content";

export type CaseBlock =
  | { kind: "grid"; items: [string, string][] }
  | { kind: "pipeline"; steps: [string, string][] }
  | { kind: "stats"; items: [string, string][] }
  | { kind: "table"; rows: [string, string][] };

export type CaseChapter = {
  id: string;
  label: string;
  title: string;
  paragraphs: string[];
  block?: CaseBlock;
  after?: string[];
};

export type CaseStudy = {
  slug: string;
  name: string;
  kicker: string;
  /** h1; the part after the last "|" is set in the accent colour */
  title: string;
  lede: string;
  /** one-sentence meta description / share text */
  description: string;
  facts: [string, string][];
  chapters: CaseChapter[];
  links: Link[];
  /** shown under the title on share cards */
  ogTag: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "meow-meow-ai-front-desk",
    name: "Meow Meow AI Front Desk",
    kicker: "AI agent · n8n · Hackathon",
    title: "A front desk where the AI understands |and code decides.",
    lede: "An AI receptionist for Meow Meow Veterinary Hospital, built in n8n. It took 1st Runner-Up at AI Agents Arena 2.0 (CUI Tech Fest), and I extended it for the PayPal AI Hackathon with refundable no-show deposits.",
    description:
      "How Amar Abdur Rehman built an n8n AI receptionist for a vet clinic where Gemini only understands the message and deterministic code books, cancels, refunds and rolls back.",
    facts: [
      ["Result", "1st Runner-Up, AI Agents Arena 2.0"],
      ["Built with", "n8n · Gemini · Braintree"],
      ["Tested", "100+ checks"],
      ["Status", "Hackathon build, code public"],
    ],
    ogTag: "1st Runner-Up · AI Agents Arena 2.0",
    chapters: [
      {
        id: "problem",
        label: "The job",
        title: "One message from a pet owner, the right action on the calendar.",
        paragraphs: [
          "A pet owner sends one message, through a form, the clinic website or a JSON API. The system **books, cancels or reschedules on Google Calendar**, records it in Google Sheets, emails a confirmation, and hands anything medical to staff.",
          "The hard part isn’t the chat. It’s making sure a model that can misread a message **never double-books a vet, invents a time slot or gives medical advice.**",
        ],
      },
      {
        id: "split",
        label: "AI vs code",
        title: "The model reads the message. Plain code makes every decision.",
        paragraphs: [
          "Gemini works out what the customer wants, asks for anything missing and picks **one of five tools**: check availability, book, cancel, reschedule, or hand off to staff. That’s all it does.",
          "A deterministic engine workflow then checks the clinic’s rules, reads the calendar, checks overlaps and suggests up to three alternatives before it creates, moves or deletes anything. **The reply’s final status comes from the tool’s evidence, not from what the model claims happened.**",
        ],
        block: {
          kind: "pipeline",
          steps: [
            ["Entry", "Form, website chat or POST /webhook/mmvh-api"],
            ["Context", "Clinic rules from the Config sheet; a repeated request_id replays the saved answer"],
            ["AI agent", "Gemini: intent, follow-up questions, one tool call"],
            ["Engine", "Code: rules, overlaps, alternatives, then the calendar and sheet writes"],
            ["Reply", "Status from tool evidence; everything logged to CallLog"],
          ],
        },
        after: [
          "Rules the engine enforces in code: a 30-minute grid, lead time, booking horizon, clinic hours, lunch, closed days and holidays, which vet works which day, and whether a service fits the species. All-day calendar events count as busy.",
        ],
      },
      {
        id: "failure",
        label: "Failing safely",
        title: "Built on the assumption that something will break.",
        paragraphs: [
          "If the sheet write fails after the calendar write, **the engine rolls the calendar back**. A repeated request replays the saved answer instead of booking twice. If Gemini fails, it falls over to a backup Gemini key, then to Groq.",
          "A `debug.fault` switch in the Config sheet injects any failure live, so the error paths can be demonstrated rather than promised. A separate error-handler workflow catches what slips through.",
        ],
        block: {
          kind: "stats",
          items: [
            ["5", "agent tools"],
            ["100+", "checks run"],
            ["3", "LLM failover tiers"],
          ],
        },
        after: [
          "The checks cover rule boundaries, calendar conflicts, booking and replay, reschedule and cancel, config changes, injected failures, model behaviour and failover.",
        ],
      },
      {
        id: "payments",
        label: "No-show deposits",
        title: "Deposits and refunds the AI is never allowed to price.",
        paragraphs: [
          "For the PayPal AI Hackathon I added **refundable PayPal Braintree deposits** against no-shows. A booking gets a pending ledger row and an unguessable pay link; the checkout always reads the amount from the server-side ledger, never from the model.",
          "Refunds follow a fixed rule: cancel **24 hours or more** before the visit and the deposit is refunded automatically; later than that, it’s kept; never paid, the hold is voided. Bookings left unpaid for 120 minutes are released by a sweep that runs every 15 minutes, and the slot opens up again. The AI only explains the outcome.",
          "Staff can also draft a visit bill from their notes. **Gemini only maps the notes to price-list codes; code computes every amount**, anything off the list is flagged, and staff approve before the itemised bill and pay link go out.",
        ],
        block: {
          kind: "table",
          rows: [
            ["≥ 24h before", "Automatic refund (reverseTransaction)"],
            ["< 24h before", "Deposit kept (KEPT_LATE_CANCEL)"],
            ["Never paid", "Hold voided, slot released"],
            ["Payments down", "Booking stands; staff follow up"],
          ],
        },
      },
      {
        id: "limits",
        label: "Known limits",
        title: "What I’d fix before a real clinic used it.",
        paragraphs: [
          "Two customers booking **the exact same slot at the same instant** isn’t fully atomic yet. And it runs on free-tier model quotas, which the failover tiers soften but don’t remove.",
          "Both are listed in the README. Knowing where a system is weak is part of building it.",
        ],
      },
    ],
    links: [
      { label: "Demo video", href: "https://youtu.be/TzSrkGklnqM" },
      { label: "Devpost", href: "https://devpost.com/software/meow-meow-ai-front-desk" },
      { label: "Code", href: "https://github.com/amarabdulrehman/meow-meow-ai-front-desk" },
    ],
  },
  {
    slug: "mtm-planner",
    name: "MTM Planner",
    kicker: "LLM pipeline · Hackathon",
    title: "Messy messages in, |a plan that always adds up.",
    lede: "Built at MTM Version 2.0 (GDGoC CUI Wah). It reads emails, WhatsApp texts and notices in English or Roman Urdu and plans a whole 4-hour hackathon: venue, schedule, food, judging and budget.",
    description:
      "How Amar Abdur Rehman built MTM Planner: one model call reads messages in English or Roman Urdu, and code does every calculation, validates the plan and rejects messages that would break it.",
    facts: [
      ["Event", "MTM Version 2.0, GDGoC CUI Wah"],
      ["Built with", "Node.js · Gemini Flash-Lite"],
      ["Model calls", "1 per update, 5 max"],
      ["Status", "Live demo"],
    ],
    ogTag: "MTM Version 2.0 · GDGoC CUI Wah",
    chapters: [
      {
        id: "problem",
        label: "The job",
        title: "Organisers don’t send specs. They send messages.",
        paragraphs: [
          "An event plan arrives as a pile of emails, WhatsApp texts and notices, some in Roman Urdu. The lunch price changes. A caterer tries to cut the meal count. Someone asks for a DJ nobody approved.",
          "The planner has to turn that into **a venue, a timed schedule, food, judging and a budget that are all valid at once**, and keep them valid as new messages arrive.",
        ],
      },
      {
        id: "pipeline",
        label: "How it works",
        title: "The model only reads. Code does the maths.",
        paragraphs: [
          "**One model call** turns all new messages into typed facts (budget.total, venue.option…) with the sender’s role and date. Everything after that is code: teams, judges needed, headcount, the cheapest venue that seats everyone, a schedule that fills the event exactly, and the budget.",
        ],
        block: {
          kind: "pipeline",
          steps: [
            ["Reading", "1 model call: language → typed facts"],
            ["Fact store", "Code: newest message wins; only the right sender can set a figure"],
            ["Area calls", "Model, only for constraints the facts can’t express; cached per area"],
            ["Planner", "Code: all arithmetic, exact and free"],
            ["Validator", "Code: six checks, or the plan doesn’t ship"],
          ],
        },
        after: [
          "Only when a message adds a constraint the fact keys can’t express (“the venue needs a generator”) does the planner make one extra call, scoped to that area, which returns allowed operations rather than free text.",
        ],
      },
      {
        id: "trust",
        label: "Rejecting bad input",
        title: "A plausible but wrong message gets rejected, with a reason.",
        paragraphs: [
          "Messages are applied one at a time. **If a message makes a passing check fail, it’s rejected**, the previous facts are restored and the reason goes in the trace. The plan on screen is always the last valid one.",
          "An authority check stops the wrong sender changing a figure: a caterer can’t cut the number of meals, and only finance or the organiser can record spending.",
        ],
        block: {
          kind: "grid",
          items: [
            ["Ambiguous numbers", "“Printing is now 6” with no clear unit isn’t applied."],
            ["Increases", "“Eight additional staff” adds to the current figure."],
            ["Conflicts", "Two equal-authority messages that disagree are disclosed, not guessed."],
            ["Prompt injection", "Instructions inside messages are treated as data."],
          ],
        },
      },
      {
        id: "trace",
        label: "Cost & trace",
        title: "Every model call is counted and shown.",
        paragraphs: [
          "A new message costs **one reading call**, plus one call per area only if it adds a new constraint. The limit is five. Every call uses a small Flash-Lite model, with a second key and an older Flash-Lite as fallbacks.",
          "Each call is logged with its model, area, prompt, input, output, token counts and time, and the trace ends with a list of every model used, so a judge can verify the numbers rather than trust them.",
        ],
      },
      {
        id: "after",
        label: "After the event",
        title: "Redesigned so the decision comes first.",
        paragraphs: [
          "After judging I rebuilt the interface. It leads with the **latest decision**, worded from the actual outcome (“Plan updated” with the exact change, or “Message rejected” with the reason), and puts the figures side by side: attendance vs seats, meals vs people, spend vs budget.",
          "An outbox drafts one reply per sender, on the channel they used, including the reason for every rejected message. **Nothing is sent automatically.** It works on phones and at 200% zoom.",
        ],
      },
    ],
    links: [
      { label: "Live demo", href: "https://mtm-planner.vercel.app" },
      { label: "Code", href: "https://github.com/amarabdulrehman/mtm-planner" },
    ],
  },
  {
    slug: "rutool",
    name: "RUTool benchmark",
    kicker: "Research · LLM evaluation",
    title: "Do AI agents act correctly |in Roman Urdu?",
    lede: "Hundreds of millions of people type to businesses the way they speak: “bhai kal wala order cancel kar do”. RUTool measures whether AI agents take the right action on those messages: the right tool, exactly the right arguments, or a question when something is missing.",
    description:
      "RUTool, a benchmark by Amar Abdur Rehman that tests whether AI agents call the right tool with the right arguments when people write in Roman Urdu or Hinglish.",
    facts: [
      ["Type", "Benchmark + paper"],
      ["Built with", "Python · pytest · Groq"],
      ["Scope", "4 domains, 25 tools"],
      ["Status", "Model runs in progress"],
    ],
    ogTag: "Roman Urdu & Hinglish · tool calling",
    chapters: [
      {
        id: "problem",
        label: "The problem",
        title: "“Kal” means yesterday and tomorrow.",
        paragraphs: [
          "Businesses are putting AI agents on WhatsApp and web chat. Their customers write in Roman Urdu and Hinglish, where **“kal” is both yesterday and tomorrow**, “paune do lakh” is 175,000, and lakh and crore replace thousands and millions.",
          "For an agent that can cancel orders or move money, a misread isn’t a bad answer, it’s **a wrong action**. So the benchmark scores actions, not text.",
        ],
      },
      {
        id: "design",
        label: "Design",
        title: "Four behaviours, scored separately.",
        paragraphs: [
          "Cases span **four domains and 25 tools**: an online shop, a clinic, a wallet, and a small-business back office, each tool a JSON Schema with a deterministic mock. Every case expects one of four behaviours.",
        ],
        block: {
          kind: "grid",
          items: [
            ["call", "Call the right tool with exactly the right arguments."],
            ["clarify", "Something’s missing or ambiguous: ask, don’t act."],
            ["refuse", "Someone else’s data, medical advice, fraud, or no tool for it."],
            ["no_call", "Chit-chat: don’t touch a tool."],
          ],
        },
        after: [
          "The phenomena that break agents are tagged and scored on their own: relative dates, sawa / dedh / paune / dhai, lakh and crore, spelling variants, code-mixing, negation, two requests in one message, and references to earlier turns. Paired English controls measure the gap.",
        ],
      },
      {
        id: "scoring",
        label: "Scoring",
        title: "Deterministic scoring, checked against itself.",
        paragraphs: [
          "Arguments are normalised before comparison (1,50,000 = 150000, case, Unicode spaces), and the headline numbers include a **wrong-action rate** (acting when it should have asked or refused) and a hallucinated-argument rate, with 95% confidence intervals resampled by seed.",
          "An oracle self-check answers every case with its own gold answer through the real runner, mocks and scorer, and must score 100%. **195 of 195 cases and all 423 preview variants pass**, and it runs in CI.",
        ],
        block: {
          kind: "stats",
          items: [
            ["25", "tools in 4 domains"],
            ["195", "seed cases"],
            ["390+", "automated tests"],
          ],
        },
      },
      {
        id: "status",
        label: "Where it stands",
        title: "No results until they’re real.",
        paragraphs: [
          "Version 1 evaluates free open models on Groq. **The runs haven’t finished, so the README says “TBD”** and every number in the paper is generated from saved runs, not typed in. One candidate model was dropped after the smoke test because it doesn’t support tool calling.",
          "A literature check found two projects already testing tool calling in Hinglish or Roman Urdu, so the paper **never claims to be first**, and a test enforces that. Seeds were drafted with AI help and approved or edited by a native speaker; the test split stays private to limit contamination.",
          "The announcement post passed **40,000 impressions on LinkedIn**.",
        ],
      },
    ],
    links: [],
  },
];

export const caseStudyBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);
// Each slug above needs a matching folder in src/app/work/<slug>/ (page.tsx + opengraph-image.tsx).
