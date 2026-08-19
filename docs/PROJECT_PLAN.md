# PROJECT PLAN — Movico Responsive / Mobile Layout Fixes

_Last updated: 2026-08-18 · Owner: project-manager · Status: **READY TO BUILD** — D1 resolved (Hybrid "More" dropdown). M1 starts with a ui-ux-engineer DESIGN_SPEC gate (T1.0), then implementation. M2/M3 unblocked and parallelizable._

_Supersedes the completed "Homepage Performance Remediation" plan (shipped; recorded in project memory / git history). That plan fixed **slow**; this plan fixes **broken layout on tablets and small screens**._

---

## Diagnosis (plain language)

A client sent a phone/tablet screenshot of the site header looking broken: the
navigation links overflow the screen, the "Start a Project" button is cut off
the right edge, and there is no hamburger menu. We reproduced this in a real
browser by resizing the viewport across common device widths against the local
dev server.

**Root cause (the header):** the header shows the full desktop menu — logo + 7
text links (Home / Work / Showreel / Services / Studio / Blog / Contact) + a
"Start a Project" pill button — starting at **768px** wide (Tailwind's `md:`
breakpoint). Below 768px it correctly shows a hamburger menu. The problem is
that between roughly **768px and ~1200px** all those items do **not** fit side
by side, so the button gets clipped off the screen and the page grows a
horizontal scrollbar. That 768–1200px band covers essentially **every tablet in
portrait, many tablets in landscape, and some laptop windows** — which is what
the client saw.

This is a real design tradeoff (7 nav items is a lot to fit), not a one-line
class change — resolved as **D1 = Hybrid "More" dropdown** below.

### Reproduced viewport matrix (homepage `/`)

| Width | Device class | Result |
|---|---|---|
| 375px | iPhone SE | OK — hamburger shown correctly |
| **768px** | iPad Mini portrait | **BROKEN — "Start a Project" clipped off right edge** (matches client screenshot) |
| **900px** | small tablet landscape | **BROKEN — nav touches edge, horizontal scrollbar appears** |
| **1024px** | iPad landscape | **BROKEN — Contact link collides with button, button text wraps + clips** |
| 1280px | laptop | OK — fits with room to spare |

The same width matrix — **320, 375, 414, 768, 900, 1024, 1280** — is the
required re-test matrix for QA and developers on every milestone below.

**Affected files:** `src/components/Header.tsx`,
`src/components/WhatsAppFloat.tsx`, `src/components/home/HeroSection.tsx`.

---

## Objective

Make the site header and above-the-fold homepage layout render correctly and
without clipping or horizontal scroll across all common device widths (320px
through desktop). We are done when, on the 7-width test matrix, the header fits
with no clipping or horizontal scrollbar at every width, the mobile menu opens
cleanly, the WhatsApp button never overlaps a control, and the hero headline
never clips.

## Users & success criteria

**Users:** Prospective clients (brands/agencies in Saudi Arabia) evaluating
Movico as a video/photo studio — **mostly on mobile and tablet**. A broken
header on the first screen directly undermines a visual studio's credibility.

**Acceptance criteria (measurable, re-tested at 320/375/414/768/900/1024/1280):**
1. At **every** width in the matrix, the header fits inside the viewport with no
   clipped text and **no horizontal scrollbar** on the page.
2. There is a clear, working navigation at every width — either the full nav (if
   it fits), the hybrid inline+"More" nav (tablet band), or a hamburger menu
   (mobile); no "squeezed desktop nav" state.
3. The mobile menu overlay shows **all** items fully, including the first
   ("Home"), with none hidden behind the header bar.
4. The WhatsApp floating button never visually overlaps the hero CTA text or the
   open mobile-menu button/CTA at any width.
5. The hero headline text is fully visible (no clipped letters) down to 320px.

## Scope

**In scope (this pass)**
- Header responsive behavior across 768–1200px, via a hybrid inline + "More"
  dropdown nav (M1).
- WhatsApp float overlap + mobile-menu first-item clipping (M2).
- Hero headline overflow at the smallest widths (M3).

**Out of scope (explicit — do not let these creep in)**
- Full-site responsive audit of non-header/non-hero areas (services grid,
  footer, studio page, contact form, blog, project pages, admin/CMS). This pass
  only audited the homepage header + hero. Captured as **M4 (placeholder)** —
  needs its own audit and scoping before any work.
- Any visual redesign, re-theming, or nav information-architecture change beyond
  the hybrid grouping D1 selects.
- Performance work (covered by the prior, completed plan).
- Desktop (≥1280px) layout, which already renders correctly.

## Architecture summary

No stack change. **Next.js (App Router) + Tailwind CSS + Framer Motion**, as
today. Every fix here is a Tailwind responsive-class / layout adjustment plus one
small "More" dropdown in existing client components — **no new dependencies, no
config changes.** The one genuine decision (which responsive strategy for the
header) is resolved as D1 = Hybrid.

---

## Human decisions (resolved 2026-08-18)

### D1 — Header nav strategy: **RESOLVED → Option C, Hybrid "More" dropdown**

The human selected the **hybrid** approach over raising the breakpoint (A) or
squeezing all 7 items to fit (B). In the tablet band, the header shows the
highest-priority links inline and collapses the rest into a "More" dropdown, so
the nav stays full-featured without clipping. Full desktop nav still shows at the
widest widths; the hamburger menu still handles mobile.

**M1 is unblocked.** Implementation is gated on a DESIGN_SPEC (T1.0) first, per
the standing workflow — see M1 breakdown.

---

## Milestones

- **M1 — Header responsive fix via hybrid inline + "More" nav (768–1200px range).**
  Demo: resize through the full matrix — mobile shows the hamburger, the tablet
  band shows key links inline with a working "More" dropdown holding the rest,
  desktop shows the full nav; no clipping, no horizontal scrollbar at any width.
- **M2 — WhatsApp overlap + mobile-menu first-item clip.** Demo: open the mobile
  menu at 375px — all items visible, WhatsApp button not covering the CTA; on the
  hero at 320–414px the WhatsApp button doesn't sit on the "Watch Reel" text.
- **M3 — Hero headline overflow ≤320px.** Demo: at 320px the cycling headline
  ("...PHOTOGRAPHY") is fully visible with no clipped letters and no page scroll.
- **M4 — Full-site responsive audit (placeholder, NOT scoped).** Out of scope for
  this pass; listed so it isn't forgotten. Needs its own audit + plan.

---

## Task breakdown

### M1 — Header responsive fix (hybrid inline + "More" dropdown)

**T1.0 — DESIGN_SPEC for the hybrid nav (GATE — before any code)** _[ui-ux-engineer]_
Per the standing workflow, no user-facing UI is implemented before a design spec
exists. Produce **`docs/DESIGN_SPEC.md`** covering the hybrid header nav:
- **Link grouping** — which links are always-visible inline in the tablet band
  (768–~1200px) vs. which live under "More". _PM recommendation to validate or
  override (reasoning: highest-traffic / conversion-critical links stay inline):_
  - **Inline:** **Home, Work, Services, Studio** — Work is the portfolio proof a
    studio sells on; Services is the offering; Studio is a distinct bookable
    revenue line. (Home may collapse to the logo click if space is tight — spec
    to decide.)
  - **Under "More":** **Showreel, Blog, Contact** — Showreel is a subset of Work;
    Blog is lower-funnel content; Contact is already covered by the "Start a
    Project" CTA button, so it's redundant inline.
  - The "Start a Project" CTA button stays visible at all tablet+ widths.
- **Breakpoint map** — what shows at each width: mobile hamburger (<768px, or
  higher if the spec prefers), hybrid inline+"More" (tablet band), full nav
  (≥ the width where all 7 fit, ~1280px). Spec must state the exact Tailwind
  breakpoints so there is never a squeezed/partial state.
- **"More" dropdown styling + behavior spec:**
  - Trigger: a "More" button with a caret, matching the existing nav link style
    (`text-xs uppercase tracking-[0.25em]`).
  - Open on **click/tap** (primary); hover-open optional on pointer devices but
    click must always work (touch has no hover).
  - Closes on: outside click, `Escape`, selecting an item, and route change.
  - **Keyboard accessible:** focusable trigger, `aria-expanded`/`aria-haspopup`,
    arrow-key movement through items, `Escape` to close and return focus to the
    trigger. Focus-visible states specified.
  - Panel styling: matches the header's glassy pill aesthetic
    (`bg-black/85 backdrop-blur-xl border-white/10 rounded`), positioned below
    the trigger, above page content (z above header contents), does not cause
    page horizontal scroll.
  - Spacing/gap values at **768 / 900 / 1024** so the inline set + "More" + CTA
    provably fit at each (this is the exact band that breaks today).
- Acceptance: `docs/DESIGN_SPEC.md` exists and specifies grouping, breakpoint
  map, dropdown open/close/keyboard behavior, and per-width spacing; PM signs off
  that it resolves the 768–1200px break on paper before code starts.
- Depends on: D1 (resolved).

**T1.1 — Implement the hybrid header nav** _[frontend-developer]_
Implement T1.0's spec in `src/components/Header.tsx`. Today's breakpoints move
together (never a partial desktop nav): desktop nav `hidden md:flex` (L75), CTA
`hidden md:block` (L99), hamburger `md:hidden` (L112). Add the inline+"More"
tablet-band nav and the dropdown per spec. Prefer native/existing patterns —
Framer Motion is already available for the panel animation; **no new dependency**
for the dropdown (a small click-outside + Escape handler suffices). Ensure the
page cannot grow a horizontal scrollbar (header is `w-[94%] max-w-6xl` centered;
the dropdown panel must not push page width).
- Acceptance: at **320/375/414/768/900/1024/1280** — header fits inside the
  viewport, no clipped text, **no horizontal scrollbar** at any width; the
  correct nav mode shows per the spec's breakpoint map (hamburger / hybrid /
  full) with no squeezed state; the "More" dropdown opens on click, closes on
  outside-click + Escape + item-select + route change, and is keyboard operable.
- Depends on: **T1.0 (DESIGN_SPEC signed off).**

**Quality gate M1:** frontend self-test (build, lint, resize through all 7 widths,
keyboard-test the dropdown) → [qa-engineer] re-tests the full matrix on a deployed
preview — confirms no clip / no horizontal scroll and verifies dropdown
open/close/keyboard behavior against the spec → [code-reviewer] approves the diff.
All three mandatory.

### M2 — WhatsApp overlap + mobile-menu first-item clip

**T2.1 — Fix mobile-menu overlay clipping its first item** _[frontend-developer]_
In `src/components/Header.tsx`, the fullscreen overlay is `fixed inset-0 ...
flex flex-col justify-center` (L127). Its vertical centering ignores the fixed
header bar sitting on top, so "Home" (first link) is partially hidden behind it.
Add top padding / offset so all items — including "Home" — are fully visible and
tappable. Account for the admin-bar offset case (`top-12` vs `top-3`, L41).
- Acceptance: at 375px (and across the matrix), opening the menu shows all 7
  links + the "Start a Project" button fully; the first item is not clipped by
  the header bar; menu is scrollable if content exceeds height on the shortest
  viewport.
- Depends on: none (independent of D1, but touches the same file — sequence after
  T1.1 or coordinate to avoid conflicts).

**T2.2 — Fix WhatsApp float overlap** _[frontend-developer]_
`src/components/WhatsAppFloat.tsx` is `fixed bottom-6 right-6 z-50` — same z as
the header and **above** the z-40 mobile overlay, and it sits over the hero
"Watch Reel" CTA at narrow widths. Coordinate stacking + position: the WhatsApp
button must not cover the open mobile menu's CTA, nor the hero "Watch Reel"
link/text at 320–414px. Preferred approach (confirm during self-test): hide the
WhatsApp button while the mobile menu is open, and/or adjust position/z so it
never overlaps an interactive control. No new dependency.
- Acceptance: at 320/375/414 — WhatsApp button does not overlap the hero
  "Watch Reel" text; with the mobile menu open, it does not overlap the menu's
  "Start a Project" button; on desktop widths the button is unchanged.
- Depends on: coordinates with T2.1 (menu-open state may drive hiding logic).

**Quality gate M2:** frontend self-test → [qa-engineer] verifies both overlaps
gone and all menu items visible on a deployed preview across the matrix →
[code-reviewer] approves. Mandatory.

### M3 — Hero headline overflow ≤320px

**T3.1 — Stop the hero headline clipping at small widths** _[frontend-developer]_
In `src/components/home/HeroSection.tsx`, the headline uses
`text-[clamp(2.2rem,8vw,7rem)]` (L81/89/95) with only `px-6` (24px) side padding.
At 320px the clamp floor (2.2rem ≈ 35px) can't shrink further, so long words
("PHOTOGRAPHY") run past the edge; the section's `overflow-hidden` (L48) then
clips the last letters. Lower the clamp minimum and/or reduce padding at the
smallest widths so the longest headline word fits within 320px without clipping,
while keeping the desktop size unchanged.
- Acceptance: at 320px (and 375/414) the full cycling headline is visible with no
  clipped letters and no horizontal page scroll; at 1280px the headline size is
  visually unchanged from today.
- Depends on: none (independent of D1).

**Quality gate M3:** frontend self-test → [qa-engineer] confirms full headline
visibility at 320/375/414 and no desktop regression → [code-reviewer] approves.
Mandatory.

### M4 — Full-site responsive audit (placeholder — NOT scoped)

Not started, not estimated. This pass only audited the homepage header + hero.
Before any work, a scoping task is required:

**T4.0 — Audit remaining pages/components across the matrix** _[qa-engineer / ui-ux-engineer]_
Walk services grid, footer, studio page, contact form, blog, project detail
pages (and the CMS/admin if client-facing) across 320–1280px; log each break with
a screenshot and width. Output feeds a future M4 task breakdown.
- Acceptance: a written defect list with per-issue width + screenshot; **no code
  changes in this task** — it produces scope, not fixes.
- Depends on: M1–M3 shipped (so the fixed patterns can be reused elsewhere).

---

## Quality gates (every milestone, no waivers)

1. **Developer self-test** — build passes, lint passes, and the developer resizes
   through **all 7 widths** (320/375/414/768/900/1024/1280) in a real browser and
   confirms the milestone's acceptance criteria.
2. **[qa-engineer] verification** — independently re-tests the same 7-width matrix
   on a **deployed preview** (not just localhost). Any Critical/Major finding
   returns the task to the developer, who fixes, then QA re-verifies.
3. **[code-reviewer] approval** — reviews the diff; only APPROVE (or APPROVE WITH
   NITS) closes the task.

## Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| 1 | Hybrid nav is the most work of the three options — a new dropdown adds click-outside, keyboard, and z-index surface area that can introduce its own bugs | Medium | Medium | T1.0 DESIGN_SPEC pins behavior before code; QA explicitly keyboard-tests + outside-click-tests the dropdown; no new dependency (small native handler) |
| 2 | Even with the inline set trimmed, the tablet band (768px) is tight — inline links + "More" + CTA may still not fit at 768px | Medium | High | T1.0 must specify per-width spacing at 768/900/1024 and prove fit on paper; if 768px still won't fit, spec drops one more link into "More" or lowers the hybrid breakpoint |
| 3 | The three fixes all touch overlapping fixed/z-index elements (header, dropdown, overlay, WhatsApp) and cause new stacking bugs | Medium | Medium | Sequence T1.1 → T2.1 → T2.2 (same file / same stacking context); QA re-tests dropdown-open, menu-open, and hero together, not in isolation |
| 4 | Lowering the hero headline clamp shrinks it too much and hurts the desktop look | Low | Medium | T3.1 acceptance pins the 1280px size as unchanged; only the small-width floor changes |
| 5 | M4 (rest of site) turns out to have many more breaks than expected, surprising the client on timeline | Medium | Medium | M4 is an explicit audit-first placeholder; no promise of scope until T4.0 produces the defect list |

---

**NEXT ACTION:** Start **T1.0** — ui-ux-engineer produces `docs/DESIGN_SPEC.md` for the hybrid nav (link grouping, breakpoint map, "More" dropdown open/close/keyboard spec, per-width spacing at 768/900/1024) → [ui-ux-engineer]. No frontend code (T1.1) until the spec is signed off. M2 (T2.1/T2.2) and M3 (T3.1) do not depend on D1 and can proceed in parallel.

**YOUR DECISION NEEDED:** none — D1 resolved (Hybrid "More" dropdown). Next human touchpoint is the M1 milestone summary after the quality gates pass. (The DESIGN_SPEC's exact inline-vs-"More" link grouping is a design call the ui-ux-engineer will make against the PM recommendation above; flagged here only so you can veto the grouping if you feel strongly about a specific link.)
