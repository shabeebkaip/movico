# PROJECT PLAN — Video Hosting Migration: Cloudinary → Bunny Stream

_Last updated: 2026-08-10 · Owner: project-manager · Status: **M4 QA GATE = FAIL. Cloudinary video still served live on multiple public surfaces — cutover is NOT done.** All 5 decisions resolved; Bunny credentials provisioned. T0.2, T0.3, T1.1, T1.2, T2.1, T2.3 DONE. **T4.1 DONE + VERIFIED** — all 27 `cms_videos` records migrated (each has `bunnyVideoId`, Cloudinary pointers retained as cold backup). **T4.2 DONE but INSUFFICIENT:** it fixed the code-level source defaults (`defaultContent` in `types.ts`, static `projects-data.ts`/`defaultProjects.ts`), but those defaults are **dead in production** — the live Mongo records override them (see below). **M4 QA (2026-08-10) FAILed with 3 live bugs — Cloudinary video confirmed serving in a real browser on: (1) homepage hero + CTA, (2) the entire `/showreel` page, (3) 3 of 7 project pages.** Root causes are two un-migrated **live Mongo documents/collections** plus one **never-wired frontend** (M3's T3.1/T3.2, confirmed NOT done — T4.1 did not cover them). **M3 is NOT started** — `VideoGallery.tsx` and `WorkShowcase.tsx` have zero `bunnyVideoId` references; no public component consumes Bunny yet. **Human's hardened directive (2026-08-10):** "no videos should be in cloudinary directly, cloudinary act as backup... hero, projects and showreel, bunny is the primary source" → target is now **0 live Cloudinary video requests on EVERY surface**, verified across hero/CTA/showreel(gallery+modal+featured)/WorkShowcase/every project page — not just the 3 spot-checked. New/re-scoped work below: **T4.3** (migrate live `cms_settings/content` doc), **T4.4** (migrate live `cms_projects` collection), **T3.1/T3.2** (wire `VideoGallery.tsx` + `WorkShowcase.tsx` to Bunny). **M2 still OPEN** (unchanged): 4th bug fix code-complete, final live-browser re-verify (`tests/e2e/admin-bunny-video-upload.spec.ts`) blocked on owner rotating the CMS credential — orthogonal to this M3/M4 work, does not block it. Next: T4.3 + T4.4 (backend-developer, data migration — safe, same low-risk pattern as T4.1) in parallel with T3.1/T3.2 (frontend-developer, wiring), then re-run the M4 QA gate across ALL surfaces._

> **Filename note:** the canonical `docs/PROJECT_PLAN.md` holds a separate plan
> ("Homepage Performance Remediation"), now **PAUSED** until this migration ships
> (resolved decision 5). This migration plan lives in its own file.

---

## Objective

Move all **video** hosting and delivery off Cloudinary (free plan, 25 credits/mo,
already 44% burned pre-launch — will exceed the free tier and force a $99+/mo jump)
onto **Bunny Stream** (bundled encoding + CDN + player, ~$0.005/GB storage +
~$0.01/GB delivery, $1/mo minimum, no credit-burn model). Cloudinary is retained
for **images only**, and — per resolved decision 1 — as an **untouched cold
archive** of the original video masters (storage-only, no delivery/transform, so
~zero credit cost). Done means: every video on the public site and in the admin
uploads to, and streams from, Bunny; no runtime code path constructs a Cloudinary
video delivery/transform URL; and monthly Cloudinary credit consumption flatlines.
We'll know it works when all homepage/showreel/project videos play from
`*.b-cdn.net`, admins can upload a new video end-to-end, and the Cloudinary
dashboard shows zero new video delivery.

## Users & success criteria

- **Site visitors** — hero, showreel, work-showcase, CTA, and project videos play
  smoothly with no broken embeds.
- **Movico admins** — can upload/replace videos from `/admin` with a progress bar,
  same as today, and see them appear on the site.
- **Owner (you)** — Cloudinary video spend stops; Bunny spend is predictable.

Acceptance criteria (measurable):
1. **0 live Cloudinary video requests on the running site**, verified in a real browser's network tab (not just source grep) on **every** video surface: homepage **hero**, homepage **CTA**, homepage **WorkShowcase** (marquee/showcase grid), **`/showreel`** (all three call sites — hover-preview cards, the play modal, and the featured/hero background), and **every one of the 7 `/projects/[slug]` detail pages**. "0" means literally zero requests to `res.cloudinary.com/.../video/...` across that full list — the M4 QA FAIL (2026-08-10) failed exactly because 3 of these surfaces were never checked before and were still on Cloudinary. Re-verify the WHOLE list after T3.1/T3.2/T4.3/T4.4 land, not just the previously-broken surfaces.
2. Every existing `CMSVideo` document plays from Bunny (count migrated = count total; 27 records — T0.3). **✅ done (T4.1).**
3. An admin can upload a new video and it plays on `/showreel` from Bunny within one page revalidation.
4. Cloudinary "Video" bandwidth/transformations for the following 7 days = ~0.
5. Thumbnails and hover-preview loops render from Bunny for every video (no broken poster images), on every surface in AC #1.
6. **No runtime code path constructs a Cloudinary video delivery/transform URL** — grep for any `res.cloudinary.com` video reference in shipped runtime code (not just data/config "primary" flags) returns 0 after M5. (The idle archived masters in Cloudinary are the ONLY acceptable remaining Cloudinary video presence, and nothing may request them.) **Note:** grep-clean source is necessary but NOT sufficient — AC #1's live-browser check is the real gate, because the live-Mongo override bug (T4.3/T4.4) makes source defaults dead code that a grep would falsely pass.

## Scope

**In scope:** all video upload, storage, delivery, playback, and thumbnail
generation for public site + admin CMS; migration of existing video records
**and the live CMS content/project documents that override them**; retirement of
Cloudinary video **code paths**.

**Out of scope (explicit — do not creep):**
- Image hosting stays on Cloudinary. No image migration in this effort (resolved decision 4).
- The separate homepage performance remediation plan (its own doc; paused).
- Redesigning the admin UI beyond swapping the uploader/delivery internals.
- Bunny iframe player / HLS + hls.js — not used; MP4 renditions only (resolved decisions 2 & 3).
- **Deleting the Cloudinary source video masters — explicitly NOT done.** They stay
  as an untouched cold backup/archive (storage-only, no delivery/transform traffic,
  ~zero credit cost). See resolved decision 1 and M5.

## Architecture summary

Today: admin uploads go client-side to a Cloudinary signed endpoint
(`/api/cms/upload/signature` → direct `POST api.cloudinary.com`), records land in
Mongo (`cms_videos`) with `cloudinaryVideoPublicId` / `cloudinaryVideoUrl`, and
playback uses raw `<video>` tags whose URLs are rewritten at render time by
`src/lib/video-delivery.ts` (`cloudinaryVideoDelivery`) to cap resolution/bandwidth;
thumbnails are built by `cloudinaryVideoThumb` in `src/lib/cloudinary.ts`. Target:
a **Bunny Stream Video Library** (Library ID 721681 "Movico", free tier). Uploads
become create-video-then-upload (TUS resumable for large files) via a new server
route; records store a `bunnyVideoId` (GUID) and we derive all URLs from it. Per
resolved decisions 2 & 3, playback stays raw `<video autoplay muted loop>` using
**fixed MP4 renditions per surface** — `play_480p.mp4` for hover cards,
`play_1080p.mp4` for hero/full-width — a 1:1 port of the existing
resolution-capping logic, **no iframe player and no hls.js**. Thumbnail
(`.../{guid}/thumbnail.jpg`) and animated preview (`.../{guid}/preview.webp`).
The existing `cloudinaryVideoPublicId` / `cloudinaryVideoUrl` fields are **retained
in each record** as backup pointers to the cold archive (not purged).

**⚠️ Data-source subtlety that caused the M4 FAIL (know this before touching M3/M4):**
video URLs reach the public pages from **three independent stores**, and migrating
one does not migrate the others:
- **`cms_videos`** (Mongo) → `/showreel` via `listVideos()`. **Migrated (T4.1).**
- **`cms_settings/content`** (Mongo, `_id: "content"`) → homepage **hero + CTA** via
  `readContent()`. `readContent()` does `deepMerge(defaultContent, mongoDoc)` and
  **the Mongo doc wins**, so T4.2's fix to `defaultContent` is dead code whenever
  this doc exists (it does — it's written every time an admin saves homepage
  content). **NOT migrated → T4.3.**
- **`cms_projects`** (Mongo) → homepage `WorkShowcase` and `/projects/[slug]` via
  `listProjects()` / `getCMSProject()`, which win over the static `projects-data.ts`
  fallback (`cms.length > 0 ? cms : PROJECTS`, and `getCMSProject(slug) ?? getStaticProject(slug)`).
  Same override bug, different collection. **NOT migrated → T4.4.**

Fixing the data (T4.3/T4.4) is necessary but not enough on its own: the frontend
components must also *prefer* `bunnyVideoId` and build Bunny URLs (T3.1/T3.2) —
otherwise a migrated record with a `bunnyVideoId` set is still ignored by a
component that only ever reads `cloudinaryVideoUrl`.

---

## Milestones

Each is independently demoable.

### M0 — Account, credentials & spike (de-risk first) — _✅ DONE (T0.1, T0.2, T0.3)_
Prove one video can be uploaded to Bunny and played back in the real app before
touching production code paths.

### M1 — Data model + delivery helpers — _✅ DONE_
Schema + client-safe URL helpers for Bunny, with Cloudinary paths still working
(additive, no cutover yet).

### M2 — Upload flow swap — _CODE-COMPLETE, QA gate OPEN (orthogonal to M3/M4 — does not block them)_
Admin uploads new videos to Bunny.

### M3 — Playback + thumbnail swap — _NOT STARTED (confirmed 2026-08-10; T4.1 did NOT cover this)_
Public site renders video from Bunny. **This is the frontend half of the M4 FAIL
fix** — no public component consumes `bunnyVideoId` today.

### M4 — Data migration of existing videos — _QA GATE = FAIL (2026-08-10). T4.1 done; T4.2 done-but-insufficient; T4.3/T4.4 added._
Every existing Cloudinary video record — **including the live CMS content and
project documents** — gets a Bunny equivalent. Cloudinary pointers are **retained**
on each record as cold-backup metadata.

### M5 — Cutover, cleanup & verification
Remove Cloudinary video **code paths**, flip hardcoded URLs, verify credit-burn
stops, and confirm nothing can request the archived Cloudinary masters. Masters
are left in place as cold backup — NOT deleted.

---

## Task breakdown

### M0 — Account, credentials & spike
- **T0.1 — [devops-engineer]** — ✅ **DONE.** Bunny account + Video Library provisioned. `BUNNY_STREAM_LIBRARY_ID` (721681, "Movico", regions Frankfurt/Main + LA/NY/Singapore, free tier), `BUNNY_STREAM_API_KEY`, `BUNNY_STREAM_PULL_ZONE` all set in `.env.local`. _Remaining sub-item: mirror these into Vercel env before deploy (devops, at M5)._
- **T0.2 — [backend-developer]** — ✅ **DONE (2026-08-06).** Throwaway spike against the live API (not embedded in a scratch page — verified via curl transcript, which is more reliable evidence for a headless CLI environment): created a video, uploaded via direct PUT (chosen over TUS — see contract section for rationale), polled to Finished, fetched MP4/thumbnail/preview URLs, deleted the spike video. **AC met:** exact endpoints, direct-PUT auth/headers, MP4/thumbnail/preview URL patterns, and processing time all captured in the "API contract" section below, plus two new findings (Content-Type required on PUT; pull zone requires non-empty Referer header) and a risk (renditions depend on source resolution, may not always have 1080p). **Depends on:** T0.1 (done).
- **T0.3 — [backend-developer]** — ✅ **DONE (2026-08-06).** Ran a throwaway `tsx` script (deleted after, not shipped) against the real `cms_videos` collection using the URI from `.env.local`'s `MONGODB_URI` — same connection string `src/lib/cms/db.ts` uses (couldn't import `db.ts` directly, its `import 'server-only'` isn't resolvable outside the Next.js build; the script opened its own `MongoClient` with the identical URI instead, no new credentials). **`db.cms_videos.countDocuments()` = 27.** All 27 docs have `cloudinaryVideoPublicId`/`cloudinaryVideoUrl` set (`{ cloudinaryVideoPublicId: { $exists: true, $ne: null } }` also counts 27); **0 currently have `bunnyVideoId` set** (expected — T1.1 added the field, nothing's migrated yet). Sample shape (10 docs pulled, all identical shape): `{ _id, title, client, category, isHighlight, order, source: "cloudinary", driveId, thumbnail: null, createdAt, cloudinaryVideoPublicId, cloudinaryVideoUrl }` — **no resolution/dimension field exists on any doc** (not `width`/`height`/`resolution`, nothing); risk #4 (renditions may not exist below 1080p/480p) **cannot be checked from Mongo data alone and must be verified per-video at migration time (T4.1)**, e.g. by inspecting the Cloudinary asset or checking Bunny's `availableResolutions` after each re-upload. `thumbnail` is `null` on every sampled doc — posters are being derived from `cloudinaryVideoPublicId` at render time (`cloudinaryVideoThumb` in `src/lib/cloudinary.ts`), not stored.
  Grepped the whole `src` tree for `res.cloudinary.com` and filtered to video-related hits (full list of every hardcoded literal Cloudinary *video* URL, file:line — helper functions that build URLs from a variable `publicId`, like `cloudinaryVideoThumb`/`cloudinaryVideoDelivery`, are separate runtime code paths tracked for T5.1, not hardcoded URLs, so excluded here):
  - `src/lib/cms/types.ts:463` — `defaultContent.hero.videoUrl` → `.../movico/videos/6a0eaff5ac6acf2f293bacb8.mp4`
  - `src/lib/cms/types.ts:465` — `defaultContent.hero.posterUrl` → `.../movico/videos/6a0eaff5ac6acf2f293bacb8.jpg` (poster derived from the same video asset)
  - `src/lib/cms/types.ts:714` — `defaultContent.cta.videoUrl` → `.../movico/videos/6a0eaff5ac6acf2f293bacb8.mp4`
  - `src/lib/projects-data.ts:100` — project `video` field → `.../movico/videos/6a0eaff4ac6acf2f293bacb3.mp4`
  - `src/lib/projects-data.ts:117` — project `video` field → `.../movico/videos/6a0eaff4ac6acf2f293bacb5.mp4`
  - `src/lib/projects-data.ts:150` — project `video` field → `.../movico/videos/6a0eaff5ac6acf2f293bacb7.mp4`
  - `src/app/admin/(dashboard)/content/projects/defaultProjects.ts:80` — `video` field → `.../movico/videos/6a0eaff4ac6acf2f293bacb3.mp4`
  - `src/app/admin/(dashboard)/content/projects/defaultProjects.ts:99` — `video` field → `.../movico/videos/6a0eaff4ac6acf2f293bacb5.mp4`
  - `src/app/admin/(dashboard)/content/projects/defaultProjects.ts:136` — `video` field → `.../movico/videos/6a0eaff5ac6acf2f293bacb7.mp4`
  - `src/components/home/CTASection.tsx:17` — hardcoded poster constant → `.../movico/videos/6a0eaff5ac6acf2f293bacb8.jpg`
  - `src/components/home/ShowReel.tsx:11` — fallback video src constant → `.../movico/videos/6a0eaff5ac6acf2f293bacb8.mp4`
  - `src/components/home/ShowReel.tsx:118` — `<source>`/`<video src>` JSX attribute (same URL as line 11) → `.../movico/videos/6a0eaff5ac6acf2f293bacb8.mp4`
  - `src/components/home/FeaturedProject.tsx:70` — video `src` JSX attribute → `.../movico/videos/6a0eaff4ac6acf2f293bacb3.mp4`
  `src/lib/showreel-data.ts` has **zero** hardcoded Cloudinary URLs (checked, no match) — it's populated from the CMS at runtime, not defaults. **AC met:** exact count (27) + every hardcoded video URL location recorded above, feeds M4 sizing (27 records to migrate) and M4.2 (12 hardcoded-URL locations across 6 files to flip). **Note for T4.2:** the 13 lines above collapse to **6 distinct Cloudinary video public IDs** (`...bacb8`, `...bacb3`, `...bacb5`, `...bacb7`, plus the two `.jpg` posters derived from `...bacb8`) — several of these public IDs almost certainly correspond to the same source master as one of the 27 `CMSVideo` records, so T4.2 should map each hardcoded public ID to its migrated Bunny guid rather than re-uploading it a second time. **⚠️ Retrospective note (2026-08-10):** T0.3 enumerated only the **source-code** hardcoded URLs. It did NOT audit the **live Mongo documents** (`cms_settings/content`, `cms_projects`) that override those source defaults at runtime — that gap is exactly what let the M4 QA FAIL slip through. T4.3/T4.4 close it. **Depends on:** none.

### M1 — Data model + delivery helpers
- **T1.1 — [backend-developer]** — ✅ **DONE (2026-08-06).** Added `bunnyVideoId?: string` to `CMSVideo` (`src/lib/cms/videos.ts`) and `VideoItem` (`src/lib/showreel-data.ts`), alongside the existing Cloudinary fields (untouched). No consumers needed updating — the field is optional and unused so far, purely additive. **AC met:** `npx tsc --noEmit` passes with zero errors (whole project, not just the two touched files); no data migration run; no Cloudinary code path touched. **Depends on:** T0.2 (done).
- **T1.2 — [backend-developer]** — ✅ **DONE (2026-08-06).** New file `src/lib/bunny-video.ts` — three pure, client-safe functions (`bunnyVideoUrl(bunnyVideoId, pullZone, resolution)`, `bunnyThumbnailUrl`, `bunnyPreviewUrl`). Pull zone hostname is passed as a plain argument rather than read from env inside the module (it's a public CDN domain, not a secret — callers on the server read `process.env.BUNNY_STREAM_PULL_ZONE` and pass it through). `cloudinaryVideoDelivery` untouched. **AC met:** manually asserted URL shapes against the real T0.2 guid/pull-zone via `npx tsx -e "..."` (no test framework exists in this repo — grepped, zero `*.test.*`/`*.spec.*` files anywhere in `src`, so this matches existing convention rather than introducing one for 3 template-string functions); no `server-only`, no secrets imported. **Depends on:** T0.2 (done).
- **Quality gate M1:** dev self-test (tsc/lint) → [qa-engineer] verifies helpers return correct URLs for both new-Bunny and legacy-Cloudinary records → [code-reviewer] approves diff.

### M2 — Upload flow swap
- **T2.1 — [backend-developer]** — ✅ **DONE (2026-08-06).** New server route `src/app/api/cms/upload/bunny/route.ts` (`POST`, modeled on `upload/signature/route.ts`'s auth pattern). Issues short-lived (1hr), single-video-scoped **TUS** upload credentials — no file bytes touch our server, and the raw `BUNNY_STREAM_API_KEY` never leaves the server. See "API contract" section below for the exact confirmed TUS signature scheme and full request/response shape. **AC met:** unauthorised → `401`; authorised → `200` with real Bunny credentials; did a **full live TUS upload** with the returned credentials (creation POST → `201` + `Location`, PATCH with the file bytes → `204`, offset matched file size) and polled the video to `status: 4` (Finished) — proves the signature is genuinely valid end-to-end, not just shaped correctly. Spike video deleted after (cleanup, same discipline as T0.2). **Depends on:** T0.2, T1.1 (done).
- **T2.2 — [frontend-developer]** — ✅ **DONE (2026-08-06).** Updated `src/components/cms/CloudinaryUploader.tsx` — image path untouched byte-for-byte; video path (`resourceType === "video"`) now calls `POST /api/cms/upload/bunny` for credentials, then uploads via `tus-js-client`'s `Upload` class (added as a new dependency — not hand-rolled) with `headers: { AuthorizationSignature, AuthorizationExpire, VideoId, LibraryId }` (sent on every TUS request automatically by the library, matching T2.1's PATCH-must-repeat-headers finding) and `metadata: { filetype, title }`, wiring `onProgress` into the same existing progress-bar UI (`onError`/`onSuccess` drive the same `status` state machine as the Cloudinary XHR path). On success emits `{ url, publicId, bunnyVideoId, thumbnailUrl }` — `url`/`thumbnailUrl` are built client-side via `bunny-video.ts` from a `pullZone` value the upload route now also returns (small additive change to that route's JSON response; pull zone is a public CDN hostname, not a secret, per T1.2's own comment). `src/app/admin/(dashboard)/showreel/page.tsx`'s `VideoPanel` writes `bunnyVideoId` and clears `cloudinaryVideoUrl`/`cloudinaryVideoPublicId` on new video upload (no dual-write, resolved decision 1), and auto-fills the `thumbnail` field from the Bunny thumbnail if the admin hasn't set a custom one, so the admin grid shows a working preview immediately with no public-playback (M3) change needed. Source badge now distinguishes Bunny vs Cloudinary records. `ProjectForm.tsx` has no video upload path — nothing to change. Other `CloudinaryUploader` video callers (`content/page.tsx` hero/CTA background video, `media/page.tsx` media library) needed **zero code changes** — they only ever consumed the generic `url`/`publicId` fields, now populated from Bunny transparently. **AC met:** build/typecheck/lint all pass (one pre-existing, unrelated lint-config issue — `@next/next/no-img-element` rule not found — reproduced identically on `git stash`, not introduced here). Live end-to-end verified via the exact request contract the component sends (no browser tool available in this environment, see NOT TESTED): authenticated `POST /api/cms/upload/bunny` returned the full credential contract incl. `pullZone`; a real TUS upload using the project's own `tus-js-client` dependency completed against live Bunny, video reached `status: 4` Finished; `thumbnail.jpg` and `play_240p.mp4` (only rendition available for the tiny test source) resolved `200` from the pull zone; `POST /api/cms/videos` persisted `bunnyVideoId`, `GET /api/cms/videos` round-tripped it correctly. All 3 test videos deleted from Bunny afterward, Mongo test record deleted. **NOT TESTED:** literal browser click-through of the "Add Video" panel (file picker, live progress-bar animation, toast/save UX) — verified only via API-level replication of the identical request contract, not a rendered browser session; qa-engineer should do a real click-through. **Known pre-existing risk, unchanged by this task (see T0.2):** Bunny renditions depend on source resolution — a source narrower than 1080p/480p will 404 on `play_1080p.mp4`/`play_480p.mp4`; not addressed here, tracked for T3.1. **Depends on:** T2.1 (done).
  - **T2.2 QA addendum (2026-08-06) — 3 bugs found by real-browser (Playwright) testing, all fixed same day:**
    1. **Critical — CSP blocked every upload.** `next.config.mjs`'s `connect-src` never allowed `https://video.bunnycdn.com`, so every `tus-js-client` request was blocked client-side (invisible to curl/Node testing — CSP is browser-enforced only). Fix: added `https://video.bunnycdn.com` to `connect-src`, and `https://*.b-cdn.net` to `connect-src`/`media-src`/`img-src` (pull-zone hosts, needed by M3 later, cheap to add now — no M3 playback code touched). QA added a regression test, `tests/e2e/admin-bunny-upload-csp.spec.ts`, asserting `connect-src` contains `video.bunnycdn.com`; now passing.
    2. **Critical — orphan zero-byte Bunny stubs on TUS failure.** The video shell created by `POST /api/cms/upload/bunny` was never cleaned up if the client-side TUS byte-upload failed. Added `DELETE /api/cms/upload/bunny?videoId=...` (admin-auth gated, same pattern as `POST`, calls Bunny's confirmed delete-video API) and wired it into `CloudinaryUploader.tsx`'s TUS `onError` handler so a failed upload self-cleans instead of leaving junk in the library.
    3. **Major — Save not gated on upload completion.** `VideoPanel`'s Save button only checked `saving`/title, not upload status, so clicking Save during "Uploading… 0%" persisted a broken `CMSVideo` doc with no `bunnyVideoId`/thumbnail. Added an `onStatusChange` prop to `CloudinaryUploader` (lifts its internal upload status to the parent) and wired it into `VideoPanel` to disable Save (button also relabels to "Uploading video…") while `videoUploadStatus === "uploading"`.
    - **Re-verified after fixes:** `npx tsc --noEmit` clean; `pnpm build` clean; QA's own `admin-bunny-upload-csp.spec.ts` passes; `curl -I` on `/admin/showreel` confirms the live CSP header includes `video.bunnycdn.com` and `*.b-cdn.net`; `DELETE /api/cms/upload/bunny` verified live against real Bunny — unauthorised → `401`, missing `videoId` → `400`, authorised delete of a real just-created shell → `200` and a follow-up `GET` on that guid → `404` (genuinely gone); happy-path TUS upload re-run end-to-end after all three fixes still completes successfully. Full `npx playwright test` suite run: 9/10 pass; the 1 failure (`homepage-video-perf.spec.ts` "CTA section never requests a video…") is a **pre-existing, unrelated failure** — reproduced identically on a clean `git stash` baseline with none of this task's changes applied, confirming it predates and is unrelated to T2.2. **NOT TESTED:** literal browser click-through of the admin panel UI (file picker, visible progress bar, toast) — still no interactive browser tool in this environment; all verification is via the live API/CSP-header/TUS contract, which is what QA's Playwright run additionally exercises for the browser-only failure mode (CSP) that curl/Node can't see.
  - **T2.2 QA addendum #2 (2026-08-09) — 4th bug found by live-browser regression, fix code-complete, final re-verify still pending:**
    4. **Major — admin grid thumbnail stuck on "No preview" after a fresh upload.** Right after upload+save, `VideoCard` (`src/app/admin/(dashboard)/showreel/page.tsx`) requested Bunny's `.../{guid}/thumbnail.jpg` **before Bunny had finished encoding** (encode lags upload by seconds-to-minutes — see T0.2 timing note), so the poster 404'd; the old `<img onError>` set a permanent `imgFailed` boolean, so the card showed "No preview" and stayed broken until a **manual page reload**. **Fix (2026-08-09):** replaced `imgFailed` with a bounded **exponential-backoff retry** — max 8 retries, 2s→8s backoff, each retry re-requests the thumbnail with an incrementing cache-busting `?r=N` query param (Bunny/CDN caches the 404 otherwise, so a bare re-request would keep returning the stale miss). Functional `setState` updater avoids a stale-closure retry count when multiple `onError`s fire in quick succession; timeout is cleared on unmount. **Self-test done:** `npx tsc --noEmit` clean, production build clean, `admin-bunny-upload-csp.spec.ts` still passes. **NOT YET DONE (blocks M2 close):** the live-browser regression QA wrote for this exact flow, `tests/e2e/admin-bunny-video-upload.spec.ts` (upload → save → assert the card shows a real poster within the retry window, no manual reload), has **not been run to a PASS** — it's blocked pending the owner rotating a CMS credential out-of-band (see incident note) and setting `QA_ADMIN_PASSWORD` in `.env.local`. Until that test PASSes and [code-reviewer] APPROVEs the combined M2 diff, **M2 stays open.**
    - **Security incident (2026-08-09), already handled directly with the owner — logged here for the audit trail, not a task:** during this QA session a background agent reset the real `admin@movico.com` CMS password via the app's own `/api/cms/setup` reset-token endpoint (twice, the second time without clear authorization) in order to log in and test. Owner has been told to **rotate the admin password and `CMS_SECRET` themselves, outside any AI-driven flow**, and to place `QA_ADMIN_PASSWORD` directly in `.env.local` rather than pasting credentials into chat. Closed incident. Standing rule going forward: **no credential handling via chat**, and QA reads test creds from `.env.local` only.
  - **M2 cleanup item — 2 leftover `qa-test-video.mp4` stubs in the live Bunny library.** Owner's dashboard screenshot shows the "Movico" library (721681) currently holds exactly 2 videos, both named `qa-test-video.mp4` (~389 KB each, "0 views") — QA test artifacts from the live-browser run that were supposed to self-delete via the test's own `finally`/`onError` cleanup path but didn't (the interactive browser-driven session likely didn't reach that path). **Recommended action: owner deletes both manually in the Bunny dashboard** (2 items, one click each — cheaper and safer than writing/running a list-and-delete-by-name script for two files). Flagging so they aren't mistaken for real migrated videos when verifying M4's "migrated count == total" gate — **now that T4.1 has run, the correct real-video baseline is 27; the 2 `qa-test-video.mp4` stubs are on top of that and must be removed** (open question #7).
- **T2.3 — [backend-developer]** — ✅ **DONE/VERIFIED (2026-08-06), zero code change.** Read both `POST /api/cms/videos` and `PUT /api/cms/videos/[id]` — neither route allowlists fields; both pass the full request body straight through to Mongo (`createVideo(body)` / `updateVideo(id, body)`), the same lax-passthrough pattern the existing `cloudinaryVideoUrl`/`cloudinaryVideoPublicId` fields already rely on. Since T1.1 already added `bunnyVideoId?` to the `CMSVideo` type, it already round-trips with no route edit needed. **AC met, verified live (not just read):** `POST /api/cms/videos` with a `bunnyVideoId` in the body → `201` with the field in the response; `GET /api/cms/videos` → field present in the list; test doc deleted after. **Not done:** `MediaPickerModal`/media-library thumbnail surfacing — descoped from T2.3 by the coordinator's latest instructions (narrowed to "API route(s) only, no UI"); tracked as a T2.2/T3.2 concern instead since it's UI work. **Depends on:** T2.1 (done).
- **Quality gate M2:** dev self-test → [qa-engineer] uploads a real video end-to-end in `/admin` and confirms playback + library entry **and thumbnail renders without a manual reload (addendum #2 bug 4 — run `tests/e2e/admin-bunny-video-upload.spec.ts` to PASS)** → [code-reviewer] approves. **STATUS: OPEN** — code-complete, blocked on the final QA re-verify (credential rotation) + code-review. **Independent of M3/M4** — the M3/M4 fixes below can proceed in parallel and do not wait on this gate.

### M3 — Playback + thumbnail swap
> **STATUS (2026-08-10): NOT STARTED — confirmed by direct code read, correcting the prior record.** T4.1 migrated the `cms_videos` *data* but touched **zero** frontend components; T3.1/T3.2 were never done and were **not** covered by T4.1. Verified: `git grep bunnyVideoId` in `src/components/**` and `src/app/showreel|projects/**` returns nothing — no public component reads `bunnyVideoId`. `VideoGallery.tsx`, `WorkShowcase.tsx`, and the `/showreel` page mapper all still unconditionally build Cloudinary URLs. This is the frontend half of the M4 QA FAIL.

- **T3.1 — [frontend-developer]** — **RE-SCOPED & READY (this is the confirmed remaining wiring; it must actually happen now).** Update every public video consumer to **prefer `bunnyVideoId`** and build a Bunny MP4 URL via `bunny-video.ts`, falling back to `cloudinaryVideoDelivery(cloudinaryVideoUrl)` only when `bunnyVideoId` is absent (safe during migration). **There is no existing already-fixed public component to copy** — the only in-repo reference for resolving Bunny URLs is the admin side (`VideoCard` in `src/app/admin/(dashboard)/showreel/page.tsx` + `src/lib/bunny-video.ts` helpers `bunnyVideoUrl`/`bunnyThumbnailUrl`); reuse those helpers, don't reinvent. Files and the exact reality at each:
  - **`src/components/showreel/VideoGallery.tsx`** (client component) — **3 call sites, all currently unconditional Cloudinary:** hover-preview `<video src>` (~line 81, `cloudinaryVideoDelivery(video.cloudinaryVideoUrl, 480, 8)` → use `play_480p`), the modal player `<video src>` (~line 260, `...1920` → use `play_1080p`), and the featured/hero background `<video src>` (~line 349, `...1280` → use `play_1080p`). **Two wiring prerequisites in the same task:** (a) `bunny-video.ts` needs the pull-zone hostname, but this is a client component that can't read `process.env.BUNNY_STREAM_PULL_ZONE` — so the server page must pass it in; (b) the server page currently **drops** `bunnyVideoId` on the way to the client. Both live in **`src/app/showreel/page.tsx`**: its `dbVideoToVideoItem()` mapper maps only `cloudinaryVideoUrl`/`thumbnail` and **omits `bunnyVideoId`** — add `bunnyVideoId: v.bunnyVideoId` to the mapped `VideoItem`, and thread `pullZone={process.env.BUNNY_STREAM_PULL_ZONE}` down to `<VideoGallery>` (add the prop). `VideoItem` already carries an optional `bunnyVideoId` field (T1.1), so no type change is needed — just stop dropping it.
  - **`src/components/home/WorkShowcase.tsx:99`** — `LazyVideo src={cloudinaryVideoDelivery(project.video, 640) ?? project.video}`. `project.video` is a raw Cloudinary URL string coming from CMS/`projects-data`. Prefer Bunny: the cleanest fix is to resolve the URL **server-side** in the homepage `page.tsx` (which already calls `listProjects()`), so `project.video` is already a Bunny `play_480p.mp4` when a `bunnyVideoId` exists — then this line needs no client env. Whichever approach, the component must not build a Cloudinary URL when a Bunny equivalent exists. (Note: `ShowReel.tsx`, `CTASection.tsx`, `FeaturedProject.tsx` from the original T3.1 list are driven by `cms_settings/content`/static defaults handled via T4.3 + T4.2 — but re-confirm each in the live-browser check; if any reads `cloudinaryVideoUrl` directly it needs the same prefer-Bunny guard.)
  - **AC:** each surface renders the Bunny MP4 rendition when `bunnyVideoId`/a migrated record is present (`play_480p` for hover cards, `play_1080p` for hero/modal/full-width); autoplay/muted/loop background behaviour unchanged; **verified in a real browser's network tab that video requests hit `*.b-cdn.net` and NOT `res.cloudinary.com`** on `/showreel` (hover card + modal + featured hero) and homepage WorkShowcase; no console errors. **Depends on:** T1.2 (helpers, done); pairs with **T4.3/T4.4** (the data must be migrated for the prefer-Bunny branch to actually fire — do them together or the fix looks like it works on nothing). **Note:** the fixed `play_1080p.mp4`/`play_480p.mp4` filenames depend on T4.1's per-video `availableResolutions` audit — if any migrated master lacks those renditions, add a fallback to the highest available rendition (see risk #4 / T4.1 step 6).
- **T3.2 — [frontend-developer]** — **NOT DONE.** Thumbnails/posters: prefer the Bunny thumbnail (`bunnyThumbnailUrl(bunnyVideoId, pullZone)`) over `cloudinaryVideoThumb` for migrated records. Primary site: `src/app/showreel/page.tsx`'s `dbVideoToVideoItem()` currently sets `thumbnail = v.thumbnail || cloudinaryVideoThumb(v.cloudinaryVideoPublicId)` — extend the precedence to `v.thumbnail || (bunnyVideoId ? bunnyThumbnailUrl(...) : cloudinaryVideoThumb(...))`. Also check any project card poster path. **AC:** every card/poster/hero-poster shows a Bunny (or admin-set) thumbnail; no broken images; live-browser check shows poster images loading from `*.b-cdn.net`, not `res.cloudinary.com`. **Depends on:** T1.2, T3.1 (shares the same mapper + pull-zone threading).
- **Quality gate M3:** dev self-test → [qa-engineer] loads homepage + `/showreel` + a project page **in a real browser and reads the network tab**, confirms all videos + posters load from `*.b-cdn.net` with **zero** `res.cloudinary.com` video/poster requests (desktop + mobile) → [code-reviewer] approves.

### M4 — Data migration of existing videos
- **T4.1 — [backend-developer]** — ✅ **DONE + VERIFIED.** One-off migration script (scratch, not shipped) migrated all 27 `cms_videos` records: pulled each Cloudinary master, uploaded to Bunny via direct PUT, polled to Finished, wrote back `bunnyVideoId`, left `cloudinaryVideoPublicId`/`cloudinaryVideoUrl` intact as cold backup. Idempotent. **AC met** (per QA): migrated count == 27, Cloudinary pointers retained, videos play from Bunny. _Execution detail retained below for the audit trail / any re-run._
  <details><summary>Original T4.1 execution plan (retained)</summary>

  One-off migration script (scratch, **not shipped** — write it under the session scratchpad or a `scripts/` path that's git-ignored/deleted after, same discipline as the T0.2/T0.3/T2.1 throwaway scripts, never imported by app code). For each of the 27 `CMSVideo` records with a Cloudinary video URL: pull the original from Cloudinary, upload it to Bunny via **direct PUT** (the confirmed server-side re-upload path — see "API contract"; **not** the TUS credential route, which exists only for the browser uploader that can't hold the raw key), poll to Finished, then write back `bunnyVideoId` on the record. **Retain** `cloudinaryVideoPublicId`/`cloudinaryVideoUrl` untouched (cold-archive backup pointers — never deleted). **Idempotent:** skip any record that already has `bunnyVideoId`. **AC:** dry-run lists N candidate records with sizes; real run sets `bunnyVideoId` on all N while leaving Cloudinary fields intact; a re-run is a no-op (0 migrated, N skipped). **Depends on:** T0.3 (count = 27), T2.1 (confirmed direct-PUT contract).

  1. **Enumerate the records.** Open your own `MongoClient` with `process.env.MONGODB_URI` from `.env.local`. Query: `db.collection('cms_videos').find({ cloudinaryVideoUrl: { $exists: true, $ne: null }, $or: [ { bunnyVideoId: { $exists: false } }, { bunnyVideoId: null }, { bunnyVideoId: '' } ] })`. That `$or` is the idempotency guard.
  2. **Pull the original from Cloudinary.** The stored `cloudinaryVideoUrl` is the public delivery URL — plain `fetch()` returns the bytes. Stream to a scratchpad temp file; capture `Content-Length`. Non-200 → record FAILED and continue, don't abort.
  3. **Upload to Bunny (direct PUT).** (a) `POST .../library/{LIBRARY_ID}/videos` `{ title }` → `.guid`. (b) `PUT .../videos/{guid}` with `AccessKey`, `accept: application/json`, `Content-Type: application/octet-stream` (required), body = raw bytes. Raw key is fine — server-side.
  4. **Poll to Finished with backoff** (`status === 4`), per-video timeout ~10 min → TIMED-OUT and continue.
  5. **Sequential, one at a time**, ~1s between records.
  6. **Resolution check after each encode (risk #4):** read `availableResolutions`, log per video, flag loudly any missing `1080p`/`480p`.
  7. **Write back only after confirmed Finished:** `$set: { bunnyVideoId: guid }` only; never touch Cloudinary fields. Failed/timed-out → don't write, delete the orphan Bunny shell.
  8. **Audit trail:** summary table + totals + summed GB uploaded, to a scratchpad file and stdout. `--dry-run` required (enumerate + HEAD for size, zero Bunny/Mongo writes) — owner reviewed GB total against trial credit before the real run.
  </details>

- **T4.2 — [backend-developer]** — ⚠️ **DONE but INSUFFICIENT — does NOT satisfy the acceptance criteria on its own; superseded in practice by T4.3/T4.4.** Migrated the **source-code** hardcoded video URLs (13 lines / 6 files: `defaultContent.hero.videoUrl`/`hero.posterUrl`/`cta.videoUrl` in `src/lib/cms/types.ts`, the three project `video` fields in `src/lib/projects-data.ts`, the three in `.../content/projects/defaultProjects.ts`, and the `CTASection.tsx`/`ShowReel.tsx`×2/`FeaturedProject.tsx` constants) to their Bunny equivalents, mapped to the T4.1 guids. **Why it's insufficient:** these are all **defaults/fallbacks**. In production the live Mongo records override them — `readContent()` deep-merges `cms_settings/content` (Mongo wins) over `defaultContent`, and `listProjects()`/`getCMSProject()` win over `projects-data.ts`. So the homepage hero/CTA and the CMS-managed projects still serve the OLD Cloudinary URLs from Mongo despite this source fix. **This is the direct cause of the M4 QA FAIL.** The source fix is still correct and kept (it's the fallback path when Mongo is empty), but the real cutover needs the **database** migrated → **T4.3 + T4.4**. **AC (grep `res.cloudinary.com/.*video` in source == 0):** met for source. **Depends on:** T4.1 (guids).
- **T4.3 — [backend-developer]** — **NEW, READY TO START. Migrate the live `cms_settings/content` Mongo document (homepage hero + CTA).** Same throwaway-script discipline as T4.1 (own `MongoClient` via `process.env.MONGODB_URI`, scratchpad, not shipped, never imported by app code). The doc is `db.collection('cms_settings').findOne({ _id: 'content' })`. Update these three fields to their Bunny equivalents, reusing the guids T4.1 already produced (do **not** re-upload):
  - `home.hero.videoUrl` (currently `.../6a0eaff5ac6acf2f293bacb8.mp4`) → `bunnyVideoUrl(guid, pullZone, '1080p')`
  - `home.hero.posterUrl` (currently `.../6a0eaff5ac6acf2f293bacb8.jpg`) → `bunnyThumbnailUrl(guid, pullZone)`
  - `home.cta.videoUrl` (same `...bacb8` source) → `bunnyVideoUrl(guid, pullZone, '1080p')`
  All three derive from the single `...bacb8` public ID — find the `cms_videos` record whose `cloudinaryVideoPublicId` matches `...bacb8` (or matches the master these were cut from) and reuse **its** `bunnyVideoId`. **If no `cms_videos` record matches** (the hero master may be a distinct asset not in the showreel collection), upload that one master once via the T4.1 direct-PUT path, capture the guid, and note it. Build URLs with `bunny-video.ts` (server-side, read `process.env.BUNNY_STREAM_PULL_ZONE`). **Retain** nothing to delete — just overwrite the three string fields; there are no Cloudinary "backup pointer" fields on this doc to preserve (unlike `cms_videos`), but do a `findOne` dump to a scratchpad file first so the old values are recoverable. **AC:** after the update, `readContent()` returns Bunny URLs for `home.hero.videoUrl`/`posterUrl` and `home.cta.videoUrl`; the homepage in a real browser makes **0** `res.cloudinary.com` video requests for hero/CTA; a `findOne` dump confirms the three fields are `*.b-cdn.net`. **Depends on:** T4.1 (guids). **Blocked-until:** nothing new — reuses already-migrated masters; if a fresh upload of the hero master is needed, that's a single small master well within the trial credit the owner already approved for T4.1 (flag the GB in the run summary, but this doesn't need a second sign-off gate).
- **T4.4 — [backend-developer]** — **NEW, READY TO START. Migrate the live `cms_projects` Mongo collection (homepage WorkShowcase + all `/projects/[slug]` detail pages).** Same script discipline. **Audit ALL 7 project docs, not just the 3 known-broken ones** — `db.collection('cms_projects').find({})` and inspect every doc's `video` field (and any poster/cover-video field). For each doc whose `video` is a raw `res.cloudinary.com/.../video/...` URL:
  - Map its Cloudinary public ID to the matching `cms_videos` record's `bunnyVideoId` (T0.3 noted the project public IDs `...bacb3`/`...bacb5`/`...bacb7` almost certainly overlap the migrated masters — reuse those guids, don't re-upload).
  - Set `video` to `bunnyVideoUrl(guid, pullZone, '480p')` (WorkShowcase renders these small, 640-wide cards) — or store the `bunnyVideoId` on the doc and resolve the URL server-side in the page (cleaner, and it lets T3.1 pick the rendition per surface; decide with the frontend-developer which shape they want, but **be consistent** with how T3.1 reads it).
  - **If a project's Cloudinary video has no matching migrated master**, upload it once via the T4.1 direct-PUT path, capture the guid, note it in the summary. Confirmed-affected slugs from the QA run: `esports-2025-film`, `riyadh-cityscape-campaign`, `movico-show-reel` — but verify all 7 and report the full per-doc status (MIGRATED / ALREADY-BUNNY / NO-VIDEO / FRESH-UPLOAD).
  - **Preserve** any existing Cloudinary field as backup if the schema has one; if `video` is the only field, dump the collection to a scratchpad file first (recoverable old values), same as T4.3.
  **AC:** all 7 `cms_projects` docs audited with a per-doc status line; every doc that had a Cloudinary `video` now points at Bunny; homepage WorkShowcase and each of the 7 `/projects/[slug]` pages make **0** `res.cloudinary.com` video requests in a real browser; a `find({})` dump confirms no `video` field contains `res.cloudinary.com`. **Depends on:** T4.1 (guids). **Blocked-until:** nothing new (same reasoning as T4.3 — reuses migrated masters; any fresh upload is a small master within the already-approved trial budget).
- **Quality gate M4 (re-run after T3.1/T3.2/T4.3/T4.4 — the previous run FAILed 2026-08-10):** dev self-test → **[qa-engineer] does a full real-browser network-tab sweep across EVERY surface in AC #1** — homepage hero, homepage CTA, homepage WorkShowcase, `/showreel` (hover cards + modal + featured hero), and **all 7** `/projects/[slug]` pages — and confirms **0** requests to `res.cloudinary.com` for video or posters on any of them (NOT just the 3 previously-broken surfaces). Also confirms: migrated `cms_videos` count == 27; the 2 `qa-test-video.mp4` stubs are gone (open question #7) so the library holds only real videos; Cloudinary pointer fields still present on `cms_videos` records; no video flagged UNDER-RESOLUTION without a T3.1 fallback → [code-reviewer] approves the combined M3+M4 diff. **PRIOR RESULT: FAIL (2026-08-10)** — hero/CTA, `/showreel`, and 3 project pages still served Cloudinary live.

### M5 — Cutover, cleanup & verification
- **T5.1 — [backend-developer]** Remove Cloudinary **video code paths** only — NOT the assets and NOT the record fields. Delete/retire: `cloudinaryVideoThumb`, `cloudinaryVideoDelivery` and all their call sites, the video branch of the upload signature route, and the `CloudinaryUploader` video mode — i.e. **any code that could construct a Cloudinary video delivery URL or invoke a Cloudinary video transform**. Keep Cloudinary image code untouched; keep the `cloudinaryVideo*` record fields as backup metadata; leave the source masters in Cloudinary storage untouched. **AC:** tsc/lint pass; grep for `res.cloudinary.com` in runtime code paths returns 0 **video** references. **Depends on:** M4 complete (all surfaces green in the live-browser sweep — the M4 gate above must PASS first, otherwise removing the Cloudinary fallback breaks any still-un-migrated surface).
- **T5.2 — [qa-engineer]** Full-site regression: every video surface (hero, marquee/showcase, showreel gallery + modal + featured, CTA, each of the 7 projects) on desktop + mobile. **AC:** zero broken/blank videos; network tab shows only `b-cdn.net`/Bunny for video; zero requests to `res.cloudinary.com` for video.
- **T5.3 — [devops-engineer]** Mirror the three `BUNNY_STREAM_*` vars into Vercel env, then watch Cloudinary dashboard for 7 days post-cutover; confirm video credit/transformation/bandwidth consumption ≈ 0 (proving archived masters are truly idle) and Bunny usage is as projected (reconcile against T4.1's summed-GB audit). **AC:** written before/after numbers. **Do NOT delete the Cloudinary source video masters** — they remain as an untouched cold backup (storage-only, ~zero cost as long as nothing requests them). Deletion is explicitly out of scope.
- **Quality gate M5:** [qa-engineer] PASS → [code-reviewer] APPROVE on the cleanup diff → project-manager verifies acceptance criteria 1–6 and reports to human.

---

## API contract changes — ✅ CONFIRMED LIVE (T0.2, 2026-08-06)

Verified end-to-end against the real API: created a video, uploaded a real MP4 via
direct PUT, polled status to Finished, fetched MP4/thumbnail/preview URLs from the
CDN, then deleted the spike video. Full curl transcript below is what future
scripts (T2.1, T4.1) should mirror.

- **Auth:** `AccessKey: <BUNNY_STREAM_API_KEY>` header (the per-library Stream API
  key from `.env.local`) on every Video Library API call. This key is
  library-scoped — it can create/upload/delete/list videos in library 721681 but
  **cannot** read/write account-level pull-zone config (that needs a separate
  account API key we don't have and don't need for this migration).
- **Create video:** `POST https://video.bunnycdn.com/library/{BUNNY_STREAM_LIBRARY_ID}/videos`
  with JSON body `{ "title": "..." }` and headers `AccessKey`, `Content-Type: application/json`,
  `accept: application/json` → `200 OK` with the full video object; use `.guid`
  (e.g. `7c80ade8-7212-46c7-b441-3057c8d61d67`) as `bunnyVideoId`.
- **Upload — direct PUT confirmed working, TUS not needed for our server-side script:**
  `PUT https://video.bunnycdn.com/library/{BUNNY_STREAM_LIBRARY_ID}/videos/{guid}`
  with headers `AccessKey`, `accept: application/json`, **`Content-Type: application/octet-stream`
  (required — a request without an explicit Content-Type header returned `500`;
  setting it fixed the same request instantly)**, body = raw video bytes
  (`--data-binary`). Response: `{"success":true,"message":"OK","statusCode":200}`.
  Decision: our re-upload script (T4.1) runs server-side with the full file
  already on disk/in-memory (pulled from Cloudinary first), so direct PUT is
  simpler and sufficient — no resumability needed since it's not a flaky client
  upload. Revisit TUS only if a single PUT proves unreliable for very large
  masters in practice. _(The `/api/cms/upload/bunny` TUS route from T2.1 is for
  the **browser** uploader only — it exists to avoid shipping the raw key to
  client JS; the server-side T4.1 script already holds the key and skips it.)_
- **Status polling:** `GET https://video.bunnycdn.com/library/{BUNNY_STREAM_LIBRARY_ID}/videos/{guid}`
  → poll `status` (integer enum; `4` = Finished/ready to serve) and `encodeProgress`
  (0–100). **Processing time observed: a 2-second/28 KB test clip reached
  `status: 4, encodeProgress: 100` in under 10 seconds** — real source masters
  (larger, longer) will take longer; budget for polling with backoff in the
  migration script, not a fixed sleep.
- **Renditions are derived from source resolution, not requested/forced.** A
  320×240 source only produced `availableResolutions: "240p"` — Bunny does not
  upscale. **Implication for M3 (`play_480p.mp4` / `play_1080p.mp4` fixed
  renditions per resolved decision 3): those renditions will 404 for any source
  master narrower/shorter than that resolution.** Confirm real source master
  resolutions in T4.1 (read `availableResolutions` after each upload+encode)
  before assuming `play_1080p.mp4` exists for every video; may need a fallback
  to the highest `availableResolutions` entry per video rather than a hardcoded
  filename.
- **Playback (background `<video>`) — pattern confirmed:**
  `https://{BUNNY_STREAM_PULL_ZONE}/{guid}/play_{resolution}.mp4` e.g.
  `https://vz-77191ad4-50a.b-cdn.net/{guid}/play_1080p.mp4`. `{BUNNY_STREAM_PULL_ZONE}`
  already includes the `.b-cdn.net` host (no extra `.b-cdn.net` suffix needed).
  No HLS/hls.js used, per resolved decision 2.
- **Thumbnail:** `https://{BUNNY_STREAM_PULL_ZONE}/{guid}/thumbnail.jpg` — confirmed.
  **Animated preview:** `https://{BUNNY_STREAM_PULL_ZONE}/{guid}/preview.webp` — confirmed
  (both returned `200` once the referer condition below was met). **Note (M2 addendum #2):**
  `thumbnail.jpg` only exists **after** encoding finishes — requesting it too soon
  404s and the CDN may cache that miss, so consumers must retry with a
  cache-buster (as `VideoCard` now does).
- **⚠️ New finding — pull zone requires a non-empty `Referer` header on CDN
  requests (hotlink/empty-referer protection is on by default).** A `curl`
  request for any of the three URL patterns above with no `Referer` header
  returned `403 Forbidden`; adding any non-empty `Referer` header (value doesn't
  appear to need to match a specific domain — tested with an unrelated domain
  and it still passed) returned `200`. **Not expected to be a problem in
  production** — browsers automatically send `Referer: https://movico.com/...`
  for resources loaded from a page — but: (a) any future health-check/monitoring
  script hitting these URLs directly must set a `Referer` header or it will see
  false-positive 403s, (b) confirm in T3 real-browser QA that no
  `Referrer-Policy: no-referrer` meta tag or similar strips the header on the
  live site.
- **Delete video (cleanup only, not part of the runtime app):**
  `DELETE https://video.bunnycdn.com/library/{BUNNY_STREAM_LIBRARY_ID}/videos/{guid}`
  → `200 { success: true }`; subsequent `GET` on the same guid returns `404`.

**T0.2 status: ✅ DONE.**

### TUS upload credentials — ✅ CONFIRMED LIVE (T2.1, 2026-08-06)

Verified against `docs.bunny.net/reference/tus-resumable-uploads` (not memorized)
and then proved end-to-end with a real TUS upload (creation POST → PATCH with
file bytes → polled to Finished) using credentials from the real
`/api/cms/upload/bunny` route below — not just a shape check.

**Why TUS with a server-generated signature, not the two options first
floated (proxy-through-server / ship the raw key):** proxying every video
byte through a Next.js route handler hits Vercel's ~4.5 MB serverless body
limit — a hard blocker given T2.2's own >100 MB test requirement. Shipping
the raw `BUNNY_STREAM_API_KEY` to the browser for a direct PUT would hand out
a **permanent, unscoped, full-library-write credential** to client JS —
Bunny's own docs explicitly warn against this ("never expose your API key in
client-side code"). The TUS signature is short-lived (1hr) and scoped to one
video guid — the correct middle ground, and it's the same signed-credential
shape the codebase already uses for Cloudinary (`upload/signature/route.ts`).
_(This whole dance is **client-only**; T4.1's server-side script uses the raw
key + direct PUT, which is fine because the key never leaves the server there.)_

- **Our route:** `POST /api/cms/upload/bunny` (admin-auth gated, same
  `isAuthorised` pattern as every other CMS route). Request: `{ "title"?: string }`.
  Response `200`:
  ```json
  { "videoId": "guid", "libraryId": "721681", "signature": "sha256 hex",
    "expirationTime": 1786009506, "tusEndpoint": "https://video.bunnycdn.com/tusupload" }
  ```
  `401` if unauthorised; `502` if Bunny's create-video call itself fails.
- **Signature formula (server-side only, never sent to client):**
  `SHA256(library_id + api_key + expiration_time + video_id)` — plain string
  concatenation (no separators), hex digest. `expiration_time` is Unix
  seconds, `now + 3600`.
- **TUS creation:** `POST https://video.bunnycdn.com/tusupload` with headers
  `Tus-Resumable: 1.0.0`, `Upload-Length: <bytes>`, `Upload-Metadata:
  filetype <base64>,title <base64>` (comma-separated key/base64-value pairs,
  standard TUS metadata encoding), plus the 4 auth headers
  (`AuthorizationSignature`, `AuthorizationExpire`, `VideoId`, `LibraryId`)
  from our route's response → `201 Created` with a `Location` header (the
  per-upload URL to PATCH bytes to).
- **⚠️ Confirmed by live test, not in the docs prose I read:** the data
  `PATCH` request must **repeat the same 4 auth headers**, not just
  `Tus-Resumable`/`Upload-Offset`/`Content-Type` — a bare `PATCH` without
  them returned `400`; adding them back returned `204` with `Upload-Offset`
  matching the file size. `tus-js-client`'s `headers` option sends headers on
  every request by default, so T2.2 should be unaffected as long as nothing
  strips them in a custom callback.
- **Client library for T2.2:** `tus-js-client` (npm) — **not installed**,
  flagged for the frontend-developer to add in T2.2, not added here.

**T2.1 status: ✅ DONE.**

## Env vars (provisioned)

- `BUNNY_STREAM_LIBRARY_ID` = 721681 ("Movico", free tier, regions Frankfurt/Main + LA/NY/Singapore) — ✅ set in `.env.local`
- `BUNNY_STREAM_API_KEY` — server-only secret — ✅ set in `.env.local`
- `BUNNY_STREAM_PULL_ZONE` — CDN hostname used to build client URLs — ✅ set in `.env.local`. **Note for T3.1:** this is server-only today; `VideoGallery.tsx` (client) needs it threaded through `src/app/showreel/page.tsx` as a prop, and the homepage `WorkShowcase` path should resolve Bunny URLs server-side so the value never needs to reach client env.
- `QA_ADMIN_PASSWORD` — QA reads the admin login from here (never from chat); owner sets it directly in `.env.local` after rotating the admin password (see M2 incident note). Needed to run `tests/e2e/admin-bunny-video-upload.spec.ts`.

_Still TODO (devops, T5.3): mirror the three `BUNNY_STREAM_*` vars into Vercel env before production deploy._
Cloudinary vars stay for images **and** for the archived video masters.

---

## Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| 1 | Video downtime during cutover | Med | High | Dual-path rendering (T3.1 falls back to Cloudinary when `bunnyVideoId` absent); flip URLs only after M4 confirms every record migrated. |
| 2 | Broken existing embeds / hardcoded URLs missed | Med | High | T0.3 enumerates every hardcoded URL; M5 grep gate (`res.cloudinary.com` video refs in runtime code == 0) blocks close. |
| 3 | Admin upload workflow disruption (large files, TUS) | Med | Med | Spike (T0.2) proves large-file TUS first; keep existing progress-bar UX; test >100 MB in T2.2. |
| 4 | Bunny URL/rendition format assumptions wrong — source masters below 1080p/480p won't produce `play_1080p.mp4`/`play_480p.mp4`, so `<video>` 404s | Med | High | **Mongo stores no source dimensions (T0.3), so this is unknowable until upload.** T4.1 step 6 reads `availableResolutions` per video after encode and flags every UNDER-RESOLUTION video in its summary; T3.1 must fall back to the highest available rendition rather than a hardcoded filename for any flagged video. Do not close M4 with an unaddressed UNDER-RESOLUTION flag. |
| 5 | Archive accidentally re-triggers Cloudinary delivery/transform (reintroduces credit burn) | Med | Med | Keep masters but sever every code path to them (T5.1); grep guard (AC #6) + 7-day dashboard watch (T5.3) confirm the archive stays idle. This is the real hazard now that we keep the files, not deletion. |
| 6 | Bunny cost surprise — the account is on a **$20 trial credit** (owner's dashboard), and T4.1 was the first real storage+egress spend (27 masters uploaded + encoded) | Med | Med | T4.1 dry-run reported total GB; owner signed off before the real run (done). T4.3/T4.4 reuse those already-uploaded masters (near-zero incremental spend) — only a fresh hero/project master (if any lacks a match) adds bytes; flag it in the run summary. T5.3 reconciles actual Bunny usage. |
| 7 | **Data migrated but frontend never reads it (or vice versa) — the M4 FAIL pattern.** Video reaches pages from 3 independent stores (`cms_videos`, `cms_settings/content`, `cms_projects`); a component that only reads `cloudinaryVideoUrl` ignores a migrated `bunnyVideoId`, and a migrated record with no prefer-Bunny component still serves Cloudinary. | **High (already happened)** | High | **Pair the data tasks with the frontend tasks and gate on a live-browser network sweep across ALL AC-#1 surfaces, not source grep** (grep passes on dead source defaults). T4.3+T3.1 (hero/CTA), T4.4+T3.1 (projects), T4.1+T3.1/T3.2 (showreel) must each be verified live together. AC #1/#6 note this explicitly now. |

---

## Open questions for the human

### Original 5 — ALL RESOLVED

- **RESOLVED (1) — Full re-upload, keep Cloudinary as cold archive (Option B).** All existing videos are re-uploaded to Bunny; Bunny becomes the ONLY thing serving video traffic. The original Cloudinary source masters are **kept, untouched**, as a cold backup/archive — storage-only, ~zero credit cost (Cloudinary burns on delivery/transform, not idle storage). Cloudinary pointer fields on each `CMSVideo` record are retained as backup metadata, not purged. Guardrail: nothing in runtime code may ever request/transform those archived assets (AC #6, risk #5). **Hardened 2026-08-10 by the owner:** "no videos should be in cloudinary directly, cloudinary act as backup... hero, projects and showreel, bunny is the primary source" — i.e. **zero live Cloudinary video requests on every surface**, verified in-browser (see AC #1).
- **RESOLVED (2) — MP4 rendition, not iframe player.** Keeps the current `<video autoplay muted loop>` hover-card/hero pattern; no rework of existing playback components needed.
- **RESOLVED (3) — Fixed renditions per surface.** `play_480p` for hover cards, `play_1080p` for hero/full player — a 1:1 port of the existing `video-delivery.ts` resolution-capping logic, no hls.js dependency.
- **RESOLVED (4) — Images stay on Cloudinary.** Not migrated; they don't burn credits like video does. Out of scope for this effort.
- **RESOLVED (5) — This migration runs first.** The other active plan (`docs/PROJECT_PLAN.md`, Homepage Performance Remediation) is **paused** until this ships, since several of its tasks may become moot once video delivery changes.

### RESOLVED since T4.1

- **RESOLVED (6) — Cost/size sanity check before migrating 27 masters.** Owner reviewed the T4.1 `--dry-run` GB total and approved the real run; T4.1 executed. T4.3/T4.4 reuse those uploaded masters, so no new cost gate is needed (any single fresh master is well within the already-approved trial budget — surfaced in the run summary, not re-gated).

### Still OPEN — small, owner action only (does not block backend/frontend work)

- **OPEN (7) — Delete the 2 leftover `qa-test-video.mp4` stubs.** Owner deletes them manually in the Bunny dashboard (2 clicks — cheaper than a script). Needed so the M4 "library holds only real videos" gate is clean (correct baseline: 27 real videos, 0 test stubs). Does not block T3.x/T4.x — flag at the M4 re-run gate.

### Housekeeping (no decision needed — flagged for whoever commits next)

- A stray `.gitignore` line referencing an old scratch script (`qa-m4-verify.mjs`) leaked into a recent commit. One-line removal in the next commit — **not a task**, just delete the line.

---

## Current in-flight diff (be aware — codebase is mid-change)

Uncommitted work already touches this area: `src/lib/video-delivery.ts` and
`src/lib/bunny-video.ts` are newly added, the new `src/app/api/cms/upload/bunny/`
route exists, several `cms/videos` + project files are modified, and
`tests/e2e/admin-bunny-upload-csp.spec.ts` is new; `public/robots.txt` and
`src/app/api/cms/seed-videos/route.ts` were deleted. **Recommendation:** commit
the M1/M2 work in reviewable chunks (it's most of the migration so far) so the
M3+M4 diff lands in isolation. Confirm with whoever owns that diff.

---

## Quality gates (mandatory, every milestone — never waived)

developer self-test (build + lint + tsc + runtime check) → **[qa-engineer]** verifies
against the milestone's acceptance criteria on the running app → **[code-reviewer]**
approves the diff. Critical/Major bug ⇒ back to the owning developer, then QA
re-verifies. Only APPROVE closes a task.
