import { test, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// End-to-end M2 quality-gate verification (docs/VIDEO_MIGRATION_PLAN.md M2):
// real-browser login -> /admin/showreel -> "Add Video" -> upload a real MP4
// to Bunny via TUS -> confirm progress bar animates -> confirm Save is
// disabled while uploading and enabled once done -> save -> confirm the new
// card appears in the grid with a working (non-broken) thumbnail image and
// a "Bunny" source badge.
//
// Requires ADMIN_EMAIL / ADMIN_PASSWORD env vars (a real cms_users account —
// see docs/VIDEO_MIGRATION_PLAN.md for how the admin auth flow works). The
// uploaded test video is deleted from the UI at the end of the test so no
// junk record/CDN asset is left behind.
const ADMIN_EMAIL = process.env.QA_ADMIN_EMAIL ?? "admin@movico.com";
const ADMIN_PASSWORD = process.env.QA_ADMIN_PASSWORD;

test.skip(!ADMIN_PASSWORD, "QA_ADMIN_PASSWORD not set — skipping live admin upload test");

test("admin can upload a real video to Bunny end-to-end and see it in the showreel grid", async ({ page }) => {
  test.setTimeout(150_000); // real live Bunny upload + encode wait, longer than the suite default
  // 1. Log in
  await page.goto("/admin/login");
  await page.getByPlaceholder("admin@movico.com").fill(ADMIN_EMAIL);
  await page.getByPlaceholder(/•/).fill(ADMIN_PASSWORD!);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL("**/admin");

  // 2. Navigate to showreel panel
  await page.goto("/admin/showreel");
  await page.getByRole("button", { name: /add video/i }).click();

  const title = `QA Upload Test ${Date.now()}`;
  await page.getByPlaceholder("e.g. ESPORTS 2025").fill(title);

  // 3. Trigger the video file picker (first "Click to upload video" dropzone)
  const videoDropzone = page.getByText("Click to upload video");
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    videoDropzone.click(),
  ]);
  await fileChooser.setFiles(path.join(__dirname, "../fixtures/qa-test-video.mp4"));

  // 4. Progress bar appears while uploading
  await expect(page.getByText(/Uploading… \d+%/)).toBeVisible({ timeout: 10_000 });

  // 5. Save must be disabled/relabelled while the upload is in flight
  const saveButton = page.getByRole("button", { name: /Save Video|Uploading video…/ });
  await expect(saveButton).toBeDisabled();

  // 6. Wait for upload to finish (Bunny TUS + polling can take a little while
  // for real network I/O — generous timeout, this is a real live upload).
  await expect(page.getByText("Uploaded successfully")).toBeVisible({ timeout: 60_000 });
  await expect(saveButton).toBeEnabled();
  await expect(saveButton).toHaveText(/Save Video/);

  // 7. Save the record
  await saveButton.click();
  await expect(page.getByText(title)).toBeVisible({ timeout: 10_000 });

  // 8+9 run in try/finally: this test currently reproduces a real bug (see
  // VIDEO_MIGRATION_PLAN.md M2 QA verdict) and is expected to keep failing
  // until fixed — a failing assertion here must not skip cleanup and leave a
  // junk record/CDN asset behind on every run.
  try {
    // Confirm the new card shows a Bunny source badge and a real (non-broken)
    // thumbnail image, not the "No preview" placeholder.
    const card = page.locator("div.group", { hasText: title }).first();
    await expect(card.getByText("Bunny", { exact: true })).toBeVisible();
    // Bunny needs a little time after the TUS upload finishes to encode and
    // generate thumbnail.jpg; a card that never gets past "No preview" (imgFailed
    // permanently true, no retry) is the real bug we're guarding against here —
    // not the brief window before the image finishes decoding in the browser.
    const thumb = card.locator("img");
    await expect(thumb).toBeVisible({ timeout: 90_000 });
    await expect
      .poll(async () => thumb.evaluate((img: HTMLImageElement) => img.naturalWidth), {
        timeout: 90_000,
        message: "thumbnail <img> never finished loading a real image (stuck broken/pending)",
      })
      .toBeGreaterThan(0);
  } finally {
    // Cleanup — delete the test record via the UI so no junk is left behind,
    // regardless of whether the assertions above passed.
    const card = page.locator("div.group", { hasText: title }).first();
    page.once("dialog", (dialog) => dialog.accept());
    await card.hover();
    await card.getByRole("button").last().click(); // trash icon is the last action button
    await expect(page.getByText(title)).not.toBeVisible({ timeout: 10_000 });
  }
});
