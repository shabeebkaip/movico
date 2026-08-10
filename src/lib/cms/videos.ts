import 'server-only';
import { ObjectId } from 'mongodb';
import { getDb } from './db';

export interface CMSVideo {
  _id?: string;
  title: string;
  client?: string;
  category: string;
  isHighlight: boolean;
  order: number;
  cloudinaryVideoPublicId?: string;
  cloudinaryVideoUrl?: string;
  bunnyVideoId?: string;
  thumbnail?: string;
  createdAt: Date;
}

const COLLECTION = 'cms_videos';

export async function listVideos(): Promise<CMSVideo[]> {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({})
    .sort({ isHighlight: -1, order: 1 })
    .toArray();
  return docs.map(({ _id, ...rest }) => ({ _id: _id.toString(), ...rest } as CMSVideo));
}

export async function createVideo(data: Omit<CMSVideo, '_id' | 'createdAt'>): Promise<CMSVideo> {
  const db = await getDb();
  const doc = { ...data, createdAt: new Date() };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return { _id: result.insertedId.toString(), ...doc };
}

export async function updateVideo(id: string, data: Partial<CMSVideo>): Promise<void> {
  const db = await getDb();
  const { _id, createdAt, ...update } = data;
  void _id; void createdAt;
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: update }
  );
}

export async function deleteVideo(id: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}

export async function videoCount(): Promise<number> {
  const db = await getDb();
  return db.collection(COLLECTION).countDocuments();
}
