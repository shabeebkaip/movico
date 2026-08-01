# PROJECT PLAN — Movico Homepage Performance Remediation

_Last updated: 2026-07-29 · Owner: project-manager · Status: READY TO BUILD (all 4 open questions resolved — start at T1.1)_

_Supersedes the completed "Showreel Video Migration: Google Drive → Cloudinary" plan (shipped 2026-07; recorded in project memory). That migration fixed **broken** video; this plan fixes **slow** video._

---

## Diagnosis (plain language)

The Movico homepage is slow because it ships **27.4 MB** to the browser on first
load, and **~22.6 MB of that (83%) is autoplaying background video**. Up to
**five** large `.mp4` files begin downloading and playing at the same moment the
page opens — regardless of whether the user has scrolled anywhere near them.

This is **not** a server or hosting problem. The server responds in 170ms
(healthy). The bottleneck is entirely browser-side: too many bytes to download,
plus too much main-thread work (2.45s of JavaScript execution) competing for the
CPU while those videos decode. That contention is why mobile LCP (time for the
biggest visible element to appear) is a severe **7.0s** even though the LCP
element is just the H1 headline text — text that should render almost instantly
is being starved by everything else loading at once.

Layout stability is already perfect (CLS = 0), so no work is scoped there.

### Measured baseline (Lighthouse, production homepage — ground truth)

| Metric | Desktop | Mobile |
|---|---|---|
| **Performance score** | 52 | 54 |
| Accessibility | 94 | 89 |
| Best Practices | 93 | 93 |
| SEO | 92 | 92 |
| FCP | 1.4s | 3.2s |
| **LCP** | 2.3s | **7.0s (severe)** |
| TBT | 530ms | 350ms |
| CLS | 0 | 0 |
| Speed Index | 7.4s | 8.7s |
| TTI | 3.4s | 10.4s |

### Where the 27.4 MB goes

| Asset | Size | Where |
|---|---|---|
| video `…bacb7.mp4` | 7,001 KB | Hero / ShowReel |
| video `…bacb5.mp4` | 5,282 KB | WorkShowcase |
| video `…bacb8.mp4` | 5,203 KB | WorkShowcase |
| video `…bacb3.mp4` | 5,140 KB | WorkShowcase |
| video `…bacb8.mp4` (2nd transform) | 2,162 KB | duplicate load |
| **Video subtotal** | **~22.6 MB** | Hero, ShowReel, 3× WorkShowcase cards, CTA bg |
| 68 client logos (PNG / base64) | ~4.4 MB (3.15 MB wasted) | Clients / ClientLogo |
| Unused JS | ~90 KB | Next.js chunks |
| Legacy-transpiled JS | ~14 KB | build output |

**Affected files:** `src/components/home/HeroSection.tsx`,
`src/components/home/ShowReel.tsx`, `src/components/home/WorkShowcase.tsx`,
`src/components/home/CTASection.tsx`, `src/components/home/Clients.tsx`
(+ `ClientLogo`), `src/lib/cloudinary.ts`.

---

## Human decisions (resolved 2026-07-29)

All four open questions are answered; work is unblocked.

- **D1 — Below-the-fold video behavior:** **Autoplay on scroll-into-view.** Same
  visual feel as today, just deferred until each video is actually in the
  viewport. No hover/click gating. Locks T1.1.
- **D2 — CTA background video:** **Replace with a static image.** It sits at
  `opacity-10` (barely visible); a still frame looks identical to visitors and
  removes the video request entirely. Locks T2.2.
- **D3 — Targets:** **Confirmed as-is** — Performance ≥ 80 on both presets,
  initial payload < 6 MB, mobile LCP ≤ 2.5s. No reprioritization; milestone order
  stands.
- **D4 — GSAP / Framer Motion consolidation:** **Out of scope for this effort.**
  Both libraries stay. Flagged as a possible separate future investigation only
  (see "Future / not scheduled" below) — no work scheduled against it here.

---

## Objective

Cut the homepage's initial-load payload from 27.4 MB to **under 6 MB** and raise
the Lighthouse Performance score from ~52/54 into the **80s on both desktop and
mobile**, without changing the site's visual identity (hero video and showreel
stay; below-the-fold videos load and autoplay as they scroll into view). We're
done when a fresh Lighthouse run on the production homepage shows Performance ≥ 80
on both presets and total transferred bytes on first load < 6 MB.

## Users & success criteria

**Users:** Prospective clients (brands/agencies in Saudi Arabia) evaluating
Movico as a video production studio — mostly on mobile, often on variable
networks. A slow, heavy homepage directly undermines a video studio's core
credibility.

**Acceptance criteria (measurable):**
1. Lighthouse Performance ≥ 80 on **both** desktop and mobile presets (from 52 / 54).
2. Total homepage payload on initial load **< 6 MB** (from 27.4 MB).
3. Mobile **LCP ≤ 2.5s** (from 7.0s); desktop LCP ≤ 2.0s (from 2.3s).
4. Mobile **TTI ≤ 5s** (from 10.4s).
5. No visual/functional regression: hero and showreel still play; Accessibility,
   Best Practices and SEO stay at or above current values (94 / 93 / 92 desktop).

## Scope

**In scope**
- Deferring below-the-fold videos so they load and autoplay only on scroll-into-view.
- Right-sizing video bitrate/resolution for decorative vs. hero use.
- Replacing the CTA background video with a static image.
- Converting and resizing the 68 client logos to modern formats at display size.
- Trimming unused / legacy-transpiled JavaScript.
- Re-measuring to confirm the LCP gap closes once contention is removed.

**Out of scope (explicit — do not let these creep in)**
- Any redesign or layout change to the homepage.
- CLS / layout-shift work (already 0).
- Server / hosting / CDN changes (TTFB is already healthy at 170ms).
- Performance work on non-homepage routes (about, services, contact, jobs,
  studio) — a separate effort if desired later.
- Any migration off GSAP or off Framer Motion (D4 — left as-is; see "Future").
- Re-encoding or re-hosting the showreel library beyond what the homepage needs.

## Architecture summary

No stack change. Remains **Next.js (App Router) on Vercel**, MongoDB for CMS
content, **Cloudinary** for video/image hosting. Video sizing is done via
Cloudinary URL transforms (the hero already applies `q_auto,f_auto,w_1920`), so
bitrate/resolution reductions are **URL-parameter changes, not re-uploads**.
Deferring below-fold videos uses the browser-native `IntersectionObserver` (no
new dependency). The hero `<video>` already uses `preload="metadata"` + a
`poster`, so the fix is to stop *below-the-fold* videos from fetching eagerly.
**No new dependencies expected.**

## Milestones

Ordered by return-on-effort. Milestone 1 alone should recover the majority of the
payload and is independently shippable.

- **M1 — Stop concurrent video downloads (the 22.6 MB problem).** Demo: reload
  with Network tab open — only the hero video downloads at first paint; other
  videos load and autoplay as they scroll into view.
- **M2 — Right-size video weight + replace CTA video.** Demo: hero and showreel
  look identical but each file is materially smaller; CTA shows a static image
  with no video request.
- **M3 — Fix client-logo image weight.** Demo: 68 logos render identically but
  total logo payload drops from ~4.4 MB to well under 1 MB.
- **M4 — JavaScript trim + LCP verification.** Demo: fresh Lighthouse showing
  Performance ≥ 80 both presets, payload < 6 MB, mobile LCP ≤ 2.5s.

---

## Task breakdown

### M1 — Stop concurrent video downloads

**T1.1 — Defer below-the-fold videos: load + autoplay on scroll-into-view (D1)** _[frontend-developer]_
Applies to ShowReel and the 3 WorkShowcase video cards (CTA background is handled
in T2.2 — it becomes a static image, so it drops out of the lazy-load set).
Behavior is locked to **scroll-into-view autoplay** (D1) — no hover/click gating:
each video's `src` must not be set / must not begin fetching until it is within
~200px of the viewport, and it should autoplay (muted, loop, playsInline) once
in view, preserving today's look. Only the hero loads eagerly. Use the
browser-native `IntersectionObserver`.
- Acceptance: on a cold load with Network tab open, exactly **one** video (hero)
  is requested at first paint; scrolling each section into view triggers its
  video request and it autoplays; total bytes transferred *before any scrolling*
  drop from ~27.4 MB to **< 9 MB**.
- Depends on: none — **unblocked, this is the starting task.**

**T1.2 — Confirm hero video is non-blocking** _[frontend-developer]_
Hero already uses `preload="metadata"` + `poster`. Verify the poster paints at
FCP and the video is not render-blocking; keep hero eager but non-blocking.
- Acceptance: hero poster paints at FCP, video begins after; no hero regression.
- Depends on: none (parallel with T1.1).

**Quality gate M1:** frontend self-test (build, lint, Network-tab check) →
[qa-engineer] verifies request count + pre-scroll payload on a deployed preview →
[code-reviewer] approves diff. All three mandatory.

### M2 — Right-size video weight + replace CTA video

**T2.1 — Reduce resolution/bitrate for decorative & secondary videos** _[frontend-developer]_
Via Cloudinary transforms only (no re-upload). Hero keeps near-full quality;
ShowReel and WorkShowcase cards get lower width/quality transforms matched to
their rendered size (cards render far smaller than 1920px). Extend/reuse helpers
in `src/lib/cloudinary.ts`. Remove the duplicate transform of `…bacb8.mp4`
(loaded twice, 2.16 MB wasted) if it is the same asset.
- Acceptance: each decorative video's transferred size drops ≥ 50% vs. baseline
  with no visible quality loss at its rendered size; combined homepage video
  payload (if all sections were loaded) drops from ~22.6 MB to **< 8 MB**.
- Depends on: M1.

**T2.2 — Replace CTA background video with a static image (D2)** _[frontend-developer]_
Decision locked: the CTA background (`opacity-10`, barely visible) is replaced
with a **static poster image** — no compressed-video fallback. Use a Cloudinary
still frame of the current clip (e.g. an `so_auto` frame extract) or an existing
poster asset so it looks identical.
- Acceptance: CTA renders a static image; the CTA video request **disappears
  entirely** from the network trace; CTA section looks unchanged to a visitor.
- Depends on: none (can run parallel with T2.1; independent of M1).

**Quality gate M2:** frontend self-test → [qa-engineer] confirms per-video size
cuts + visual parity, the CTA video request is gone, and every touched video
still plays (see Risk 4) → [code-reviewer] approves. Mandatory.

### M3 — Fix client-logo image weight

**T3.1 — Convert & resize the 68 client logos** _[frontend-developer]_
Serve logos as WebP/AVIF, resized server-side to actual display dimensions
(~44–56px at appropriate DPR) instead of CSS-scaling full-size PNGs. Kill the
inline base64 data-URI logos (up to 179 KB each). Prefer `next/image` or
Cloudinary transforms — no new dependency.
- Acceptance: Lighthouse `modern-image-formats` reports **0 KB wasted** (from
  3.15 MB) and `uses-responsive-images` passes; total logo payload **< 1 MB**
  (from ~4.4 MB); logos look identical at display size.
- Depends on: none (parallel with M1/M2).

**Quality gate M3:** self-test → [qa-engineer] re-runs the two image audits and
spot-checks logo rendering → [code-reviewer] approves. Mandatory.

### M4 — JavaScript trim + LCP verification

**T4.1 — Clear legacy-transpiled and unused JavaScript** _[frontend-developer / devops-engineer]_
Fix `legacy-javascript` (14 KB) by confirming the build targets modern browsers
(browserslist / Next config). Investigate ~90 KB unused JS — worst offender
`ef7561e1ac5c1423.js` (39 KB unused of 74 KB) — identify what pulls it in and
code-split / defer if safe.
- Acceptance: `legacy-javascript` → 0 KB; unused-JS reduced by ≥ 50 KB with no
  functional regression.
- Depends on: none.

**T4.2 — Re-measure and confirm the LCP gap closed** _[qa-engineer]_
After M1–M3 land, run fresh Lighthouse (both presets) on production. Confirm the
H1 LCP is no longer starved by video/animation contention. If mobile LCP is still
> 2.5s, escalate the specific remaining blocker (candidates: animation-library
hydration, remaining eager assets) as a scoped follow-up — do not guess.
- Acceptance: all five top-level criteria met (Perf ≥ 80 both presets, payload
  < 6 MB, mobile LCP ≤ 2.5s, mobile TTI ≤ 5s, no score regression); numbers
  recorded in this document.
- Depends on: M1, M2, M3.

**Quality gate M4 (final):** developer self-test → [qa-engineer] verifies all
acceptance criteria against a live Lighthouse run → [code-reviewer] approves the
cumulative diff. Project is DONE only when all three pass.

## Quality gates (every milestone, no waivers)

1. **Developer self-test** — build passes, lint passes, runtime verified in
   browser (Network tab / visual check).
2. **[qa-engineer] verification** — independently checks acceptance criteria
   (request counts, payload sizes, Lighthouse audits) on a **deployed preview**,
   not just localhost. Any Critical/Major finding returns the task to the developer.
3. **[code-reviewer] approval** — reviews the diff; only APPROVE (or APPROVE WITH
   NITS) closes the task.

## Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| 1 | Scroll-into-view autoplay feels late/janky if the observer margin is too tight (video not ready when it enters view) | Low | Medium | ~200px root margin so the fetch starts before the section is fully visible; QA checks perceived smoothness on mobile |
| 2 | Payload cuts land but mobile LCP stays > 2.5s due to animation-library hydration | Medium | High | T4.2 explicitly re-measures and isolates the residual blocker rather than assuming M1–M3 suffice |
| 3 | GSAP **and** Framer Motion both load, used across 67 files (D4: left as-is) — remains a latent JS-weight cost | Medium | Medium | Out of scope by decision; noted under "Future / not scheduled" if a later effort wants it |
| 4 | Aggressive video compression / a bad Cloudinary transform degrades or breaks a video (recent history: a dead Cloudinary account) | Low | High | Tune per-video transform to rendered size; QA verifies visual parity **and** that every touched video actually plays on the deployed preview |

## Future / not scheduled (informational only — no work here)

- **Animation-library consolidation (D4).** GSAP and Framer Motion both ship to
  the client across 67 files. Dropping one could trim client JS, but it is a
  large, regression-prone refactor. If a future effort wants it, scope it as its
  own project with its own QA pass — not folded into this performance work.

---

**NEXT ACTION:** Start **T1.1** — defer below-the-fold videos to load + autoplay on scroll-into-view (D1) → [frontend-developer]. T2.2 (CTA static image), T3.1 (client logos), and T4.1 (JS trim) have no dependency on T1.1 and can be picked up in parallel if a second developer is available.

**YOUR DECISION NEEDED:** none — all four open questions resolved (see "Human decisions"). Next human touchpoint is the M1 milestone summary after the quality gates pass.
