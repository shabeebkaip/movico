import { test, expect } from "@playwright/test";

// QA audit guard for the sitewide "Start a Project" CTA sweep (see QA report,
// 2026-08-17). Protects the *current* baseline behavior of every CTA so a
// future fix (header -> /contact, hero -> /contact navigation, footer
// socials, /jobs removal) is a deliberate, visible diff here rather than a
// silent regression. Update the assertions in the same PR that ships each
// fix — do not let this file rot into testing the wrong intent.
//
// Every page under test wraps its content in <main>; the header's global
// "Start a Project" -> /landing CTA lives outside <main>, so scoping to
// <main> is what isolates page-specific CTAs from the sitewide header one.

test.describe("Start a Project CTAs — fixed", () => {
  test("header desktop CTA points at /contact", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const cta = page.locator("header").getByRole("link", { name: "Start a Project", exact: true });
    await expect(cta).toHaveAttribute("href", "/contact");
  });

  test("header mobile CTA points at /contact", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.locator("button.md\\:hidden.text-white").click(); // header hamburger toggle
    // Mobile menu overlay is a sibling of <header>, not inside it — scope to
    // its fixed full-screen container so we don't also match the (visually
    // covered but DOM-present) hero CTA underneath.
    const mobileMenu = page.locator("div.fixed.inset-0.bg-black.z-40");
    const mobileCta = mobileMenu.getByRole("link", { name: "Start a Project", exact: true });
    await expect(mobileCta).toBeVisible();
    await expect(mobileCta).toHaveAttribute("href", "/contact");
  });

  // KNOWN BLOCKER — NOT YET FIXED LIVE: the code-level default for this CTA
  // (src/lib/cms/types.ts + data/content.json) was updated to href: "/contact",
  // but the running site actually serves home.hero content from a MongoDB
  // `cms_settings` document (see src/lib/cms/store.ts readContent(), which
  // deep-merges that doc over defaultContent) that already holds its own
  // persisted override of ctaPrimary.href = "#contact" from a prior admin
  // save. Editing the two files has no effect on the live page until that
  // Mongo document is updated (admin re-save of Home Hero primary CTA, or an
  // explicit, separately-authorized DB write). This assertion intentionally
  // still locks in the OLD/live value so the suite reflects reality — flip
  // it to "/contact" together with fixing the DB record.
  test("homepage hero CTA still scrolls to #contact instead of navigating to /contact (blocked on CMS DB override)", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    // Let the hero's GSAP entrance timeline finish before interacting —
    // clicking mid-animation is unreliable here regardless of this bug.
    await page.waitForTimeout(1500);
    const heroCta = page.getByRole("link", { name: "Start a Project", exact: true }).nth(1); // 0=header, 1=hero
    await expect(heroCta).toHaveAttribute("href", "#contact");
    await heroCta.click();
    await expect(page).toHaveURL(/#contact$/);
    // Homepage is ~13,000px tall; native smooth-scroll to #contact takes
    // several seconds to traverse it — poll the resting scroll position
    // against the section's actual offset rather than a one-shot viewport
    // check, which is flaky mid-scroll.
    await expect
      .poll(
        async () =>
          page.evaluate(() => {
            const el = document.getElementById("contact")!;
            return Math.abs(el.getBoundingClientRect().top);
          }),
        { timeout: 12_000, message: "expected page to come to rest with #contact at the top of the viewport" }
      )
      .toBeLessThan(5);
  });

  test("footer social links (Instagram/LinkedIn/YouTube) are removed, not dead '#' placeholders", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    for (const name of ["Instagram", "LinkedIn", "YouTube"]) {
      await expect(page.locator("footer").getByRole("link", { name })).toHaveCount(0);
    }
  });

  test("footer 'Studio' link points at /studio, not /#about", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const link = page.locator("footer").getByRole("link", { name: "Studio", exact: true });
    await expect(link).toHaveAttribute("href", "/studio");
  });
});

test.describe("Start a Project CTAs — already correct (regression guard)", () => {
  test("services list, projects list/detail, blog, showreel all point at /contact from within <main>", async ({ page }) => {
    const cases: Array<[string, string]> = [
      ["/services", "Start a Project"],
      ["/projects", "Start a Project"],
      ["/projects/aramco-promotional-video", "Start a Project"],
      ["/blog", "Start a Project"],
      ["/showreel", "Start a Project"],
    ];
    for (const [path, label] of cases) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const link = page.locator("main").getByRole("link", { name: label }).first();
      await expect(link).toHaveAttribute("href", "/contact");
    }
  });

  test("showreel video-modal CTA (client-state only, never in static HTML) points at /contact", async ({ page }) => {
    await page.goto("/showreel", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Watch Now" }).click();
    const modalCta = page.locator('a[href="/contact"]', { hasText: "Start a Project" }).last();
    await expect(modalCta).toBeVisible();
    await expect(modalCta).toHaveAttribute("href", "/contact");
  });

  test("service detail CTA reflects the current slug on two different services", async ({ page }) => {
    for (const slug of ["video-production", "event-production"]) {
      await page.goto(`/services/${slug}`, { waitUntil: "domcontentloaded" });
      const link = page.locator("main").getByRole("link", { name: "Start a Project" }).first();
      await expect(link).toHaveAttribute("href", `/contact?service=${slug}`);
    }
  });

  test("Book a Discovery Call still points at /landing (intentional, not part of this fix)", async ({ page }) => {
    await page.goto("/services", { waitUntil: "domcontentloaded" });
    const link = page.getByRole("link", { name: "Book a Discovery Call" });
    await expect(link).toHaveAttribute("href", "/landing");
    await link.click();
    await expect(page).toHaveURL("/landing");
    await expect(page.locator("#booking")).toHaveCount(1);
  });

  test("studio page CTAs resolve to /contact?service=studio and #packages", async ({ page }) => {
    await page.goto("/studio", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("link", { name: "Book a Session" })).toHaveAttribute(
      "href",
      "/contact?service=studio"
    );
    const firstPackageCta = page.getByRole("link", { name: /Book this package/i }).first();
    await expect(firstPackageCta).toHaveAttribute("href", /\/contact\?service=studio&package=\d+/);
  });
});

test.describe("/jobs — removed entirely", () => {
  test("/jobs now 404s (route + components deleted) instead of 500-crashing", async ({ page }) => {
    const res = await page.goto("/jobs");
    expect(res?.status()).toBe(404);
  });

  test("/jobs is not linked from header nav or footer", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator('a[href="/jobs"], a[href^="/jobs#"], a[href^="/jobs?"]')).toHaveCount(0);
  });
});
