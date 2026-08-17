import 'server-only';
import { ObjectId } from 'mongodb';
import { getDb } from './db';

export type GalleryItem =
  | { type: 'image'; url: string }
  | {
      type: 'video';
      url: string;
      bunnyVideoId?: string;
      cloudinaryVideoUrl?: string;
      cloudinaryPublicId?: string;
      thumbnailUrl?: string;
    };

export interface CMSService {
  _id?: string;
  slug: string;
  number: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  tags: string[];
  heroTagline: string;
  heroImage?: string;
  overview: string;
  offerings: { title: string; description: string }[];
  process: { step: string; title: string; description: string }[];
  stats?: { value: string; label: string }[];
  gallery?: GalleryItem[];
  showreelPoster?: string;
  showreelUrl?: string;
  showreelBunnyVideoId?: string;
  showreelCloudinaryVideoUrl?: string;
  showreelCloudinaryPublicId?: string;
  icon: string;
  order: number;
  visible: boolean;
  createdAt: Date;
}

const COLLECTION = 'cms_services';

// Legacy docs (e.g. event-production) stored `gallery` as a plain string[]
// of Cloudinary image URLs. Normalize on read to the new GalleryItem[]
// shape so old data keeps working without a DB migration.
function normalizeGallery(gallery: unknown): GalleryItem[] | undefined {
  if (!Array.isArray(gallery)) return undefined;
  return gallery.map((item) =>
    typeof item === 'string' ? { type: 'image' as const, url: item } : (item as GalleryItem)
  );
}

function toService(doc: Record<string, unknown>): CMSService {
  const { _id, ...rest } = doc;
  return {
    _id: (_id as ObjectId).toString(),
    ...rest,
    gallery: normalizeGallery(rest.gallery),
  } as CMSService;
}

export async function listServices(): Promise<CMSService[]> {
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find({ visible: true }).sort({ order: 1 }).toArray();
  return docs.map(toService);
}

export async function listAllServices(): Promise<CMSService[]> {
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find({}).sort({ order: 1 }).toArray();
  return docs.map(toService);
}

export async function getServiceBySlug(slug: string): Promise<CMSService | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ slug, visible: true });
  return doc ? toService(doc as Record<string, unknown>) : null;
}

export async function createService(data: Omit<CMSService, '_id' | 'createdAt'>): Promise<CMSService> {
  const db = await getDb();
  const existing = await db.collection(COLLECTION).findOne({ slug: data.slug });
  if (existing) throw new Error('Slug already in use');
  const doc = { ...data, createdAt: new Date() };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return { _id: result.insertedId.toString(), ...doc };
}

export async function updateService(id: string, data: Partial<CMSService>): Promise<void> {
  const db = await getDb();
  const { _id, createdAt, ...update } = data as CMSService;
  void _id; void createdAt;
  if (update.slug) {
    const existing = await db.collection(COLLECTION).findOne({ slug: update.slug, _id: { $ne: new ObjectId(id) } });
    if (existing) throw new Error('Slug already in use');
  }
  await db.collection(COLLECTION).updateOne({ _id: new ObjectId(id) }, { $set: update });
}

export async function deleteService(id: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}

export async function serviceCount(): Promise<number> {
  const db = await getDb();
  return db.collection(COLLECTION).countDocuments();
}

export async function bulkCreateServices(items: Omit<CMSService, '_id' | 'createdAt'>[]): Promise<number> {
  const db = await getDb();
  const docs = items.map((item) => ({ ...item, createdAt: new Date() }));
  const result = await db.collection(COLLECTION).insertMany(docs);
  return result.insertedCount;
}
