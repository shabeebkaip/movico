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
  coverAlt?: string;
  images: string[];
  video?: string;
  bunnyVideoId?: string;
  featured: boolean;
  seo?: {
    title: string;
    description: string;
    ogImage: string;
    noindex: boolean;
    canonical: string;
  };
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
  {
    slug: "esports-2025-film",
    number: "04",
    client: "Esports 2025",
    title: "Esports 2025 Film",
    category: "Esports Film",
    location: "Riyadh, Saudi Arabia",
    year: "2025",
    shortDescription: "High-energy esports campaign film capturing the scale and spectacle of Saudi Arabia's growing esports scene.",
    fullDescription: "Movico produced a fast-paced cinematic film for Esports 2025, blending live arena footage, player interviews, and motion graphics to capture the energy of competitive gaming in the Kingdom. The film was cut for both broadcast and vertical social formats.",
    result: "Delivered across broadcast and social, driving strong engagement across the event's digital channels.",
    tags: ["Esports", "Event Film", "Riyadh", "Social Content"],
    coverImage: "https://movicoksa.com/wp-content/uploads/2024/10/6B2A6288-scaled.jpg",
    images: ["https://movicoksa.com/wp-content/uploads/2024/10/6B2A6288-scaled.jpg"],
    video: "https://vz-77191ad4-50a.b-cdn.net/f208024e-6fed-463c-9d94-d8bd4bcd4d4b/play_1080p.mp4",
    featured: false,
  },
  {
    slug: "riyadh-cityscape-campaign",
    number: "05",
    client: "Riyadh Cityscape",
    title: "Riyadh Cityscape Campaign",
    category: "City Campaign",
    location: "Riyadh, Saudi Arabia",
    year: "2025",
    shortDescription: "Cinematic city campaign film showcasing Riyadh's skyline and rapid urban transformation.",
    fullDescription: "A sweeping cinematic piece capturing Riyadh's evolving skyline and landmark developments, produced using aerial and time-lapse cinematography to communicate the pace of the city's growth.",
    result: "Used across digital campaigns to promote Riyadh as a destination for investment and tourism.",
    tags: ["City Campaign", "Aerial Cinematography", "Riyadh", "Brand Film"],
    coverImage: "https://movicoksa.com/wp-content/uploads/2024/10/SNIL2230-scaled.jpg",
    images: ["https://movicoksa.com/wp-content/uploads/2024/10/SNIL2230-scaled.jpg"],
    video: "https://vz-77191ad4-50a.b-cdn.net/4e224431-9aa4-489c-96de-c461f5a67ce2/play_1080p.mp4",
    featured: false,
  },
  {
    slug: "aramco-promotional-video",
    number: "06",
    client: "Aramco",
    title: "Aramco Promotional Video",
    category: "Promotional Video",
    location: "Dhahran, Saudi Arabia",
    year: "2023",
    shortDescription: "Corporate promotional video produced for Aramco, highlighting operational excellence and innovation.",
    fullDescription: "Movico produced a polished promotional video for Aramco, combining on-site cinematography with brand storytelling to showcase the company's operations and commitment to innovation.",
    result: "Delivered as a flagship promotional asset for internal and external brand communications.",
    tags: ["Promotional Video", "Corporate", "Saudi Arabia"],
    coverImage: "https://movicoksa.com/wp-content/uploads/2024/10/6B2A6288-scaled.jpg",
    images: ["https://movicoksa.com/wp-content/uploads/2024/10/6B2A6288-scaled.jpg"],
    featured: false,
  },
  {
    slug: "movico-show-reel",
    number: "07",
    client: "Movico",
    title: "Movico Show Reel",
    category: "Brand Showreel",
    location: "Riyadh, Saudi Arabia",
    year: "2024",
    shortDescription: "Movico's own brand showreel — a curated cut of our best production work across events, brand films, and campaigns.",
    fullDescription: "Our in-house show reel bringing together highlights from Movico's production work — event coverage, brand films, and campaign content — into a single cinematic cut that represents our range and craft.",
    result: "Serves as Movico's flagship brand asset across the website, pitches, and social channels.",
    tags: ["Showreel", "Brand Film", "Movico"],
    coverImage: "https://movicoksa.com/wp-content/uploads/2024/10/DSC09438-scaled.jpg",
    images: ["https://movicoksa.com/wp-content/uploads/2024/10/DSC09438-scaled.jpg"],
    video: "https://vz-77191ad4-50a.b-cdn.net/b8979a73-332d-4e6d-8f35-18ea3859b514/play_1080p.mp4",
    featured: false,
  },
];

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
