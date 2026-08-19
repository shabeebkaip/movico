// ─── CTA Link ────────────────────────────────────────────────────────────────

export interface CTALink {
  text: string;
  href: string;
}

// ─── Global ───────────────────────────────────────────────────────────────────

export interface GlobalContent {
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export interface HeroContent {
  label: string;
  headlineLine1: string;
  cyclePhrases: string[];
  subtitle: string;
  ctaPrimary: CTALink;
  ctaSecondary: CTALink;
  videoUrl: string;
  posterUrl: string;
}

// ─── Marquee ──────────────────────────────────────────────────────────────────

export interface MarqueeContent {
  row1: string;
  row2: string;
}

// ─── About ────────────────────────────────────────────────────────────────────

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface AboutContent {
  label: string;
  headingLine1: string;
  headingLine2: string;
  headingHighlight: string;
  headingLine4: string;
  body: string;
  stats: StatItem[];
}

// ─── Services ─────────────────────────────────────────────────────────────────

export interface ServiceItem {
  number: string;
  icon: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
}

export interface ServicesContent {
  label: string;
  headingLine1: string;
  headingHighlight: string;
  subheading: string;
  items: ServiceItem[];
}

// ─── Process ──────────────────────────────────────────────────────────────────

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface ProcessContent {
  label: string;
  heading: string;
  steps: ProcessStep[];
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export interface TestimonialItem {
  text: string;
  image: string;
  name: string;
  role: string;
}

export interface TestimonialsContent {
  label: string;
  heading: string;
  headingHighlight: string;
  headingLine2: string;
  subheading: string;
  items: TestimonialItem[];
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQContent {
  heading: string;
  headingHighlight: string;
  items: FAQItem[];
}

// ─── CTA Section ──────────────────────────────────────────────────────────────

export interface CTAContent {
  label: string;
  headingLine1: string;
  headingLine2: string;
  subtext: string;
  email: string;
  phone: string;
  location: string;
  satisfactionScore: string;
  satisfactionLabel: string;
  ctaButtonText: string;
  videoUrl: string;
}

// ─── Page Hero (simple) ───────────────────────────────────────────────────────

export interface PageHeroContent {
  heading: string;
  label: string;
}

// ─── Home Content ─────────────────────────────────────────────────────────────

export interface WorkShowcaseContent {
  label: string;
  heading: string;
}

export interface HomeContent {
  hero: HeroContent;
  marquee: MarqueeContent;
  about: AboutContent;
  workShowcase: WorkShowcaseContent;
  services: ServicesContent;
  process: ProcessContent;
  testimonials: TestimonialsContent;
  faq: FAQContent;
  cta: CTAContent;
}

// ─── Page Content ─────────────────────────────────────────────────────────────

export interface AboutPageContent {
  hero: PageHeroContent;
}

export interface ContactPageContent {
  hero: PageHeroContent;
  info: {
    email: string;
    phone: string;
    location: string;
    hours: string;
    sideText: string;
  };
  social: {
    instagram: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
    snapchat: string;
    twitter: string;
    facebook: string;
  };
  formspreeId: string;
}

// ─── Studio ───────────────────────────────────────────────────────────────────

export interface StudioPackage {
  number: string;
  title: string;
  tagline: string;
  description: string;
  includes: string[];
  highlight: boolean;
}

export interface StudioWorkImage {
  src: string;
  alt: string;
  wide: boolean;
}

export interface StudioContent {
  hero: {
    headlineLine1: string;
    headlineLine2: string;
    headlineLine3: string;
    subtitle: string;
    ctaPrimary: CTALink;
    ctaSecondary: CTALink;
    heroImage: string;
  };
  marqueeItems: string[];
  space: {
    headingLine1: string;
    headingLine2: string;
    description: string;
    stats: Array<{ value: string; label: string }>;
    heroImage: string;
    smallImage: string;
    bottomImages: Array<{ src: string; label: string }>;
  };
  work: {
    heading: string;
    headingAccent: string;
    subtext: string;
    inlineCTAHeading: string;
    inlineCTASubtext: string;
    images: StudioWorkImage[];
  };
  packages: {
    headingLine1: string;
    headingLine2: string;
    subtext: string;
    items: StudioPackage[];
  };
  quote: {
    line1: string;
    line2: string;
    line3: string;
    bgImage: string;
  };
  finalCTA: {
    headingLine1: string;
    headingLine2: string;
    headingLine3: string;
    body: string;
    ctaPrimary: CTALink;
    ctaSecondary: CTALink;
    images: string[];
  };
}

// ─── Root CMS Content ─────────────────────────────────────────────────────────

export interface CMSContent {
  global: GlobalContent;
  home: HomeContent;
  about: AboutPageContent;
  contact: ContactPageContent;
  studio: StudioContent;
}

// ─── Design ───────────────────────────────────────────────────────────────────

export interface CMSDesign {
  colors: {
    primary: string;
    primaryDark: string;
  };
  typography: {
    headingScale: number;
    bodyScale: number;
  };
  spacing: {
    sectionPadding: string;
  };
  layout: {
    servicesColumns: number;
    heroStyle: string;
    testimonialsLayout: string;
    processLayout: string;
  };
  sections: {
    home: {
      hero: boolean;
      marquee: boolean;
      clients: boolean;
      about: boolean;
      workShowcase: boolean;
      services: boolean;
      studioPromo: boolean;
      showreel: boolean;
      caseStudy: boolean;
      process: boolean;
      testimonials: boolean;
      insights: boolean;
      faq: boolean;
      cta: boolean;
    };
  };
  animations: {
    enabled: boolean;
  };
  sceneDividers: {
    enabled: boolean;
  };
}

// ─── SEO ──────────────────────────────────────────────────────────────────────

export interface SEOPageMeta {
  title: string;
  description: string;
  ogImage: string;
  noindex: boolean;
  canonical: string;
}

export interface SEORedirect {
  id: string;
  from: string;
  to: string;
  code: 301 | 302;
  enabled: boolean;
}

export interface CMSSeo {
  global: {
    titleTemplate: string;
    defaultDescription: string;
    defaultOgImage: string;
    twitterHandle: string;
    twitterCardType: 'summary' | 'summary_large_image';
  };
  pages: {
    home: SEOPageMeta;
    about: SEOPageMeta;
    contact: SEOPageMeta;
    studio: SEOPageMeta;
    projects: SEOPageMeta;
    services: SEOPageMeta;
  };
  schema: {
    organization: {
      name: string;
      url: string;
      logo: string;
      description: string;
      sameAs: string[];
    };
    localBusiness: {
      enabled: boolean;
      type: string;
      name: string;
      streetAddress: string;
      city: string;
      region: string;
      country: string;
      postalCode: string;
      phone: string;
      email: string;
    };
  };
  analytics: {
    ga4Id: string;
    gtmId: string;
  };
  robots: {
    customContent: string;
    blockAIScrapers: boolean;
  };
  redirects: SEORedirect[];
}

const emptyPageMeta: SEOPageMeta = {
  title: '',
  description: '',
  ogImage: '',
  noindex: false,
  canonical: '',
};

export const defaultSeo: CMSSeo = {
  global: {
    titleTemplate: '%s | Movico',
    defaultDescription: "Riyadh's leading corporate video production company. Brand films, event coverage, corporate videos & media production across Saudi Arabia and the GCC.",
    defaultOgImage: '',
    twitterHandle: '',
    twitterCardType: 'summary_large_image',
  },
  pages: {
    home: { ...emptyPageMeta, title: 'Movico — Corporate Video Production Company Riyadh, Saudi Arabia' },
    about: { ...emptyPageMeta, title: 'About Movico' },
    contact: { ...emptyPageMeta, title: 'Contact Movico' },
    studio: { ...emptyPageMeta, title: 'Movico Studio — Riyadh' },
    projects: { ...emptyPageMeta, title: 'Our Projects' },
    services: { ...emptyPageMeta, title: 'Our Services' },
  },
  schema: {
    organization: {
      name: 'Movico',
      url: 'https://movicoksa.com',
      logo: 'https://movicoksa.com/logo.webp',
      description: "Riyadh's leading corporate video production company.",
      sameAs: [],
    },
    localBusiness: {
      enabled: true,
      type: 'LocalBusiness',
      name: 'Movico',
      streetAddress: 'Wadi Laban',
      city: 'Riyadh',
      region: 'Riyadh Region',
      country: 'SA',
      postalCode: '',
      phone: '+966536660125',
      email: 'info@movicoksa.com',
    },
  },
  analytics: {
    ga4Id: '',
    gtmId: '',
  },
  robots: {
    customContent: 'User-agent: *\nAllow: /\n\nSitemap: https://movicoksa.com/sitemap.xml',
    blockAIScrapers: false,
  },
  redirects: [],
};

// ─── Type-safe defaults ───────────────────────────────────────────────────────

export const defaultContent: CMSContent = {
  global: {
    siteName: 'Movico',
    tagline: 'Cinematic production and brand storytelling engineered for impact across the region.',
    email: 'info@movicoksa.com',
    phone: '+966 53 666 0125',
    whatsapp: '+966536660125',
    address: 'Wadi Laban, Riyadh, Saudi Arabia',
  },
  home: {
    hero: {
      label: 'Video Production · Riyadh · Saudi Arabia',
      headlineLine1: 'Corporate Video &',
      cyclePhrases: ['Media Production', 'Event Coverage', 'Brand Films', 'Photography'],
      subtitle:
        "Riyadh's leading corporate video company — brand films, event coverage & media production across Saudi Arabia and the GCC.",
      ctaPrimary: { text: 'Start a Project', href: '/contact' },
      ctaSecondary: { text: 'Watch Reel', href: '#showreel' },
      videoUrl:
        'https://vz-77191ad4-50a.b-cdn.net/34d823c8-1925-46b4-aeb8-f33c6eba6739/play_1080p.mp4',
      posterUrl:
        'https://vz-77191ad4-50a.b-cdn.net/34d823c8-1925-46b4-aeb8-f33c6eba6739/thumbnail.jpg',
    },
    marquee: {
      row1: 'Cinematic Production Built For Impact',
      row2: 'Video That Moves Brands   •   Brand Films   •   Events   •   Social Content',
    },
    workShowcase: {
      label: 'Selected Work',
      heading: 'Our Work',
    },
    about: {
      label: 'Who We Are',
      headingLine1: "Riyadh's corporate",
      headingLine2: 'video company',
      headingHighlight: 'built for impact',
      headingLine4: 'across Saudi Arabia.',
      body: 'Movico is a Riyadh-based media production studio specialising in corporate videos, event coverage, and brand films — engineered for maximum commercial impact across Saudi Arabia and the GCC.',
      stats: [
        { value: 150, suffix: '+', label: 'Projects Completed' },
        { value: 60, suffix: '+', label: 'Brands Served' },
        { value: 6, suffix: '', label: 'Cities in Saudi Arabia' },
        { value: 4, suffix: '+', label: 'Years Active' },
      ],
    },
    services: {
      label: 'What We Do',
      headingLine1: 'Media Production',
      headingHighlight: 'Services',
      subheading:
        'Corporate video, event coverage, photography & brand production — serving companies across Saudi Arabia from our Riyadh studio.',
      items: [
        {
          number: '01',
          icon: 'Video',
          title: 'Video Production',
          description:
            "Corporate videos, brand films, and commercials for Saudi Arabia's leading companies — from concept to final cut in Riyadh.",
          tags: ['Corporate Videos', 'Brand Films', 'Commercials'],
          href: '/services/video-production',
        },
        {
          number: '02',
          icon: 'CalendarDays',
          title: 'Event Coverage',
          description:
            'Professional event coverage across Saudi Arabia — conferences, product launches, and brand activations captured with cinematic precision.',
          tags: ['Live Events', 'Conferences', 'Saudi Arabia'],
          href: '/services/event-production',
        },
        {
          number: '03',
          icon: 'Layers',
          title: 'Brand Identity',
          description:
            'Strategic brand systems designed for longevity, authority, and regional impact across the Saudi market.',
          tags: ['Logo', 'Visual Systems', 'Strategy'],
          href: '/services/brand-identity',
        },
        {
          number: '04',
          icon: 'Camera',
          title: 'Photography',
          description:
            'Corporate photography, event photography, and commercial shoots for brands across Saudi Arabia and the GCC.',
          tags: ['Corporate', 'Events', 'Commercial'],
          href: '/studio',
        },
        {
          number: '05',
          icon: 'LayoutGrid',
          title: 'Spatial & Booth',
          description:
            'Exhibition environments built through architectural storytelling and spatial precision.',
          tags: ['Exhibition', '3D Design'],
          href: '/services/spatial-booth',
        },
        {
          number: '06',
          icon: 'Sofa',
          title: 'Interior Design',
          description:
            'Commercial environments visualised through cinematic precision and creative vision.',
          tags: ['Commercial', 'Visualization'],
          href: '/services/interior-design',
        },
        {
          number: '07',
          icon: 'Share2',
          title: 'Social & Digital',
          description:
            'Performance-driven content ecosystems built for dominance across every platform.',
          tags: ['Social Media', 'Campaigns', 'Content'],
          href: '/services/social-digital',
        },
        {
          number: '08',
          icon: 'Clapperboard',
          title: 'Media Production',
          description:
            'Full-service media production in Riyadh — documentaries, corporate reels, and long-form content for brands across Saudi Arabia.',
          tags: ['Documentary', 'Media', 'Riyadh'],
          href: '/services/video-production',
        },
      ],
    },
    process: {
      label: 'How We Work',
      heading: 'Our Process',
      steps: [
        {
          number: '01',
          title: 'Discovery',
          description:
            'Understanding objectives, audience and positioning to define creative direction.',
        },
        {
          number: '02',
          title: 'Pre-Production',
          description: 'Concept development, scripting, casting and logistical planning.',
        },
        {
          number: '03',
          title: 'Production',
          description: 'Cinematography, lighting design and coordinated on-set execution.',
        },
        {
          number: '04',
          title: 'Post-Production',
          description: 'Editing, grading, sound design and motion refinement.',
        },
        {
          number: '05',
          title: 'Distribution',
          description: 'Platform optimisation and strategic rollout for maximum impact.',
        },
      ],
    },
    testimonials: {
      label: 'Client Stories',
      heading: 'What Our',
      headingHighlight: 'Clients',
      headingLine2: 'Say',
      subheading:
        "Trusted by Saudi Arabia's most ambitious brands — here's what they say about working with Movico.",
      items: [
        {
          text: 'Movico delivered beyond our expectations. The execution was precise, cinematic, and perfectly aligned with our brand objectives.',
          image: 'https://randomuser.me/api/portraits/men/32.jpg',
          name: 'Khalid Al-Rashid',
          role: 'Marketing Director, NEOM',
        },
        {
          text: 'From concept to final delivery, their production workflow was disciplined and seamless. Outstanding creative direction throughout.',
          image: 'https://randomuser.me/api/portraits/women/44.jpg',
          name: 'Sarah Al-Mutairi',
          role: 'Event Director, World Defense Show',
        },
        {
          text: 'The level of creative direction and technical control was unmatched. Movico is truly a world-class production studio.',
          image: 'https://randomuser.me/api/portraits/men/55.jpg',
          name: 'Ahmed Al-Zahrani',
          role: 'Brand Manager, Ford Al Jazirah',
        },
        {
          text: 'Incredible storytelling paired with flawless production quality. Our brand film exceeded every KPI we set.',
          image: 'https://randomuser.me/api/portraits/women/68.jpg',
          name: 'Nora Al-Harbi',
          role: 'Head of Communications, Alfanar',
        },
        {
          text: 'They understood our vision from day one. The spatial design execution at our booth was truly immersive and drew massive crowds.',
          image: 'https://randomuser.me/api/portraits/men/77.jpg',
          name: 'Faris Al-Otaibi',
          role: 'Events Manager, Leap Conference',
        },
        {
          text: 'Professional, creative, and always on schedule. Movico handled our entire event coverage with cinematic precision.',
          image: 'https://randomuser.me/api/portraits/women/21.jpg',
          name: 'Lama Al-Subaie',
          role: 'Creative Director, Nokia KSA',
        },
        {
          text: 'Our social media content output transformed completely. Engagement tripled within the first month of the campaign launch.',
          image: 'https://randomuser.me/api/portraits/men/41.jpg',
          name: 'Omar Al-Ghamdi',
          role: 'Digital Marketing Lead, Philips MEA',
        },
        {
          text: 'The team brought a level of cinematic quality we had only seen in international productions. Truly world-class.',
          image: 'https://randomuser.me/api/portraits/women/33.jpg',
          name: 'Reem Al-Dossary',
          role: 'Brand Lead, Aramco',
        },
        {
          text: 'Working with Movico on our brand identity was transformative. They captured our essence and translated it beautifully.',
          image: 'https://randomuser.me/api/portraits/men/62.jpg',
          name: 'Turki Al-Shehri',
          role: 'CEO, Elm Company',
        },
      ],
    },
    faq: {
      heading: 'Frequently Asked',
      headingHighlight: 'Questions?',
      items: [
        {
          question: 'What types of productions does Movico specialise in?',
          answer:
            'We specialise in high-impact commercials, branded films, large-scale event productions, spatial and booth design, interior visualisation, and social/digital campaigns. Each project is built around cinematic quality and strategic intent.',
        },
        {
          question: 'Where is Movico based and do you work internationally?',
          answer:
            'We are headquartered in Riyadh, Saudi Arabia, and operate across the GCC and internationally. Our portfolio includes landmark productions for World Defense Show, Leap Conference, Neom, and Ford Al Jazirah.',
        },
        {
          question: 'How do I start a production with Movico?',
          answer:
            "Fill out our enquiry form or contact us directly. We schedule a discovery session to understand your objectives, audience, and timeline — then propose a tailored production plan with a transparent quote.",
        },
        {
          question: 'How long does a typical production take?',
          answer:
            'Timelines vary by scope. A corporate film typically takes 4–8 weeks from brief to delivery. Full event productions are planned 8–16 weeks in advance. We always build in time for revisions and quality control.',
        },
        {
          question: 'What is your pricing structure?',
          answer:
            "Every production is scoped individually. We offer transparent project-based quotes after a brief consultation. There are no hidden costs — what's quoted is what's invoiced.",
        },
        {
          question: 'Can Movico handle both creative direction and full execution?',
          answer:
            'Yes. From concepting and scripting to on-set production, post-production, and final delivery — we handle the complete pipeline. You deal with one team, one point of contact, from start to finish.',
        },
      ],
    },
    cta: {
      label: 'Get In Touch',
      headingLine1: "Let's Create",
      headingLine2: 'Something.',
      subtext:
        "Go beyond typical with Movico. You're not just choosing a production company — you're selecting a partner who understands your brand and has a genuine interest in crafting meaningful, impactful cinematic stories.",
      email: 'info@movicoksa.com',
      phone: '+966 53 666 0125',
      location: 'Wadi Laban, Riyadh, Saudi Arabia',
      satisfactionScore: '98%',
      satisfactionLabel: 'Would recommend us',
      ctaButtonText: 'Send Message',
      videoUrl: 'https://vz-77191ad4-50a.b-cdn.net/34d823c8-1925-46b4-aeb8-f33c6eba6739/play_1080p.mp4',
    },
  },
  about: {
    hero: {
      heading: "The Studio Behind Saudi Arabia's Most Impactful Brand Stories.",
      label: 'About Movico',
    },
  },
  contact: {
    hero: {
      heading: "Let's Work Together.",
      label: 'Contact',
    },
    info: {
      email: 'info@movicoksa.com',
      phone: '+966 53 666 0125',
      location: 'Wadi Laban, Riyadh, Saudi Arabia',
      hours: 'Sun – Thu  ·  9:00 AM – 6:00 PM AST',
      sideText: "Go beyond typical with Movico. You're not just choosing a production company — you're selecting a partner who understands your brand and has a genuine interest in crafting meaningful, impactful cinematic stories.",
    },
    social: {
      instagram: '#',
      linkedin: '#',
      youtube: '#',
      tiktok: '#',
      snapchat: '#',
      twitter: '#',
      facebook: '#',
    },
    formspreeId: 'movico-contact',
  },
  studio: {
    hero: {
      headlineLine1: 'Every great visual',
      headlineLine2: 'begins in the',
      headlineLine3: 'right space.',
      subtitle: 'Built for creators, brands, and storytellers. From controlled lighting environments to complete production support — the studio adapts to your vision, not the other way around.',
      ctaPrimary: { text: 'Book the Studio', href: '/contact?service=studio' },
      ctaSecondary: { text: 'View Packages', href: '#packages' },
      heroImage: '/studio/1776759672415.jpg',
    },
    marqueeItems: [
      'Full Lighting Control',
      '4K+ Camera Equipment',
      '5 Studio Packages',
      'Riyadh, KSA',
      'Open Daily',
      'Professional Crew Available',
      'Post-Production In-House',
    ],
    space: {
      headingLine1: 'Step inside',
      headingLine2: 'the studio.',
      description: 'Designed from the ground up for premium production. Flexible setups, full lighting control, and every tool on-hand.',
      stats: [
        { value: '12+', label: 'Light Sources' },
        { value: '5',   label: 'Backdrop Colours' },
        { value: '4K',  label: 'Camera Capability' },
        { value: '∞',   label: 'Creative Setups' },
      ],
      heroImage: '/studio/1776759672085.jpg',
      smallImage: '/studio/1776759672394.jpg',
      bottomImages: [
        { src: '/studio/1776759672182.jpg', label: 'Lighting Corner' },
        { src: '/studio/1776759672064.jpg', label: 'Cyclorama Floor' },
        { src: '/studio/1776759672332.jpg', label: 'Backdrop Zone' },
      ],
    },
    work: {
      heading: 'This is what',
      headingAccent: 'you can create.',
      subtext: 'Every image below was produced inside Movico Studio — by brands, creators, and campaigns just like yours.',
      inlineCTAHeading: 'Ready to create yours?',
      inlineCTASubtext: 'Walk in with your vision. Walk out with content.',
      images: [
        { src: '/studio/DSC00405.jpg', alt: 'Fashion shoot — vibrant backdrop',  wide: false },
        { src: '/studio/DSC00251.jpg', alt: 'Teal background portrait session',  wide: false },
        { src: '/studio/DSC00336.jpg', alt: 'Group brand campaign',              wide: true  },
        { src: '/studio/DSC00358.jpg', alt: 'Editorial portrait session',         wide: false },
        { src: '/studio/DSC01860.jpg', alt: 'Fashion editorial',                  wide: false },
        { src: '/studio/DSC00369.jpg', alt: 'Vibrant color session',              wide: false },
        { src: '/studio/DSC01903.jpg', alt: 'Lifestyle campaign shoot',           wide: true  },
        { src: '/studio/DSC02006.jpg', alt: 'Minimal portrait shoot',             wide: false },
        { src: '/studio/DSC00346.jpg', alt: 'Purple editorial session',           wide: false },
        { src: '/studio/DSC00269.jpg', alt: 'Content creator shoot',              wide: false },
      ],
    },
    packages: {
      headingLine1: 'Flexible solutions',
      headingLine2: 'for every shoot.',
      subtext: 'Five packages, one studio. Every option can be customised — just ask.',
      items: [
        {
          number: '01',
          title: 'Studio Floor Rental',
          tagline: 'Your space, your rules.',
          description: 'A fully equipped professional studio for rent. Ideal for independent creators who need a reliable, ready-to-use environment.',
          includes: ['Spacious studio floor', 'Basic lighting setup', 'Power access', 'Changing area'],
          highlight: false,
        },
        {
          number: '02',
          title: 'Floor + Equipment',
          tagline: 'Better quality, zero logistics.',
          description: 'Professional equipment included. Designed for creators who want elevated quality without managing the overhead.',
          includes: ['Studio floor', 'Professional lighting setups', 'Camera support equipment', 'Grip and accessories'],
          highlight: false,
        },
        {
          number: '03',
          title: 'Floor + Production Team',
          tagline: 'Bring the vision. We handle the rest.',
          description: 'Our experienced crew steps in. Perfect for brands who want a seamlessly guided shoot from start to finish.',
          includes: ['Studio floor', 'Equipment setup', 'Production crew', 'Shoot management support'],
          highlight: false,
        },
        {
          number: '04',
          title: 'Production + Post',
          tagline: 'Captured and delivered, polished.',
          description: 'End-to-end — from shoot floor to final delivery. Your content captured, graded, and ready to publish.',
          includes: ['Studio floor', 'Full production team', 'Editing and colour grading', 'Final output delivery'],
          highlight: false,
        },
        {
          number: '05',
          title: 'Premium Package',
          tagline: 'From concept to final frame — everything.',
          description: 'Full-scale production for high-end campaigns, brand films, and commercials. Every element handled under one roof.',
          includes: ['Studio space', 'Professional models', 'Complete production team', 'Advanced equipment', 'Post-production — editing, grading, sound', 'Creative direction support'],
          highlight: true,
        },
      ],
    },
    quote: {
      line1: 'From a single frame to a complete story —',
      line2: 'Movico Studio',
      line3: 'is where your vision becomes real.',
      bgImage: '/studio/1776759672622.jpg',
    },
    finalCTA: {
      headingLine1: 'Your shoot.',
      headingLine2: 'Our studio.',
      headingLine3: "Let's go.",
      body: "Whether you're a brand, a creator, or an agency — Movico Studio is equipped to make your next project look exceptional. Book a session or talk to us about a full production package.",
      ctaPrimary: { text: 'Book the Studio', href: '/contact?service=studio' },
      ctaSecondary: { text: 'See Packages', href: '#packages' },
      images: ['/studio/1776759672291.jpg', '/studio/DSC01860.jpg', '/studio/1776759672218.jpg'],
    },
  },
};

export const defaultDesign: CMSDesign = {
  colors: {
    primary: '#d98629',
    primaryDark: '#c4771e',
  },
  typography: {
    headingScale: 1.0,
    bodyScale: 1.0,
  },
  spacing: {
    sectionPadding: 'default',
  },
  layout: {
    servicesColumns: 4,
    heroStyle: 'fullscreen',
    testimonialsLayout: 'columns',
    processLayout: 'horizontal',
  },
  sections: {
    home: {
      hero: true,
      marquee: true,
      clients: true,
      about: true,
      workShowcase: true,
      services: true,
      studioPromo: true,
      showreel: true,
      caseStudy: true,
      process: true,
      testimonials: true,
      insights: true,
      faq: true,
      cta: true,
    },
  },
  animations: {
    enabled: true,
  },
  sceneDividers: {
    enabled: true,
  },
};
