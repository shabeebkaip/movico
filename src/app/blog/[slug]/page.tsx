import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { getPostBySlug, listPosts } from "@/lib/cms/blog";
import { readSeo } from "@/lib/cms/store";
import { JsonLd } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const seo = await readSeo();
  const title = post.seo?.title || post.title;
  const description = post.seo?.description || post.excerpt;
  const ogImage = post.seo?.ogImage || post.coverImage || seo.global.defaultOgImage;

  return {
    title: seo.global.titleTemplate ? seo.global.titleTemplate.replace("%s", title) : `${title} | Movico`,
    description,
    robots: post.seo?.noindex ? { index: false, follow: false } : undefined,
    alternates: post.seo?.canonical ? { canonical: post.seo.canonical } : undefined,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: seo.global.twitterCardType,
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, seo, allPosts] = await Promise.all([
    getPostBySlug(slug),
    readSeo(),
    listPosts(true),
  ]);

  if (!post) notFound();

  const related = allPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: seo.schema.organization.name,
      logo: { "@type": "ImageObject", url: seo.schema.organization.logo },
    },
    datePublished: post.publishedAt,
    url: `https://movicoksa.com/blog/${post.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <JsonLd seo={seo} breadcrumbs={[
        { name: "Home", url: "https://movicoksa.com" },
        { name: "Blog", url: "https://movicoksa.com/blog" },
        { name: post.title, url: `https://movicoksa.com/blog/${post.slug}` },
      ]} />

      <main className="min-h-screen bg-black">
        {/* Hero */}
        <section className="relative pt-40 pb-16 xl:pt-52 xl:pb-20 px-6 md:px-12 xl:px-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(217,134,41,0.06),transparent_60%)]" />
          <div className="relative w-11/12 xl:w-10/12 mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-xs uppercase tracking-[0.2em] transition-colors mb-10"
            >
              <ArrowLeft size={12} /> Back to Blog
            </Link>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#d98629] font-semibold border border-[#d98629]/40 px-3 py-1 rounded-full">
                {post.category}
              </span>
              {post.publishedAt && (
                <span className="flex items-center gap-1.5 text-[11px] text-white/30">
                  <Calendar size={11} />
                  {new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              )}
              {post.readTime && (
                <span className="flex items-center gap-1.5 text-[11px] text-white/30">
                  <Clock size={11} /> {post.readTime}
                </span>
              )}
            </div>

            <h1 className="font-display font-black text-3xl md:text-5xl xl:text-6xl uppercase leading-tight text-white max-w-4xl mb-6">
              {post.title}
            </h1>
            <p className="text-white/50 text-base md:text-lg max-w-2xl leading-relaxed">
              {post.excerpt}
            </p>

            {post.author && (
              <p className="mt-6 text-xs text-white/30 uppercase tracking-[0.2em]">
                By {post.author}
              </p>
            )}
          </div>
        </section>

        {/* Cover Image */}
        {post.coverImage && (
          <section className="px-6 md:px-12 xl:px-20 pb-12">
            <div className="w-11/12 xl:w-10/12 mx-auto">
              <div className="relative aspect-[16/7] rounded-2xl overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.coverAlt || post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1280px) 100vw, 1200px"
                />
              </div>
            </div>
          </section>
        )}

        {/* Content */}
        <section className="px-6 md:px-12 xl:px-20 pb-20 xl:pb-28">
          <div className="w-11/12 xl:w-10/12 mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-16">
              {/* Article body */}
              <article
                className="prose prose-invert prose-lg max-w-none
                  prose-headings:font-display prose-headings:uppercase prose-headings:font-black prose-headings:text-white
                  prose-h2:text-2xl prose-h3:text-xl
                  prose-p:text-white/60 prose-p:leading-relaxed
                  prose-a:text-[#d98629] prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white
                  prose-li:text-white/60
                  prose-blockquote:border-[#d98629] prose-blockquote:text-white/50
                  prose-hr:border-white/10"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Sidebar */}
              <aside className="space-y-8 xl:sticky xl:top-28 self-start">
                {post.tags.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3 flex items-center gap-1.5">
                      <Tag size={10} /> Tags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-[10px] uppercase tracking-[0.15em] border border-white/10 text-white/40 px-3 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {related.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4">Related Posts</p>
                    <div className="space-y-4">
                      {related.map((p) => (
                        <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
                          {p.coverImage && (
                            <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-2">
                              <Image src={p.coverImage} alt={p.coverAlt || p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="320px" />
                            </div>
                          )}
                          <p className="text-xs text-white/60 group-hover:text-white transition-colors leading-snug font-medium uppercase">{p.title}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border border-white/8 rounded-2xl p-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">Start a Project</p>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">
                    Ready to create something remarkable? Let&apos;s talk.
                  </p>
                  <Link
                    href="/contact"
                    className="block text-center text-xs font-bold uppercase tracking-[0.15em] px-5 py-3 rounded-full transition-all duration-300 bg-[#d98629] text-white hover:bg-white hover:text-black"
                  >
                    Get in Touch
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
