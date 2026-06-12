import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/cms/seo-metadata";
import ContactPage from "./ContactPage";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("contact");
}

export default function Page() {
  return <ContactPage />;
}
