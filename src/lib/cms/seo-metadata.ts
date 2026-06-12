import type { Metadata } from "next";
import { readSeo } from "./store";
import type { CMSSeo } from "./types";

type PageKey = keyof CMSSeo["pages"];

const FALLBACK_TITLES: Record<PageKey, string> = {
  home:     "Movico — Corporate Video Production Company Riyadh, Saudi Arabia",
  about:    "About Us | Movico — Video Production Riyadh",
  contact:  "Contact | Movico — Get a Quote",
  studio:   "Studio | Movico — Production Studio Riyadh",
  projects: "Our Work | Movico — Video Production & Event Coverage Riyadh",
  services: "Our Services | Movico — Video & Creative Production Riyadh",
};

const FALLBACK_DESCRIPTIONS: Record<PageKey, string> = {
  home:     "Riyadh's leading corporate video production company. Brand films, event coverage, corporate videos & media production across Saudi Arabia and the GCC.",
  about:    "Learn about Movico — Riyadh's award-winning corporate video production studio.",
  contact:  "Get in touch with Movico. Tell us about your project and we'll get back within 24 hours.",
  studio:   "Explore Movico's professional production studio in Riyadh. Book a session today.",
  projects: "Explore Movico's portfolio of corporate videos, event productions, and brand films for leading companies across Saudi Arabia and the GCC.",
  services: "Premium video production, event production, brand identity, spatial design, and social media content — all under one roof in Riyadh, Saudi Arabia.",
};

const BASE_URL = "https://movicoksa.com";

const PAGE_PATHS: Record<PageKey, string> = {
  home: "/",
  about: "/about",
  contact: "/contact",
  studio: "/studio",
  projects: "/projects",
  services: "/services",
};

export async function buildPageMetadata(pageKey: PageKey): Promise<Metadata> {
  const seo = await readSeo();
  const page = seo.pages[pageKey];
  const global = seo.global;

  const rawTitle = page.title?.trim();
  const title = rawTitle
    ? (global.titleTemplate?.includes("%s")
        ? global.titleTemplate.replace("%s", rawTitle)
        : rawTitle)
    : FALLBACK_TITLES[pageKey];

  const description =
    page.description?.trim() ||
    global.defaultDescription?.trim() ||
    FALLBACK_DESCRIPTIONS[pageKey];

  const ogImage =
    page.ogImage?.trim() ||
    global.defaultOgImage?.trim() ||
    undefined;

  const canonicalUrl =
    page.canonical?.trim() ||
    `${BASE_URL}${PAGE_PATHS[pageKey]}`;

  return {
    title,
    description,

    ...(page.noindex && {
      robots: { index: false, follow: false },
    }),

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Movico",
      locale: "en_US",
      type: "website",
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      }),
    },

    twitter: {
      card: global.twitterCardType || "summary_large_image",
      title,
      description,
      ...(global.twitterHandle && { site: `@${global.twitterHandle}` }),
      ...(ogImage && { images: [ogImage] }),
    },
  };
}
