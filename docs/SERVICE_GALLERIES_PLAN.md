# PROJECT PLAN — Services Admin Module (full CMS control of Services)

_Last updated: 2026-08-16 · Owner: project-manager · Status: DECISIONS LOCKED — ready to hand M1 to [backend-developer]_

> **Supersedes the "photo galleries" scope.** This file was originally scoped to
> per-service photo galleries only. That gallery work is now **shipped** (the
> `event-production` page renders 32 Cloudinary photos via
> `src/components/services/PhotoGallery.tsx`, already live) and is folded in below
> as _M0 (done)_. The client has since asked for a **full Services module in
> admin** — same UX tier as Projects — so the whole Service content model becomes
> DB-backed and the homepage teaser derives from it. This plan replaces the
> galleries-only version rather than sitting beside it (one-plan-per-effort
> convention; the effort is "admin control of Services," and galleries were just
> its first slice).

---

## Decisions locked (2026-08-16) — human answered all four, all recommended options

- **D1 (scope):** Full Projects-tier CRUD for the entire Service detail-page
  content model, not just galleries. Confirmed.
- **D2 (teaser sync):** Homepage teaser **cards are auto-derived** from the
  Services collection. The current 8 hand-edited teaser cards (duplicate
  `video-production`, gap at 05) are **discarded** — no copy to preserve. Section
  chrome (label / heading / subheading) stays editable where it lives today
  (`content.home.services` in the CMS store); only `.items` is replaced by
  derived cards.
- **D3 (icon field):** Add `icon: string` to the service model. Admin form
  exposes a **picker constrained to the existing `ICON_MAP` set** — the 8 names
  already wired in `ServicesSection.tsx`: `Video, CalendarDays, Layers,
  LayoutGrid, Sofa, Share2, Camera, Clapperboard`. Seed assigns one per service.
- **D4 (read-path / revalidation):** Match the **existing Projects pattern
  exactly**, which is `export const dynamic = "force-dynamic"` (render per request
  from the DB — always fresh, no redeploy, no revalidation window). **Note:** the
  earlier draft said "generateStaticParams + ISR"; the real Projects routes use
  `force-dynamic`, so we follow that. No `generateStaticParams`, no `revalidate`.
- **D5 (delete semantics):** Support **both** — a `visible` toggle for temporary
  hide, plus hard delete for permanent removal. Mirrors Projects.

---

## Riskiest assumption first

**Making Services DB-backed silently breaks nothing — but the cutover has three
tripwires that will each ship a visibly-broken site if missed:**

1. **The homepage teaser and `services-data.ts` are already out of sync.** The
   DB-backed teaser (`content.home.services.items`) currently holds **8** cards
   (duplicate `video-production`, a gap at number 05) while `services-data.ts`
   holds **6** services. Per **D2**, after cutover the teaser derives its cards
   from the collection, so it will show exactly the real 6 services and the 8
   stale hand-typed cards are discarded (accepted content loss — confirmed).
2. **The teaser needs an `icon` per card; `ServiceData` has none.** Handled by
   **D3**: the model adds `icon`, the seed assigns one per service, the admin
   picker is limited to the `ICON_MAP` names. Without it every card falls back to
   the `Video` icon.
3. **`/services/[slug]` read freshness.** Handled by **D4**: use
   `force-dynamic` like the Projects routes, so admin adds/edits/deletes appear
   immediately with no redeploy.

If any of these three is skipped, the demo looks done but the client sees a wrong
homepage, grey generic icons, or new services that 404. Everything else here is
mechanical Projects-pattern copying.

## Assumptions — please confirm

1. **Follow the Projects pattern exactly** — Mongo collection + `server-only`
   CRUD lib + authorised API route + admin list/new/[id]/form + sidebar entry.
   No novel architecture (client explicitly pushed back on over-engineering).
2. **The `ServiceData` shape is proven and stays almost as-is.** We add only what
   the teaser and CRUD need: `icon`, `order`, `visible`. We do not redesign the
   fields (title, offerings[], process[], stats[], gallery[], showreel*, etc.).
3. **`PhotoGallery.tsx` and the `gallery: string[]` field are done and untouched.**
   The new admin form feeds images into that same field via `CloudinaryUploader`.
4. **Single trusted admin behind `CMS_SECRET` / `isAuthorised`** — no new
   auth/roles.
5. **MongoDB + Cloudinary stack unchanged.** No new dependency for this effort.
6. The 6 current services in `services-data.ts` are the correct, complete,
   client-approved starting set for the DB seed.

---

## Objective

Give the admin full CRUD control of Services from `/admin`, matching the Projects
module tier. A new `cms_services` MongoDB collection becomes the **single source
of truth** for: the `/services` index, every `/services/[slug]` detail page, and
the homepage "Services" teaser cards. Adding, editing, reordering, or deleting a
service in admin reflects automatically on all three surfaces — no code change,
no redeploy. We are done when an admin can create a brand-new service (e.g.
"Photography"), fill its full detail-page content + gallery, publish it, and see
it appear on the homepage teaser, the services index, and its own detail page;
and can delete a service and see it vanish from all three (detail page 404s) —
all without a developer, and with the existing 6 services migrated so nothing
disappears on cutover.

## Users & success criteria

**Users:**
- _The Movico admin_ (single `CMS_SECRET` user) — needs to manage the full
  Services catalogue like they already manage Projects, without a developer.
- _Prospective clients_ — see a consistent Services story across homepage,
  index, and detail pages (no more a card on the homepage that has no real page,
  or vice-versa).

**Acceptance criteria (measurable):**
1. Admin sidebar has a **Services** entry (under Pages, next to Projects) leading
   to a working list → new → edit flow mirroring Projects.
2. Creating a service in admin makes it appear on `/services` (index),
   `/services/<slug>` (full detail page), **and** the homepage teaser — with no
   redeploy, on the next page load (force-dynamic, per **D4**).
3. Editing any detail-page field (title, tags, overview, offerings, process,
   stats, gallery, showreel, hero image) persists and shows on the live detail
   page; editing teaser-relevant fields (title, short description, icon, tags,
   order) shows on the homepage card.
4. Deleting a service removes it from the index and the teaser, and its detail
   page returns 404 (or the deploy's not-found), with no crash on the "next
   service" link or homepage.
5. After migration, all 6 existing services render **identically** to today
   (byte-for-byte content parity: same copy, same 32 event photos, same stats),
   with zero rows hand-authored — the seed produces them.
6. Reordering services in admin reorders both the `/services` index and the
   homepage teaser.
7. The `visible` toggle hides a service from all three public surfaces while
   keeping the row; hard delete removes it entirely (**D5**).

## Scope

**In scope**
- New `cms_services` collection + `src/lib/cms/services.ts` CRUD lib (mirrors
  `cms/projects.ts`).
- Authorised API: `api/cms/services/route.ts` + `api/cms/services/[id]/route.ts`.
- Seed from the 6 static `SERVICES` entries → DB, via a `DEFAULT_SERVICES`
  constant + a guarded bulk-POST branch + a Seed action on the admin list page
  (mirrors the Projects `DEFAULT_PROJECTS` seed mechanism — **not** a throwaway
  script).
- Admin module: `content/services/{page,new,[id]}.tsx` + `ServiceForm.tsx`,
  reusing `CloudinaryUploader` for `heroImage`, `gallery[]`, `showreelPoster`.
- Sidebar entry.
- Read-path swap: `/services/page.tsx`, `/services/[slug]/page.tsx`, and the
  homepage teaser all read from the DB.
- Reconciling the homepage `ServicesContent` teaser so its **cards derive from
  the collection** (**D2**), while its section chrome (label, headings,
  subheading) stays editable where it lives today.

**Out of scope (do not let creep in)**
- Redesigning any public visual — the detail/index/teaser layouts and
  `PhotoGallery` stay as-is; this is data wiring + admin tooling only.
- New auth/roles beyond `isAuthorised`.
- Video galleries, per-service SEO overrides, or drag-drop image reordering
  inside the gallery beyond what `CloudinaryUploader` already gives (add later if
  asked).
- Migrating Projects or any other content type.

## Architecture summary

No stack change: **Next.js 15 App Router / MongoDB / Cloudinary on Vercel.** A new
`cms_services` collection stores one document per service, shaped almost exactly
like `ServiceData` plus `icon` (Lucide name for the teaser), `order`, and
`visible`. `src/lib/cms/services.ts` is a `server-only` CRUD lib copied from
`cms/projects.ts` (list / listAll / getBySlug / create / update / delete /
count / bulkCreate). The three public read sites use `export const dynamic =
"force-dynamic"` (matching the Projects routes exactly — **D4**) and call the lib
instead of importing `services-data.ts`. The homepage teaser keeps its editable
section chrome but maps its **cards** from the collection (a small server helper
projects each service to the teaser card shape: `number`, `icon`, `title`,
`description = shortDescription`, `tags`, `href = /services/<slug>`).
`services-data.ts` is retained only as the seed source (via `DEFAULT_SERVICES`),
then can be deleted once the DB is authoritative.

## Milestones

- **M0 — Per-service photo gallery (DONE, shipped).** `event-production` renders
  32 Cloudinary photos via `PhotoGallery.tsx`. No further work; folded in as the
  gallery field the new form will manage.
- **M1 — DB foundation + migration (backend).** Demo: the admin Seed action
  populates `cms_services` with the 6 services; the authorised API returns the 6
  identical to the static array; auth is enforced on writes. No public UI yet.
- **M2 — Admin Services module (frontend on M1).** Demo: in `/admin`, list the 6
  seeded services, edit one, create a 7th, toggle visibility, delete it — all
  persist. Public pages not yet switched. Independently demoable in admin.
- **M3 — Read-path cutover (frontend on M1).** Demo: `/services`, every detail
  page, and the homepage teaser all render from the DB; an admin edit appears on
  the next load; a deleted service 404s.

---

## Task breakdown

### M1 — DB foundation + migration  _(owner: [backend-developer])_

**T1.1 — `cms_services` model + CRUD lib**
Create `src/lib/cms/services.ts` mirroring `src/lib/cms/projects.ts`: collection
`cms_services`, interface `CMSService` = the `ServiceData` fields **plus**
`icon: string`, `order: number`, `visible: boolean`, `createdAt: Date`. Export
`listServices` (`{ visible: true }`, sorted by `order`), `listAllServices`,
`getServiceBySlug` (visible only), `createService`, `updateService`,
`deleteService`, `serviceCount`, `bulkCreateServices`.
- Acceptance: compiles under `server-only`; every `ServiceData` field
  (slug, number, title, category, tags, shortDescription, heroTagline,
  heroImage?, overview, offerings[], process[], stats?[], gallery?[],
  showreelPoster?, showreelUrl?) is representable with no data loss; add a unique
  index on `slug`.

**T1.2 — Authorised API routes**
`src/app/api/cms/services/route.ts` (GET list — `?all=true` guarded for admin;
POST create, with a bulk-array branch guarded by `isAuthorised` that refuses when
`serviceCount() > 0`) and `src/app/api/cms/services/[id]/route.ts`
(GET, PUT, DELETE). Copy the Projects routes verbatim, swapping the lib imports.
- Acceptance: unauthorised writes → 401; authorised create/update/delete persist
  and read back; posting the bulk array a second time returns 409 (already
  seeded); slug collision surfaces a clear error.
- Depends on: T1.1.

**T1.3 — Seed the 6 static services (Projects-pattern seed, not a script)**
Create `src/app/admin/(dashboard)/content/services/defaultServices.ts` exporting
`DEFAULT_SERVICES` — the 6 `SERVICES` entries from `src/lib/services-data.ts`
mapped to `CMSService` shape: `order` 0–5, `visible: true`, and an `icon` per
service from the `ICON_MAP` set (**D3** — pick a sensible one each, e.g.
video-production→`Video`, event-production→`CalendarDays`, brand-identity→`Layers`,
spatial-booth→`LayoutGrid`, interior-design→`Sofa`, social-digital→`Share2`).
The seed is triggered by a Seed button on the admin list page (T2.2) that POSTs
`DEFAULT_SERVICES` as an array to the T1.2 route — the 409 guard makes it
idempotent. (Backend delivers `defaultServices.ts` + the guarded bulk branch;
the button lives in T2.2.)
- Acceptance: after seeding, `listAllServices()` returns 6 docs matching the
  static content field-for-field, including `event-production`'s 32 gallery URLs;
  re-triggering the seed returns 409 and inserts nothing.
- Depends on: T1.1, T1.2.

**Quality gate M1:** backend self-test (build, lint, run seed via the API, read
back) → **[qa-engineer]** verifies the 6 seeded docs match static content and the
API enforces auth (401 unauth, 409 re-seed) → **[code-reviewer]** approves. All
three mandatory.

### M2 — Admin Services module  _(owner: [frontend-developer])_

**T2.1 — `ServiceForm.tsx` (shared create/edit form)**
Create `src/app/admin/(dashboard)/content/services/ServiceForm.tsx` by copying
`.../projects/ProjectForm.tsx`. Fields: slug, number, title, category, tags,
short & long (`overview`) descriptions, heroTagline, `icon` (dropdown limited to
the 8 `ICON_MAP` names — **D3**), dynamic lists for `offerings[]`, `process[]`,
`stats[]`, `heroImage` + `showreelPoster` (single `CloudinaryUploader` each),
`gallery[]` (multi `CloudinaryUploader`), `showreelUrl`, `order`, `visible`.
POSTs to the T1.2 API.
- Acceptance: create and edit both round-trip every field including nested lists
  and the 32-image gallery; icon dropdown only offers the 8 mapped icons; slug
  validated (lowercase-kebab, unique).
- Depends on: T1.2. **Reuse `CloudinaryUploader` — no new uploader.**

**T2.2 — List / new / edit pages + sidebar entry + Seed button**
Mirror `.../content/projects/`:
`src/app/admin/(dashboard)/content/services/page.tsx` (list with `order`
up/down, `visible` toggle, edit/delete, and a Seed button that POSTs
`DEFAULT_SERVICES` when the list is empty — **D5** covers hide+delete),
`.../services/new/page.tsx`, `.../services/[id]/page.tsx`. Add a **Services** item
to `src/components/admin/AdminSidebar.tsx` (after Projects, ~line 38) with a
Lucide icon; active-highlight on `/admin/content/services*`.
- Acceptance: list shows the 6 seeded services in order; Seed button populates an
  empty collection then disables; can create a 7th, edit it, toggle visible,
  delete it; sidebar link highlights on services routes.
- Depends on: T2.1, T1.3.

**Quality gate M2:** frontend self-test (build, lint, full CRUD + seed + visible
toggle loop by hand) → **[qa-engineer]** exercises create/edit/reorder/hide/delete
+ auth on a preview → **[code-reviewer]** approves. All three mandatory.

### M3 — Read-path cutover  _(owner: [frontend-developer])_

**T3.1 — Index + detail pages read from DB**
Switch `src/app/services/page.tsx` and `src/app/services/[slug]/page.tsx` from
`import { SERVICES } from "@/lib/services-data"` to the T1.1 lib
(`async` server components). Keep `export const dynamic = "force-dynamic"`
(match Projects — **D4**; do **not** add `generateStaticParams` or `revalidate`).
Update `generateMetadata`, and the `currentIndex` / `nextService` logic to use
`listServices()`. Keep the static array as a last-resort try/catch fallback if
Projects does (mirror that route's shape).
- Acceptance: both pages render from the DB; an admin edit appears on next load;
  a newly-created service gets a working detail page; a deleted service 404s
  without crashing the "next service" link.
- Depends on: T1.1.

**T3.2 — Homepage teaser derives from the collection**
Build the teaser cards from `listServices()` (**D2**): a small server helper maps
each service → the `ServicesContent` item shape (`number`, `icon`, `title`,
`description = shortDescription`, `tags`, `href = /services/<slug>`). In
`src/app/page.tsx`, keep the section chrome from `content.home.services`
(label / headingLine1 / headingHighlight / subheading) but replace `.items` with
the derived cards before passing to `ServicesSection`. `ServicesSection.tsx`
stays unchanged — it already maps `item.icon` through `ICON_MAP`.
- Acceptance: the homepage teaser shows exactly the **visible** services in
  `order`, each with its `icon`, linking to its detail page; editing a service
  updates its card; adding/deleting a service adds/removes its card — no redeploy;
  the 8 stale cards are gone.
- Depends on: T1.1, T3.1.

**T3.3 — Retire `services-data.ts` as a live source**
Once T3.1/T3.2 are green, remove the runtime imports of `services-data.ts` from
the public pages. Keep the file only for `DEFAULT_SERVICES`/fallback if that
mirrors the Projects choice; otherwise delete it. Confirm no remaining runtime
importers.
- Acceptance: `grep` shows no runtime import of `services-data.ts` except the
  seed source (and the try/catch fallback, if kept); build passes.
- Depends on: T3.1, T3.2.

**Quality gate M3:** frontend self-test (build, lint, edit-see-live loop,
add/delete loop, homepage + index + detail parity) → **[qa-engineer]** verifies
all M3 + top-level acceptance criteria on a preview (create → appears on 3
surfaces; delete → gone + 404; hide → gone but row kept; 6 migrated services
unchanged; teaser icons correct) → **[code-reviewer]** approves. All three
mandatory.

## Quality gates (every milestone, no waivers)

1. **Developer self-test** — build + lint pass; runtime verified in browser
   (admin CRUD + seed loop for M2; edit-appears-live + add/delete for M3).
2. **[qa-engineer]** — independently verifies every acceptance criterion on a
   deployed preview. Any Critical/Major finding returns the task to the owning
   developer; QA re-verifies.
3. **[code-reviewer]** — reviews the diff; only APPROVE / APPROVE WITH NITS
   closes a task.

## Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| 1 | Homepage teaser cutover discards the client's existing 8 hand-typed cards | Accepted (D2) | Low | Human confirmed the 8 cards hold no copy to keep; T3.2 derives from the seeded 6 (fixes the dupes/gap) |
| 2 | New services show a generic grey icon on the homepage (missing `icon`) | Handled (D3) | Medium | Model carries `icon`; form dropdown limited to `ICON_MAP`; seed assigns per-service icons |
| 3 | Added/deleted services 404 or go stale | Handled (D4) | High | `force-dynamic` on both routes (match Projects) — always fresh, no redeploy |
| 4 | Migration drops a field (nested offerings/process/stats, 32 gallery URLs) | Medium | High | T1.3 acceptance = field-for-field parity check by QA against the static array |
| 5 | Scope creep into redesigning layouts or adding per-service SEO | Medium | Medium | Out-of-scope list explicit; wiring + admin only |
| 6 | Two sources briefly disagree during cutover (DB vs static) | Medium | Medium | M3 switches all three read sites together; T3.3 removes the static source last |

---

## Open questions for the human

None — Q1–Q5 answered and locked above (see **Decisions locked**). New questions
will be raised only if implementation surfaces a blocker.

---

**NEXT ACTION:** Hand M1 (T1.1 → T1.2 → T1.3) to [backend-developer]:
`src/lib/cms/services.ts`, `src/app/api/cms/services/route.ts` +
`.../[id]/route.ts`, and `src/app/admin/(dashboard)/content/services/defaultServices.ts`.

**YOUR DECISION NEEDED:** none — proceed to build.
