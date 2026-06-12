import 'server-only';
import { ObjectId } from 'mongodb';
import { getDb } from './db';

export interface CMSProject {
  _id?: string;
  slug: string;
  number: string;
  client: string;
  title: string;
  category: string;
  location: string;
  year: string;
  shortDescription: string;
  fullDescription: string;
  result: string;
  tags: string[];
  coverImage: string;
  coverAlt: string;
  images: string[];
  featured: boolean;
  order: number;
  visible: boolean;
  seo?: {
    title: string;
    description: string;
    ogImage: string;
    noindex: boolean;
    canonical: string;
  };
  createdAt: Date;
}

const COLLECTION = 'cms_projects';

function toProject(doc: Record<string, unknown>): CMSProject {
  const { _id, ...rest } = doc;
  return { _id: (_id as ObjectId).toString(), ...rest } as CMSProject;
}

export async function listProjects(): Promise<CMSProject[]> {
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find({ visible: true }).sort({ order: 1 }).toArray();
  return docs.map(toProject);
}

export async function listAllProjects(): Promise<CMSProject[]> {
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find({}).sort({ order: 1 }).toArray();
  return docs.map(toProject);
}

export async function getProjectBySlug(slug: string): Promise<CMSProject | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ slug, visible: true });
  return doc ? toProject(doc as Record<string, unknown>) : null;
}

export async function createProject(data: Omit<CMSProject, '_id' | 'createdAt'>): Promise<CMSProject> {
  const db = await getDb();
  const doc = { ...data, createdAt: new Date() };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return { _id: result.insertedId.toString(), ...doc };
}

export async function updateProject(id: string, data: Partial<CMSProject>): Promise<void> {
  const db = await getDb();
  const { _id, createdAt, ...update } = data as CMSProject;
  void _id; void createdAt;
  await db.collection(COLLECTION).updateOne({ _id: new ObjectId(id) }, { $set: update });
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}

export async function projectCount(): Promise<number> {
  const db = await getDb();
  return db.collection(COLLECTION).countDocuments();
}

export async function bulkCreateProjects(items: Omit<CMSProject, '_id' | 'createdAt'>[]): Promise<number> {
  const db = await getDb();
  const docs = items.map((item) => ({ ...item, createdAt: new Date() }));
  const result = await db.collection(COLLECTION).insertMany(docs);
  return result.insertedCount;
}
