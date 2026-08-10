import { test, expect } from "@playwright/test";

// Regression guard for a QA-found Critical bug (M2 video upload swap,
// docs/VIDEO_MIGRATION_PLAN.md): the site's Content-Security-Policy
// `connect-src` in next.config.mjs did not allow `video.bunnycdn.com`, so
// every real-browser TUS upload from the admin "Add Video" panel was
// silently blocked client-side (curl/Node testing never caught this because
// CSP is a browser-enforced header, not a server-side check). The upload
// progress bar froze at 0% indefinitely and orphan zero-byte video records
// piled up in the Bunny library. This test asserts the CSP header itself
// permits the domains the CloudinaryUploader video path needs — it fails
// fast (no real upload/auth/cleanup needed) if the allowlist regresses.
test("CSP connect-src allows the Bunny TUS upload + pull-zone hosts the admin video uploader needs", async ({ request }) => {
  const res = await request.get("/admin/showreel");
  const csp = res.headers()["content-security-policy"] ?? "";
  expect(csp.length).toBeGreaterThan(0);

  const connectSrc = csp.split(";").find((d) => d.trim().startsWith("connect-src")) ?? "";
  expect(connectSrc).toContain("video.bunnycdn.com");
});
