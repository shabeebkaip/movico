export interface ServiceOffering {
  title: string;
  description: string;
}

export interface ServiceData {
  slug: string;
  number: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  tags: string[];
  heroTagline: string;
  overview: string;
  offerings: ServiceOffering[];
  process: { step: string; title: string; description: string }[];
}

export const SERVICES: ServiceData[] = [
  {
    slug: "video-production",
    number: "01",
    title: "Video Production",
    shortDescription:
      "High-impact commercials, branded films, and cinematic storytelling crafted for scale and emotion.",
    longDescription:
      "We produce video content that doesn't just look great — it converts, connects, and commands attention. From a single brand film to a full-scale campaign, every frame is engineered with purpose.",
    tags: ["Brand Films", "Commercials", "Cinematic"],
    heroTagline: "Every frame, a statement.",
    overview:
      "We approach video production as a discipline of storytelling first, technology second. Our team of directors, cinematographers, and editors work as one cohesive unit — translating your brand's values into visual narratives that audiences feel as much as watch. We operate across Saudi Arabia and the wider GCC region.",
    offerings: [
      {
        title: "Brand Films",
        description:
          "Cinematic stories that articulate your brand's identity, culture, and vision at a premium standard.",
      },
      {
        title: "TV & Digital Commercials",
        description:
          "High-conversion ads engineered for broadcast, YouTube, and social — built to stop the scroll.",
      },
      {
        title: "Corporate Videos",
        description:
          "Internal comms, leadership messages, and annual reports brought to life with visual precision.",
      },
      {
        title: "Product Showcases",
        description:
          "Detailed, beautiful product films that communicate quality and desirability in every shot.",
      },
      {
        title: "Documentary & Long-Form",
        description:
          "In-depth storytelling for brands that want to own their narrative over time.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Discover",
        description:
          "We immerse ourselves in your brand, audience, and objectives to define the right creative direction.",
      },
      {
        step: "02",
        title: "Concept",
        description:
          "Scripts, storyboards, and mood boards developed collaboratively until the vision is locked.",
      },
      {
        step: "03",
        title: "Produce",
        description:
          "Full-scale production with our own crew, equipment, and direction — no outsourcing.",
      },
      {
        step: "04",
        title: "Deliver",
        description:
          "Final edit, colour grade, sound design, and delivery in every format your campaign needs.",
      },
    ],
  },
  {
    slug: "event-production",
    number: "02",
    title: "Event Production",
    shortDescription:
      "Immersive conferences and brand experiences engineered for cultural relevance.",
    longDescription:
      "From intimate product launches to NEOM-scale conferences, we design and execute live brand experiences that create lasting impressions and measurable impact.",
    tags: ["Live Events", "Conferences", "Brand Experiences"],
    heroTagline: "Experiences people don't forget.",
    overview:
      "We treat every event as a live production — with the same creative rigour and technical precision as a film shoot. Lighting, staging, content, and choreography all work in harmony to deliver an experience that reflects your brand's ambition and leaves audiences genuinely moved.",
    offerings: [
      {
        title: "Conference & Summit Production",
        description:
          "End-to-end production for large-scale conferences — stage design, AV, live streaming, and content.",
      },
      {
        title: "Product Launches",
        description:
          "High-impact reveal moments engineered to generate coverage, excitement, and social proof.",
      },
      {
        title: "Brand Activations",
        description:
          "Interactive brand experiences that turn audiences into advocates.",
      },
      {
        title: "Gala & Award Events",
        description:
          "Premium gala evenings with cinematic lighting, live broadcast, and flawless execution.",
      },
      {
        title: "Live Content Capture",
        description:
          "Professional filming and photography of your event for immediate social and long-term archival use.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Brief",
        description:
          "We align on objectives, audience, tone, and scale — building a creative concept around your goals.",
      },
      {
        step: "02",
        title: "Design",
        description:
          "Stage layouts, run-of-show, visual design, and content scripts developed and reviewed together.",
      },
      {
        step: "03",
        title: "Produce",
        description:
          "Supplier management, crew coordination, technical setup, and rehearsals all handled in-house.",
      },
      {
        step: "04",
        title: "Execute",
        description:
          "On-the-day direction and live production — seamless, controlled, and cinematic.",
      },
    ],
  },
  {
    slug: "brand-identity",
    number: "03",
    title: "Brand Identity",
    shortDescription:
      "Strategic brand systems designed for longevity, authority, and regional impact.",
    longDescription:
      "We build brand identities that work — visually, strategically, and commercially. From naming to full visual system, we create the foundation your business needs to compete at the highest level.",
    tags: ["Logo", "Visual Systems", "Strategy"],
    heroTagline: "Built to last. Built to lead.",
    overview:
      "A brand is not a logo — it's a system of decisions that communicate who you are before you say a word. We approach brand identity through research, strategy, and craft. The result is a visual language that is distinct, ownable, and built for the Saudi and GCC markets.",
    offerings: [
      {
        title: "Brand Strategy",
        description:
          "Positioning, purpose, personality, and messaging — the strategic foundation everything else is built on.",
      },
      {
        title: "Logo & Mark Design",
        description:
          "Distinctive, scalable marks designed to lead industries and endure decades.",
      },
      {
        title: "Visual Identity System",
        description:
          "Typography, colour, iconography, and layout principles codified into a complete design system.",
      },
      {
        title: "Brand Guidelines",
        description:
          "Comprehensive documentation ensuring your identity is applied consistently across every touchpoint.",
      },
      {
        title: "Brand Activation",
        description:
          "Applying the new identity across all collateral — digital, print, signage, and video.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Research",
        description:
          "Market analysis, competitor audit, and audience insights to define your strategic position.",
      },
      {
        step: "02",
        title: "Strategy",
        description:
          "Brand platform, messaging architecture, and creative direction defined and aligned.",
      },
      {
        step: "03",
        title: "Design",
        description:
          "Visual identity exploration, refinement, and final system build.",
      },
      {
        step: "04",
        title: "Launch",
        description:
          "Brand rollout planning, guidelines delivery, and activation across all channels.",
      },
    ],
  },
  {
    slug: "spatial-booth",
    number: "04",
    title: "Spatial & Booth",
    shortDescription:
      "Exhibition environments built through architectural storytelling and spatial precision.",
    longDescription:
      "We design and build exhibition stands, pavilions, and spatial brand environments that command attention on any floor — from LEAP to Cityscape to international trade shows.",
    tags: ["Exhibition", "3D Design", "Pavilions"],
    heroTagline: "Space that speaks.",
    overview:
      "Your exhibition stand is the physical manifestation of your brand. We design spaces that stop foot traffic, invite exploration, and communicate your brand's authority through architecture, lighting, and content. We handle design through to build and breakdown.",
    offerings: [
      {
        title: "Exhibition Stand Design",
        description:
          "Custom-designed stands from concept to detailed drawings, tailored to your brand and space.",
      },
      {
        title: "3D Visualisation",
        description:
          "Photorealistic renders so you see exactly what you're getting before a single panel is cut.",
      },
      {
        title: "Fabrication & Build",
        description:
          "In-house manufacturing and on-site build, ensuring quality control at every stage.",
      },
      {
        title: "Digital Integration",
        description:
          "LED walls, interactive screens, and digital content designed specifically for your spatial environment.",
      },
      {
        title: "Pavilion Design",
        description:
          "Large-scale national or corporate pavilions for major exhibitions and world expos.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Brief",
        description:
          "Space dimensions, objectives, audience, and brand guidelines reviewed to define the design brief.",
      },
      {
        step: "02",
        title: "Design",
        description:
          "Concept development, 3D modelling, and visualisation produced for approval.",
      },
      {
        step: "03",
        title: "Build",
        description:
          "Fabrication, finishing, and pre-build QA carried out in our production facility.",
      },
      {
        step: "04",
        title: "Install",
        description:
          "On-site installation, dressing, and digital content deployment — ready for day one.",
      },
    ],
  },
  {
    slug: "interior-design",
    number: "05",
    title: "Interior Design",
    shortDescription:
      "Commercial environments visualised through cinematic precision and creative vision.",
    longDescription:
      "We apply our visual storytelling expertise to interior design — creating commercial spaces, offices, and retail environments that communicate brand values through every material and surface.",
    tags: ["Commercial", "Visualization", "Fitout"],
    heroTagline: "Spaces that reflect who you are.",
    overview:
      "We bring the same attention to detail we apply to film into the physical spaces where your brand lives. From concept to detailed drawings and 3D visualisation, we create interiors that are functional, on-brand, and genuinely impressive.",
    offerings: [
      {
        title: "Concept Design",
        description:
          "Creative direction for your space — mood boards, material palettes, and layout principles.",
      },
      {
        title: "3D Visualisation",
        description:
          "Photorealistic interior renders so decisions are made with full visual confidence.",
      },
      {
        title: "Office Environments",
        description:
          "Workspace design that reflects your culture, improves productivity, and impresses visitors.",
      },
      {
        title: "Retail & Showroom Design",
        description:
          "Commercial interiors designed to drive dwell time, brand recall, and conversion.",
      },
      {
        title: "Fitout Coordination",
        description:
          "Coordinating contractors, suppliers, and timelines to deliver on schedule and on budget.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Discovery",
        description:
          "Site survey, brand review, and brief — understanding your space, people, and goals.",
      },
      {
        step: "02",
        title: "Concept",
        description:
          "Mood boards, layout options, and material selection presented for feedback.",
      },
      {
        step: "03",
        title: "Development",
        description:
          "Detailed drawings, specifications, and 3D renders developed and refined.",
      },
      {
        step: "04",
        title: "Delivery",
        description:
          "Fitout coordination, site supervision, and final handover walkthrough.",
      },
    ],
  },
  {
    slug: "social-digital",
    number: "06",
    title: "Social & Digital",
    shortDescription:
      "Performance-driven content ecosystems built for dominance across every platform.",
    longDescription:
      "We create social and digital content that performs — consistently, at scale, and with the same cinematic quality you'd expect from a premium production company. No filler. No template content.",
    tags: ["Social Media", "Campaigns", "Content Strategy"],
    heroTagline: "Content that converts. At scale.",
    overview:
      "Social media is the new broadcast. We build content systems that keep your brand active, relevant, and visually dominant across Instagram, X, LinkedIn, TikTok, and beyond. From strategy to production to scheduling — we own the whole ecosystem.",
    offerings: [
      {
        title: "Content Strategy",
        description:
          "Platform-specific content plans built around your audience's behaviour and your business objectives.",
      },
      {
        title: "Short-Form Video",
        description:
          "Reels, TikToks, and YouTube Shorts produced with cinematic quality and platform-native instincts.",
      },
      {
        title: "Campaign Production",
        description:
          "Multi-asset campaign shoots delivering content for 30, 60, and 90-day deployment cycles.",
      },
      {
        title: "Motion Graphics & Animation",
        description:
          "Animated content that communicates complex ideas simply and with visual impact.",
      },
      {
        title: "Content Retainer",
        description:
          "Monthly or quarterly retainers providing consistent, high-quality output on a predictable cadence.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Audit",
        description:
          "Review of existing channels, content, and competitor landscape to identify opportunities.",
      },
      {
        step: "02",
        title: "Strategy",
        description:
          "Content pillars, posting cadence, format mix, and campaign calendar defined.",
      },
      {
        step: "03",
        title: "Produce",
        description:
          "Batch shoots and production sprints delivering high volumes of premium content efficiently.",
      },
      {
        step: "04",
        title: "Optimise",
        description:
          "Monthly performance reviews and strategy adjustments based on what the data tells us.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
