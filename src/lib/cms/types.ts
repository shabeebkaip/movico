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
  social: {
    instagram: string;
    linkedin: string;
    youtube: string;
  };
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

export interface HomeContent {
  hero: HeroContent;
  marquee: MarqueeContent;
  about: AboutContent;
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
}

// ─── Root CMS Content ─────────────────────────────────────────────────────────

export interface CMSContent {
  global: GlobalContent;
  home: HomeContent;
  about: AboutPageContent;
  contact: ContactPageContent;
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

// ─── Type-safe defaults ───────────────────────────────────────────────────────

export const defaultContent: CMSContent = {
  global: {
    siteName: 'Movico',
    tagline: 'Cinematic production and brand storytelling engineered for impact across the region.',
    email: 'info@movicoksa.com',
    phone: '+966 53 666 0125',
    whatsapp: '+966536660125',
    address: 'Wadi Laban, Riyadh, Saudi Arabia',
    social: {
      instagram: '#',
      linkedin: '#',
      youtube: '#',
    },
  },
  home: {
    hero: {
      label: 'Video Production · Riyadh · Saudi Arabia',
      headlineLine1: 'Corporate Video &',
      cyclePhrases: ['Media Production', 'Event Coverage', 'Brand Films', 'Photography'],
      subtitle:
        "Riyadh's leading corporate video company — brand films, event coverage & media production across Saudi Arabia and the GCC.",
      ctaPrimary: { text: 'Start a Project', href: '#contact' },
      ctaSecondary: { text: 'Watch Reel', href: '#showreel' },
      videoUrl:
        'https://res.cloudinary.com/dm5c31z7w/video/upload/q_auto,f_auto/v1769938198/0201_loykmi.mp4',
      posterUrl: 'https://movicoksa.com/wp-content/uploads/2024/10/6B2A6288-scaled.jpg',
    },
    marquee: {
      row1: 'Cinematic Production Built For Impact',
      row2: 'Video That Moves Brands   •   Brand Films   •   Events   •   Social Content',
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
      videoUrl: 'https://res.cloudinary.com/dm5c31z7w/video/upload/v1769938198/0201_loykmi.mp4',
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
