import { test, expect } from "@playwright/test";

// Guards the homepage performance remediation (PROJECT_PLAN.md M1/M2/M3):
// only the hero video should fetch on cold load, WorkShowcase videos must
// defer until scrolled into view, the CTA section must never request a
// video, and client logos must render without broken images.

test("cold load requests exactly one video (hero), no others", async ({ page }) => {
  const mp4Requests: string[] = [];
  page.on("request", (req) => {
    if (req.url().includes(".mp4")) mp4Requests.push(req.url());
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  expect(mp4Requests.length).toBe(1);
});

test("WorkShowcase video defers until scrolled into view, then autoplays", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);

  // Before scroll: no <video> in #work should have a src yet.
  const beforeSrcs = await page.evaluate(() =>
    Array.from(document.querySelectorAll("#work video")).map((v) => (v as HTMLVideoElement).currentSrc)
  );
  expect(beforeSrcs.every((s) => s === "")).toBe(true);

  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const first = await page.evaluate(() => {
    const v = document.querySelector("#work video") as HTMLVideoElement | null;
    return v ? { hasSrc: !!v.currentSrc, paused: v.paused, t: v.currentTime } : null;
  });
  expect(first?.hasSrc).toBe(true);
  expect(first?.paused).toBe(false);

  await page.waitForTimeout(800);
  const second = await page.evaluate(() => {
    const v = document.querySelector("#work video") as HTMLVideoElement;
    return v.currentTime;
  });
  expect(second).toBeGreaterThan(first!.t);
});

test("CTA section never requests a video and renders its still image", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);

  // Jump straight to #contact so only its own observers can fire.
  await page.evaluate(() => {
    const el = document.querySelector("#contact")!;
    window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - 100);
  });
  await page.waitForTimeout(1500);

  // The core acceptance criterion: the CTA section has zero <video>
  // elements at all — it was fully replaced by a static image.
  const ctaVideoCount = await page.evaluate(() => document.querySelectorAll("#contact video").length);
  expect(ctaVideoCount).toBe(0);

  const img = await page.evaluate(() => {
    const el = document.querySelector("#contact img") as HTMLImageElement | null;
    return el ? { complete: el.complete, naturalWidth: el.naturalWidth } : null;
  });
  expect(img?.complete).toBe(true);
  expect(img?.naturalWidth).toBeGreaterThan(0);
});

test("client logos render with no broken images", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: "Brands That Trust Us" }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const broken = await page.evaluate(() =>
    Array.from(document.querySelectorAll("img")).filter(
      (i) => i.complete && i.naturalWidth === 0
    ).length
  );
  expect(broken).toBe(0);

  const logoCount = await page.evaluate(
    () => document.querySelectorAll('section img, section [style*="mix-blend-mode"]').length
  );
  expect(logoCount).toBeGreaterThan(0);
});
