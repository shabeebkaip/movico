// Client-safe (no secrets, no 'server-only') — caps Cloudinary video bandwidth
// by injecting a delivery transform sized to how the video actually appears
// on screen. Raw upload URLs otherwise stream at full source resolution
// regardless of a 240px hover-preview card, which is what was driving
// Cloudinary bandwidth usage.
export function cloudinaryVideoDelivery(
  url: string | undefined,
  width: number,
  trimSeconds?: number
): string | undefined {
  if (!url || !url.includes("res.cloudinary.com/") || !url.includes("/upload/")) return url;
  const parts = [`q_auto`, `f_auto`, `w_${width}`, `c_limit`];
  if (trimSeconds) parts.push(`eo_${trimSeconds}`);
  const transform = parts.join(",");
  // Replace an existing transform segment (comma-containing) right after
  // /upload/ if present, otherwise just insert — keeps this idempotent
  // against URLs that already carry a (possibly wrong-sized) transform.
  return url.replace(/\/upload\/(?:[^/]+,[^/]+\/)?/, `/upload/${transform}/`);
}
