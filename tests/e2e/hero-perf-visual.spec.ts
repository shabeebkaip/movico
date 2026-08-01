import { test, expect } from "@playwright/test";

// Guards the T4.3/T4.4/T4.5 LCP-chasing changes:
// - HeroSection entrance tweens no longer set opacity:0 (text must never
//   be invisible even if JS fails to run — a11y/no-JS safety net).
// - Satoshi stylesheet loads via non-blocking preload+swap, so the
//   fontFamily the CSS declares should still be "Satoshi".
// - CinematicAtmosphere dropped "use client" — its markup must be present
//   in the raw server HTML (not injected only after hydration).

test("hero text is never invisible even before GSAP mounts (no opacity:0 flash)", async ({ page }) => {
  // Block gsap so the entrance timeline never runs — simulates a JS failure
  // or a very slow hydration — the removed `opacity: 0` tweens mean the
  // text must still render at full opacity from plain CSS/DOM defaults.
  await page.route("**/gsap*", (route) => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const opacity = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    return h1 ? getComputedStyle(h1).opacity : null;
  });
  expect(opacity).toBe("1");
});

test("hero headline is visible immediately in server-rendered markup", async ({ page }) => {
  const res = await page.goto("/", { waitUntil: "domcontentloaded" });
  expect(res?.ok()).toBe(true);
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("h1")).toHaveCSS("opacity", "1");
});

test("Satoshi font-family is declared on the display heading (async loader applies CSS)", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const fontFamily = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    return h1 ? getComputedStyle(h1).fontFamily : null;
  });
  expect(fontFamily).toContain("Satoshi");
});

test("CinematicAtmosphere (grain + orbs) is present in the initial server HTML", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(html).toContain("cinema-grain");
  expect(html).toContain("orb-amber");
  expect(html).toContain("orb-indigo");
});

test("hero video autoplays, is muted, and advances over time", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  // preload="metadata" (no document-level preload link) means the browser
  // fetches enough to start playback but not instantly — give it a beat.
  await page.waitForFunction(() => {
    const v = document.querySelector("video") as HTMLVideoElement | null;
    return !!v && !v.paused;
  }, { timeout: 8000 });
  const first = await page.evaluate(() => {
    const v = document.querySelector("video") as HTMLVideoElement;
    return { muted: v.muted, loop: v.loop, paused: v.paused, t: v.currentTime };
  });
  expect(first.muted).toBe(true);
  expect(first.loop).toBe(true);
  expect(first.paused).toBe(false);

  await page.waitForTimeout(1000);
  const t2 = await page.evaluate(() => (document.querySelector("video") as HTMLVideoElement).currentTime);
  expect(t2).toBeGreaterThan(first.t);
});
