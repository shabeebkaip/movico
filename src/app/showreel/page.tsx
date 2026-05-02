import type { Metadata } from "next";
import { HIGHLIGHTS, VIDEO_WORKS } from "@/lib/showreel-data";
import VideoGallery from "@/components/showreel/VideoGallery";

export const metadata: Metadata = {
  title: "Showreel & Portfolio | Movico — Video Production Riyadh",
  description:
    "Watch Movico's complete video portfolio — brand films, commercials, event coverage, documentaries and more. Saudi Arabia's leading video production company.",
};

export default function ShowreelPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <VideoGallery highlights={HIGHLIGHTS} works={VIDEO_WORKS} />
    </main>
  );
}
