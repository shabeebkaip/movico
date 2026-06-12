import 'server-only';
import { ObjectId } from 'mongodb';
import { getDb } from './db';

export interface CMSBlogPost {
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverAlt: string;
  category: string;
  tags: string[];
  author: string;
  readTime: string;
  publishedAt: string;
  visible: boolean;
  featured: boolean;
  seo: {
    title: string;
    description: string;
    ogImage: string;
    noindex: boolean;
    canonical: string;
  };
  createdAt: Date;
}

const COLLECTION = 'cms_blog';

function toPost(doc: Record<string, unknown>): CMSBlogPost {
  const { _id, ...rest } = doc;
  return { _id: (_id as ObjectId).toString(), ...rest } as CMSBlogPost;
}

export async function listPosts(onlyVisible = true): Promise<CMSBlogPost[]> {
  const db = await getDb();
  const filter = onlyVisible ? { visible: true } : {};
  const docs = await db.collection(COLLECTION).find(filter).sort({ publishedAt: -1 }).toArray();
  return docs.map(toPost);
}

export async function getPostBySlug(slug: string): Promise<CMSBlogPost | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ slug, visible: true });
  return doc ? toPost(doc as Record<string, unknown>) : null;
}

export async function getPostById(id: string): Promise<CMSBlogPost | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? toPost(doc as Record<string, unknown>) : null;
}

export async function createPost(data: Omit<CMSBlogPost, '_id' | 'createdAt'>): Promise<CMSBlogPost> {
  const db = await getDb();
  const doc = { ...data, createdAt: new Date() };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return { _id: result.insertedId.toString(), ...doc };
}

export async function updatePost(id: string, data: Partial<CMSBlogPost>): Promise<void> {
  const db = await getDb();
  const { _id, createdAt, ...update } = data as CMSBlogPost;
  void _id; void createdAt;
  await db.collection(COLLECTION).updateOne({ _id: new ObjectId(id) }, { $set: update });
}

export async function deletePost(id: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}

export async function postCount(): Promise<number> {
  const db = await getDb();
  return db.collection(COLLECTION).countDocuments();
}
