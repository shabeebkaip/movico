// Client-safe (no secrets, no 'server-only') — builds Bunny Stream playback
// URLs from a video guid + pull zone hostname. Pull zone is a public CDN
// hostname, not a secret, so it's passed in as a plain argument rather than
// read from env here — callers (server routes / server components) read
// process.env.BUNNY_STREAM_PULL_ZONE and pass it through. Fixed per-surface
// renditions (resolved decision 3): '480p' for hover cards, '1080p' for
// hero/full player. URL patterns confirmed live against the Bunny API — see
// docs/VIDEO_MIGRATION_PLAN.md "API contract" section (T0.2).
//
// Mirrors cloudinaryVideoDelivery()'s role for the Bunny path; that helper
// stays untouched for un-migrated (Cloudinary-only) records.

export type BunnyResolution = "480p" | "1080p";

export function bunnyVideoUrl(
  bunnyVideoId: string,
  pullZone: string,
  resolution: BunnyResolution = "480p"
): string {
  return `https://${pullZone}/${bunnyVideoId}/play_${resolution}.mp4`;
}

export function bunnyThumbnailUrl(bunnyVideoId: string, pullZone: string): string {
  return `https://${pullZone}/${bunnyVideoId}/thumbnail.jpg`;
}

export function bunnyPreviewUrl(bunnyVideoId: string, pullZone: string): string {
  return `https://${pullZone}/${bunnyVideoId}/preview.webp`;
}

// Bunny's pull zone has "Block direct url file access" enabled (referer
// required), which rejects Next's Image Optimizer since it fetches
// server-side with no Referer header. next/image usages for Bunny URLs must
// pass `unoptimized` so the browser fetches directly instead (same path the
// <video> tag already uses successfully).
export function isBunnyPullZoneUrl(url: string | undefined, pullZone: string | undefined): boolean {
  if (!url || !pullZone) return false;
  return url.startsWith(`https://${pullZone}/`);
}

// Some data sources (e.g. a migrated cms_projects.video field, T4.4) store a
// full Bunny play URL rather than a bare guid, already baked to one fixed
// resolution. This rewrites it to a different resolution for a surface that
// needs a different one (e.g. a 480p WorkShowcase card value reused as a
// 1080p project-detail hero), without needing the guid/pull-zone
// separately. Returns null (not a pass-through) for anything that isn't a
// recognized Bunny play URL, so callers can chain a Cloudinary fallback.
const BUNNY_PLAY_URL_RE = /^(https:\/\/[^/]+\/[0-9a-f-]{36})\/play_\d+p\.mp4$/i;

export function withBunnyResolution(
  url: string | undefined,
  resolution: BunnyResolution
): string | null {
  if (!url) return null;
  const match = url.match(BUNNY_PLAY_URL_RE);
  return match ? `${match[1]}/play_${resolution}.mp4` : null;
}
