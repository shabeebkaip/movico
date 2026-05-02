export interface ProjectData {
  slug: string;
  number: string;
  client: string;
  title: string;
  category: string;
  location: string;
  year: string;
  shortDescription: string;
  fullDescription: string;
  result: string;
  tags: string[];
  coverImage: string;
  images: string[];
  featured: boolean;
}

export const PROJECTS: ProjectData[] = [
  {
    slug: "leap-conference-2024",
    number: "01",
    client: "LEAP",
    title: "LEAP Conference 2024",
    category: "Event Production",
    location: "Riyadh, Saudi Arabia",
    year: "2024",
    shortDescription: "Full-scale event production and media coverage for the world's largest tech conference in Saudi Arabia.",
    fullDescription: "Movico delivered end-to-end event production for LEAP 2024 — one of the most watched tech conferences globally. From stage design and AV production to live streaming and post-event content, our team handled every element of the media footprint across all 3 days of the event.",
    result: "3-day coverage across 5 stages, 40+ hours of content produced, 2M+ views on delivered assets.",
    tags: ["Event Production", "Live Coverage", "AV Production", "Riyadh"],
    coverImage: "https://movicoksa.com/wp-content/uploads/2024/10/SNIL2230-scaled.jpg",
    images: [
      "https://movicoksa.com/wp-content/uploads/2024/10/SNIL2230-scaled.jpg",
      "https://movicoksa.com/wp-content/uploads/2024/10/6B2A6288-scaled.jpg",
      "https://movicoksa.com/wp-content/uploads/2024/10/DSC09438-scaled.jpg",
    ],
    featured: true,
  },
  {
    slug: "alfanar-neom-village",
    number: "02",
    client: "Alfanar",
    title: "Alfanar — NEOM Village",
    category: "Corporate Video",
    location: "NEOM, Saudi Arabia",
    year: "2024",
    shortDescription: "Cinematic corporate video showcasing Alfanar's landmark presence at the NEOM development project.",
    fullDescription: "A premium corporate brand film produced for Alfanar documenting their involvement in the NEOM mega-project. Shot across multiple sites in Saudi Arabia, the film combined aerial cinematography, interviews, and cinematic B-roll to communicate the scale and ambition of the project.",
    result: "Award-winning brand film deployed across digital, broadcast, and events. Featured at LEAP and World Defense Show.",
    tags: ["Corporate Video", "Brand Film", "Aerial Cinematography", "NEOM"],
    coverImage: "https://movicoksa.com/wp-content/uploads/2024/10/6B2A6288-scaled.jpg",
    images: [
      "https://movicoksa.com/wp-content/uploads/2024/10/6B2A6288-scaled.jpg",
      "https://movicoksa.com/wp-content/uploads/2024/10/SNIL2230-scaled.jpg",
    ],
    featured: true,
  },
  {
    slug: "world-defense-show",
    number: "03",
    client: "World Defense Show",
    title: "World Defense Show",
    category: "Event Coverage",
    location: "Riyadh, Saudi Arabia",
    year: "2024",
    shortDescription: "Comprehensive media production and event coverage for Saudi Arabia's premier defense and security exhibition.",
    fullDescription: "Movico was appointed as the official media production partner for the World Defense Show — delivering full event coverage across all exhibition halls, keynote sessions, and live demonstrations. Our team of 12 crew produced daily highlight reels, social content, and a full-length documentary of the event.",
    result: "12 crew, 6 days of continuous production, 150+ individual deliverables across social, broadcast and web.",
    tags: ["Event Coverage", "Media Production", "Saudi Arabia", "Documentary"],
    coverImage: "https://movicoksa.com/wp-content/uploads/2024/10/DSC09438-scaled.jpg",
    images: [
      "https://movicoksa.com/wp-content/uploads/2024/10/DSC09438-scaled.jpg",
      "https://movicoksa.com/wp-content/uploads/2024/10/SNIL2230-scaled.jpg",
    ],
    featured: true,
  },
];

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
