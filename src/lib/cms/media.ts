import 'server-only';
import { getDb } from './db';

export interface MediaAsset {
  id: string;
  url: string;
  publicId: string;
  type: 'image' | 'video';
  alt: string;
  uploadedAt: string;
}

const COLLECTION = 'media_assets';

export async function listMedia(): Promise<MediaAsset[]> {
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find({}).sort({ uploadedAt: -1 }).toArray();
  return docs.map(({ _id, ...rest }) => { void _id; return rest as MediaAsset; });
}

export async function addMedia(asset: Omit<MediaAsset, 'uploadedAt'>): Promise<MediaAsset> {
  const db = await getDb();
  const record: MediaAsset = { ...asset, uploadedAt: new Date().toISOString() };
  await db.collection(COLLECTION).updateOne(
    { id: asset.id },
    { $setOnInsert: record },
    { upsert: true }
  );
  return record;
}

export async function updateMediaAlt(id: string, alt: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).updateOne({ id }, { $set: { alt } });
}

export async function deleteMedia(id: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).deleteOne({ id });
}
