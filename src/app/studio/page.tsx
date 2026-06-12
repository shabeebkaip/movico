import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/cms/seo-metadata";
import StudioPage from "./StudioPage";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("studio");
}

export default function Page() {
  return <StudioPage />;
}
