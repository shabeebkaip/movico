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
