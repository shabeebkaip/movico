import 'server-only';
import { cache } from 'react';
import { getDb } from './db';
import { CMSContent, CMSDesign, defaultContent, defaultDesign } from './types';

const COLLECTION = 'cms_settings';
const TTL = 30_000; // 30 seconds — cache DB reads in memory

// ─── Process-level cache (survives hot-reload via global) ─────────────────────

interface Cached<T> { data: T; expires: number }

const g = global as typeof globalThis & {
  _cmsContent?: Cached<CMSContent>;
  _cmsDesign?: Cached<CMSDesign>;
};

// ─── Deep merge ───────────────────────────────────────────────────────────────

function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const output = { ...target };
  for (const key in source) {
    const sv = source[key];
    const tv = target[key];
    if (
      sv !== null && typeof sv === 'object' && !Array.isArray(sv) &&
      tv !== null && typeof tv === 'object' && !Array.isArray(tv)
    ) {
      (output as Record<string, unknown>)[key] = deepMerge(tv as object, sv as object);
    } else if (sv !== undefined) {
      (output as Record<string, unknown>)[key] = sv;
    }
  }
  return output;
}

// ─── Content ──────────────────────────────────────────────────────────────────

// `cache()` deduplicates calls within a single React render pass.
// The global TTL cache prevents DB hits across separate requests.
export const readContent = cache(async (): Promise<CMSContent> => {
  if (g._cmsContent && Date.now() < g._cmsContent.expires) {
    return g._cmsContent.data;
  }
  try {
    const db = await getDb();
    const doc = await db.collection(COLLECTION).findOne({ _id: 'content' as unknown });
    const merged = doc
      ? (() => { const { _id, ...rest } = doc; void _id; return deepMerge(defaultContent, rest as Partial<CMSContent>); })()
      : defaultContent;
    g._cmsContent = { data: merged, expires: Date.now() + TTL };
    return merged;
  } catch {
    return defaultContent;
  }
});

export async function writeContent(data: CMSContent): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).replaceOne(
    { _id: 'content' as unknown },
    { _id: 'content', ...data },
    { upsert: true }
  );
  g._cmsContent = { data, expires: Date.now() + TTL };
}

// ─── Design ───────────────────────────────────────────────────────────────────

export const readDesign = cache(async (): Promise<CMSDesign> => {
  if (g._cmsDesign && Date.now() < g._cmsDesign.expires) {
    return g._cmsDesign.data;
  }
  try {
    const db = await getDb();
    const doc = await db.collection(COLLECTION).findOne({ _id: 'design' as unknown });
    const merged = doc
      ? (() => { const { _id, ...rest } = doc; void _id; return deepMerge(defaultDesign, rest as Partial<CMSDesign>); })()
      : defaultDesign;
    g._cmsDesign = { data: merged, expires: Date.now() + TTL };
    return merged;
  } catch {
    return defaultDesign;
  }
});

export async function writeDesign(data: CMSDesign): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).replaceOne(
    { _id: 'design' as unknown },
    { _id: 'design', ...data },
    { upsert: true }
  );
  g._cmsDesign = { data, expires: Date.now() + TTL };
}
