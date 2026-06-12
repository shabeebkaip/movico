import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/cms/seo-metadata";
import AboutPage from "./AboutPage";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("about");
}

export default function Page() {
  return <AboutPage />;
}
