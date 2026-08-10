import type { Metadata } from "next";
import { listVideos } from "@/lib/cms/videos";
import { cloudinaryVideoThumb } from "@/lib/cloudinary";
import VideoGallery from "@/components/showreel/VideoGallery";
import type { VideoItem } from "@/lib/showreel-data";

export const metadata: Metadata = {
  title: "Showreel & Portfolio | Movico — Video Production Riyadh",
  description:
    "Watch Movico's complete video portfolio — brand films, commercials, event coverage, documentaries and more. Saudi Arabia's leading video production company.",
};

// Cached + served statically; the videos admin panel calls
// revalidatePath('/showreel') on every save, so edits go live immediately.
// This time-based revalidation is just a safety net.
export const revalidate = 3600;

function dbVideoToVideoItem(v: Awaited<ReturnType<typeof listVideos>>[0]): VideoItem {
  const thumbnail = v.thumbnail || (v.cloudinaryVideoPublicId ? cloudinaryVideoThumb(v.cloudinaryVideoPublicId) : undefined);
  return {
    id: v._id!,
    title: v.title,
    client: v.client,
    category: v.category,
    thumbnail,
    cloudinaryVideoUrl: v.cloudinaryVideoUrl,
  };
}

export default async function ShowreelPage() {
  let highlights: VideoItem[] = [];
  let works: VideoItem[] = [];

  try {
    const all = await listVideos();
    highlights = all.filter((v) => v.isHighlight).map(dbVideoToVideoItem);
    works = all.filter((v) => !v.isHighlight).map(dbVideoToVideoItem);
  } catch {
    // DB unavailable — page renders its own empty state
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <VideoGallery highlights={highlights} works={works} />
    </main>
  );
}
