export interface VideoItem {
  id: string;
  title: string;
  client?: string;
  category: string;
  thumbnail?: string; // Cloudinary thumbnail URL
  cloudinaryVideoUrl?: string;
  bunnyVideoId?: string;
}
