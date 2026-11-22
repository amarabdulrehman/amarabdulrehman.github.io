import { expect, test } from "@playwright/test";
import { caseStudies } from "../src/lib/case-studies";
import { ordersPerDay, testimonials } from "../src/lib/content";
import { buildSystemPrompt } from "../src/lib/knowledge";
import { matchRole, PRESETS } from "../src/lib/match";

test("home page renders the hero and every nav section", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  for (const id of ["toffeeos", "work", "hackathons", "client-sites", "experience", "stack", "contact"]) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1);
  }
  expect(errors).toEqual([]);
});

test("no stale '200+ orders' claim anywhere on the home page", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).not.toContainText("200+");
  if (!ordersPerDay.value) await expect(page.locator("body")).not.toContainText("30-day avg");
});

test("testimonials section only shows when there are real quotes", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("section#kind-words")).toHaveCount(testimonials.length ? 1 : 0);
});

test("hackathon cards link to their case studies", async ({ page }) => {
  await page.goto("/");
  for (const cs of caseStudies) {
    await expect(page.locator(`#hackathons a[href="/work/${cs.slug}"]`)).toHaveCount(1);
  }
});

for (const path of ["/work/toffeeos", ...caseStudies.map((c) => `/work/${c.slug}`)]) {
  test(`case study ${path} renders with chapters and its own share image`, async ({ page, request }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.locator("main section[id]").count()).toBeGreaterThanOrEqual(4);
    await expect(page.getByRole("navigation", { name: "More case studies" })).toBeVisible();

    const og = await page.locator('meta[property="og:image"]').first().getAttribute("content");
    expect(og).toContain(`${path}/opengraph-image`);
    const img = await request.get(new URL(og!).pathname + (new URL(og!).search ?? ""));
    expect(img.status()).toBe(200);
    expect(img.headers()["content-type"]).toContain("image/png");
  });
}

test("unknown case study is a 404", async ({ request }) => {
  expect((await request.get("/work/does-not-exist")).status()).toBe(404);
});

test("sitemap lists every case study", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const cs of caseStudies) expect(xml).toContain(`/work/${cs.slug}`);
});

test("public pulse always answers with an order figure", async ({ request }) => {
  const res = await request.get("/api/public-pulse");
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(typeof body.orders).toBe("string");
  expect(["live", "static"]).toContain(body.source);
});

test("lead endpoint rejects junk without sending anything", async ({ request }) => {
  const res = await request.post("/api/lead", { data: { lead: { name: "", email: "nope" } } });
  expect([400, 422, 429, 503]).toContain(res.status());
});

// Every page a visitor can land on, including the 15-second recruiter view.
const PAGES = ["/", "/?view=15s", "/work/toffeeos", ...caseStudies.map((c) => `/work/${c.slug}`)];

async function pageText(page: import("@playwright/test").Page, path: string) {
  await page.goto(path);
  if (path.includes("view=15s")) await expect(page.getByText("15-second briefing")).toBeVisible();
  return (await page.locator("body").innerText()) + " " + (await page.content());
}

/** "80+" on its own (not "180+ listings"). */
const STALE_ORDERS = /(?<!\d)80\+/;

for (const path of PAGES) {
  test(`${path}: no "80+" orders claim (the live feed quotes the 30-day avg, e.g. 79)`, async ({ page }) => {
    expect(await pageText(page, path)).not.toMatch(STALE_ORDERS);
  });

  test(`${path}: never says "paying client"`, async ({ page }) => {
    expect((await pageText(page, path)).toLowerCase()).not.toContain("paying client");
  });
}

test('chatbot facts: no "80+", no "paying client", never "solo"', () => {
  const prompt = buildSystemPrompt();
  expect(prompt).not.toMatch(STALE_ORDERS);
  expect(prompt.toLowerCase()).not.toContain("paying client");
  expect(prompt).toContain("~80 orders a day");
  expect(prompt).toContain("It's built and tested, not yet deployed to a client.");
  expect(prompt).toContain("Never say he built anything solo or by himself");
});

test("Role-Fit Matcher counts unused tools and leads AI JDs with agent work", () => {
  const r = matchRole("Automation engineer: build n8n workflows and LLM agents, sync leads into HubSpot, and ship fast with Cursor.");
  expect(r.gaps).toEqual(expect.arrayContaining(["HubSpot", "Cursor"]));
  expect(r.score).toBeLessThan(100);
  expect(r.top.map((p) => p.key)).toEqual(["leaddesk", "meowmeow"]);
  expect(r.pitch).toContain("Lead Desk");
  expect(r.pitch).toContain("Meow Meow");
  for (const p of r.top) expect(p.why.toLowerCase()).not.toContain("solo");

  expect(matchRole("Backend in Go, Ruby on Rails and Salesforce integrations.").gaps).toEqual(
    expect.arrayContaining(["Go", "Ruby / Rails", "Salesforce"]),
  );
  expect(matchRole("You'll go live with customers fast using Python.").gaps).not.toContain("Go");
  expect(matchRole(PRESETS[0].jd).top[0].key).toBe("toffeeos");
});
