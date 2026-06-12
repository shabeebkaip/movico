import type { MetadataRoute } from 'next';
import { listProjects } from '@/lib/cms/projects';
import { listPosts } from '@/lib/cms/blog';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://movicoksa.com';

const staticRoutes = [
  { path: '/',        priority: 1.0,  changeFreq: 'weekly'  as const },
  { path: '/about',   priority: 0.8,  changeFreq: 'monthly' as const },
  { path: '/contact', priority: 0.7,  changeFreq: 'monthly' as const },
  { path: '/studio',  priority: 0.8,  changeFreq: 'monthly' as const },
  { path: '/projects',priority: 0.9,  changeFreq: 'weekly'  as const },
  { path: '/services',priority: 0.8,  changeFreq: 'monthly' as const },
  { path: '/services/video-production',  priority: 0.7, changeFreq: 'monthly' as const },
  { path: '/services/event-production',  priority: 0.7, changeFreq: 'monthly' as const },
  { path: '/services/brand-identity',    priority: 0.7, changeFreq: 'monthly' as const },
  { path: '/services/social-digital',    priority: 0.7, changeFreq: 'monthly' as const },
  { path: '/services/spatial-booth',     priority: 0.7, changeFreq: 'monthly' as const },
  { path: '/services/interior-design',   priority: 0.7, changeFreq: 'monthly' as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const statics: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFreq,
    priority: r.priority,
  }));

  let projectEntries: MetadataRoute.Sitemap = [];
  try {
    const projects = await listProjects();
    projectEntries = projects.map((p) => ({
      url: `${BASE_URL}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch {
    // proceed without project entries
  }

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await listPosts(true);
    blogEntries = posts.map((p) => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch {
    // proceed without blog entries
  }

  return [...statics, ...projectEntries, ...blogEntries];
}
