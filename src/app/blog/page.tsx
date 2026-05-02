import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Insights | Movico — Video Production Riyadh",
  description:
    "Insights on video production, event coverage, and media strategy from Movico — Saudi Arabia's leading corporate video production company based in Riyadh.",
};

const posts = [
  {
    slug: "why-cinematography-matters",
    category: "Production",
    title: "Why cinematography matters more than budget in brand video",
    excerpt:
      "The visual language of a brand film communicates trust, authority, and emotion before a single word is spoken. Here's why quality of light beats quantity of spend.",
    image: "https://movicoksa.com/wp-content/uploads/2024/10/6B2A6288-scaled.jpg",
    date: "March 2025",
    readTime: "5 min read",
  },
  {
    slug: "saudi-brands-winning-on-video",
    category: "Strategy",
    title: "How Saudi brands are winning on video in 2025",
    excerpt:
      "Saudi Arabia's media landscape has transformed. Local brands that once relied on traditional advertising are now commanding global attention through cinematic storytelling.",
    image: "https://movicoksa.com/wp-content/uploads/2024/10/SNIL2230-scaled.jpg",
    date: "February 2025",
    readTime: "7 min read",
  },
  {
    slug: "anatomy-of-world-class-event-production",
    category: "Events",
    title: "The anatomy of a world-class event production",
    excerpt:
      "From pre-production logistics to the final frame of coverage — how Movico approaches large-scale event production for organisations like NEOM and World Defense Show.",
    image: "https://movicoksa.com/wp-content/uploads/2024/10/DSC09438-scaled.jpg",
    date: "January 2025",
    readTime: "6 min read",
  },
  {
    slug: "corporate-video-riyadh-guide",
    category: "Corporate Video",
    title: "The complete guide to corporate video production in Riyadh",
    excerpt:
      "Everything you need to know about commissioning a corporate video in Saudi Arabia — from brief to final delivery. What to expect, what to budget, and how to get results.",
    image: "https://movicoksa.com/wp-content/uploads/2024/10/6B2A6288-scaled.jpg",
    date: "December 2024",
    readTime: "8 min read",
  },
  {
    slug: "event-coverage-saudi-arabia",
    category: "Events",
    title: "Event coverage in Saudi Arabia: what every organiser needs to know",
    excerpt:
      "Professional event coverage goes beyond pointing cameras at a stage. Here's how Movico approaches event media production to deliver content that works long after the event ends.",
    image: "https://movicoksa.com/wp-content/uploads/2024/10/SNIL2230-scaled.jpg",
    date: "November 2024",
    readTime: "5 min read",
  },
  {
    slug: "brand-films-vs-commercials",
    category: "Production",
    title: "Brand films vs. commercials: which does your business need?",
    excerpt:
      "Two powerful video formats, two very different purposes. Understanding the difference helps you invest your production budget where it'll have the most impact.",
    image: "https://movicoksa.com/wp-content/uploads/2024/10/DSC09438-scaled.jpg",
    date: "October 2024",
    readTime: "4 min read",
  },
];

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black pt-40 pb-20 xl:pt-52 xl:pb-28 px-6 md:px-12 xl:px-20 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(217,134,41,0.08),transparent_60%)]" />
        <div className="relative w-11/12 xl:w-10/12 mx-auto">
          <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-6">
            Ideas &amp; Thinking
          </span>
          <h1 className="font-display font-black text-5xl md:text-7xl xl:text-[8rem] uppercase leading-[0.9] text-white mb-6">
            Insights
          </h1>
          <p className="text-white/50 text-base md:text-lg max-w-xl leading-relaxed">
            Production thinking, media strategy, and industry perspectives from
            Riyadh&apos;s leading corporate video company.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="bg-black pb-0 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto">
          <Link href={`/blog/${featured.slug}`} className="group block">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-0 border border-white/8 rounded-2xl overflow-hidden">
              <div className="relative aspect-[4/3] xl:aspect-auto">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1280px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="bg-black p-8 xl:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold border border-primary/40 px-3 py-1 rounded-full">
                      {featured.category}
                    </span>
                    <span className="text-[10px] text-white/30">{featured.date}</span>
                    <span className="text-[10px] text-white/30">{featured.readTime}</span>
                  </div>
                  <h2 className="font-display font-black text-2xl md:text-3xl xl:text-4xl text-white uppercase leading-tight mb-4 group-hover:text-primary transition-colors duration-300">
                    {featured.title}
                  </h2>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {featured.excerpt}
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/30 group-hover:text-primary transition-colors duration-300">
                  Read Article <ArrowRight size={12} />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="bg-black py-12 xl:py-16 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold">
                    {post.category}
                  </span>
                  <span className="text-[10px] text-white/30">{post.date}</span>
                  <span className="text-[10px] text-white/30">{post.readTime}</span>
                </div>

                <h3 className="font-display font-black text-lg xl:text-xl text-white uppercase leading-tight mb-3 group-hover:text-primary transition-colors duration-300">
                  {post.title}
                </h3>

                <p className="text-white/40 text-sm leading-relaxed line-clamp-2 mb-4">
                  {post.excerpt}
                </p>

                <span className="text-xs uppercase tracking-[0.2em] text-white/30 group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                  Read More <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black border-t border-white/8 py-20 xl:py-28 px-6 md:px-12 xl:px-20 text-center">
        <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-6">
          Work With Us
        </span>
        <h2 className="font-display font-black text-3xl md:text-5xl xl:text-6xl uppercase text-white mb-6 leading-tight">
          Ready to start a
          <br />
          <span className="text-primary">project?</span>
        </h2>
        <p className="text-white/40 text-sm max-w-md mx-auto mb-10 leading-relaxed">
          Riyadh&apos;s leading corporate video and media production studio — ready to bring your story to life.
        </p>
        <Link
          href="/contact"
          className="bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] px-10 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center gap-2"
        >
          Start a Project <ArrowRight size={14} />
        </Link>
      </section>
    </main>
  );
}
