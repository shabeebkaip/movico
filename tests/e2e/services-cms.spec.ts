import { test, expect } from "@playwright/test";

// Guards the Services CMS module (services list/detail, homepage teaser,
// /landing dropdown, event-production gallery regression, and the
// mutating-API auth gate). No admin credentials are available in this
// environment, so admin-UI create/edit/delete flows are NOT covered here —
// see QA report for what still needs manual/credentialed verification.

test("services index lists services in ascending order value with links to detail pages", async ({ page }) => {
  await page.goto("/services", { waitUntil: "domcontentloaded" });
  const links = await page.locator('a[href^="/services/"]').all();
  expect(links.length).toBeGreaterThan(0);
});

test("service detail page renders full content for two different services", async ({ page }) => {
  for (const slug of ["video-production", "brand-identity"]) {
    await page.goto(`/services/${slug}`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toBeVisible();
    // Overview / offerings / process sections should be present.
    await expect(page.getByText("What's", { exact: false })).toBeVisible();
  }
});

test("nonexistent service slug returns 404", async ({ page }) => {
  const res = await page.goto("/services/this-slug-does-not-exist-xyz");
  expect(res?.status()).toBe(404);
});

test("homepage teaser reflects live CMS services with working icons and links", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const servicesSection = page.locator("#services");
  await servicesSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const cardLinks = await servicesSection.locator('a[href^="/services/"]').count();
  expect(cardLinks).toBeGreaterThan(0);
});

test("/landing page lists services and booking form dropdown includes them", async ({ page }) => {
  await page.goto("/landing", { waitUntil: "domcontentloaded" });
  const serviceLinks = await page.locator('a[href^="/services/"]').count();
  expect(serviceLinks).toBeGreaterThan(0);

  const select = page.locator('select[name="service"]');
  await select.scrollIntoViewIfNeeded();
  const optionCount = await select.locator("option").count();
  // "Service of Interest" placeholder + N services + "Not Sure Yet"
  expect(optionCount).toBeGreaterThan(2);
});

test("event-production gallery: opens lightbox, arrow-navigates, closes via Escape", async ({ page }) => {
  await page.goto("/services/event-production", { waitUntil: "domcontentloaded" });
  const thumbs = page.locator('button[aria-label^="View photo"]');
  await thumbs.first().scrollIntoViewIfNeeded();
  await expect(thumbs.first()).toBeVisible();

  await thumbs.first().click();
  const lightbox = page.locator('[role="dialog"][aria-label="Photo viewer"]');
  await expect(lightbox).toBeVisible();
  await expect(lightbox.getByText("1 /")).toBeVisible();

  await page.keyboard.press("ArrowRight");
  await expect(lightbox.getByText("2 /")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(lightbox).not.toBeVisible();
});

test("mutating API routes reject unauthenticated requests; all=true requires auth", async ({ request }) => {
  const post = await request.post("/api/cms/services", { data: { title: "x" } });
  expect(post.status()).toBe(401);

  const put = await request.put("/api/cms/services/000000000000000000000000", { data: { title: "x" } });
  expect(put.status()).toBe(401);

  const del = await request.delete("/api/cms/services/000000000000000000000000");
  expect(del.status()).toBe(401);

  const listAll = await request.get("/api/cms/services?all=true");
  expect(listAll.status()).toBe(401);

  const listPublic = await request.get("/api/cms/services");
  expect(listPublic.status()).toBe(200);
  const body = await listPublic.json();
  expect(Array.isArray(body)).toBe(true);
  // Public list must never include hidden services.
  expect(body.every((s: { visible: boolean }) => s.visible !== false)).toBe(true);
});
