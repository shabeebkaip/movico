import type { Metadata } from "next";
import { listVideos } from "@/lib/cms/videos";
import { HIGHLIGHTS, VIDEO_WORKS } from "@/lib/showreel-data";
import VideoGallery from "@/components/showreel/VideoGallery";
import type { VideoItem } from "@/lib/showreel-data";

export const metadata: Metadata = {
  title: "Showreel & Portfolio | Movico — Video Production Riyadh",
  description:
    "Watch Movico's complete video portfolio — brand films, commercials, event coverage, documentaries and more. Saudi Arabia's leading video production company.",
};

export const dynamic = "force-dynamic";

function dbVideoToVideoItem(v: Awaited<ReturnType<typeof listVideos>>[0]): VideoItem {
  return {
    id: v.driveId ?? v.cloudinaryVideoPublicId ?? v._id!,
    title: v.title,
    client: v.client,
    category: v.category,
    thumbnail: v.thumbnail,
    cloudinaryVideoUrl: v.cloudinaryVideoUrl,
    source: v.source,
  };
}

export default async function ShowreelPage() {
  let highlights: VideoItem[] = [];
  let works: VideoItem[] = [];

  try {
    const all = await listVideos();
    if (all.length > 0) {
      highlights = all.filter((v) => v.isHighlight).map(dbVideoToVideoItem);
      works = all.filter((v) => !v.isHighlight).map(dbVideoToVideoItem);
    }
  } catch {
    // DB unavailable — fall back to static data
  }

  // Fall back to static data if DB is empty
  if (highlights.length === 0) highlights = HIGHLIGHTS;
  if (works.length === 0) works = VIDEO_WORKS;

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <VideoGallery highlights={highlights} works={works} />
    </main>
  );
}
