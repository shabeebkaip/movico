import 'server-only';
import { getDb } from './db';
import { CMSContent, CMSDesign, defaultContent, defaultDesign } from './types';

const COLLECTION = 'cms_settings';

// ─── Deep merge helper ────────────────────────────────────────────────────────

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

export async function readContent(): Promise<CMSContent> {
  try {
    const db = await getDb();
    const doc = await db.collection(COLLECTION).findOne({ _id: 'content' as unknown });
    if (!doc) return defaultContent;
    const { _id, ...data } = doc;
    void _id;
    return deepMerge(defaultContent, data as Partial<CMSContent>);
  } catch {
    return defaultContent;
  }
}

export async function writeContent(data: CMSContent): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).replaceOne(
    { _id: 'content' as unknown },
    { _id: 'content', ...data },
    { upsert: true }
  );
}

// ─── Design ───────────────────────────────────────────────────────────────────

export async function readDesign(): Promise<CMSDesign> {
  try {
    const db = await getDb();
    const doc = await db.collection(COLLECTION).findOne({ _id: 'design' as unknown });
    if (!doc) return defaultDesign;
    const { _id, ...data } = doc;
    void _id;
    return deepMerge(defaultDesign, data as Partial<CMSDesign>);
  } catch {
    return defaultDesign;
  }
}

export async function writeDesign(data: CMSDesign): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).replaceOne(
    { _id: 'design' as unknown },
    { _id: 'design', ...data },
    { upsert: true }
  );
}
