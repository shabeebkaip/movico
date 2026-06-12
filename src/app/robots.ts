import type { MetadataRoute } from 'next';
import { readSeo } from '@/lib/cms/store';

export const dynamic = 'force-dynamic';

export default async function robots(): Promise<MetadataRoute.Robots> {
  try {
    const seo = await readSeo();

    if (seo.robots.blockAIScrapers) {
      return {
        rules: [
          { userAgent: '*', allow: '/' },
          { userAgent: 'GPTBot', disallow: '/' },
          { userAgent: 'ChatGPT-User', disallow: '/' },
          { userAgent: 'CCBot', disallow: '/' },
          { userAgent: 'anthropic-ai', disallow: '/' },
          { userAgent: 'Claude-Web', disallow: '/' },
          { userAgent: 'PerplexityBot', disallow: '/' },
        ],
        sitemap: 'https://movicoksa.com/sitemap.xml',
      };
    }

    return {
      rules: [{ userAgent: '*', allow: '/' }],
      sitemap: 'https://movicoksa.com/sitemap.xml',
    };
  } catch {
    return {
      rules: [{ userAgent: '*', allow: '/' }],
      sitemap: 'https://movicoksa.com/sitemap.xml',
    };
  }
}
