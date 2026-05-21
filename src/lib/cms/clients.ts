import 'server-only';
import { ObjectId } from 'mongodb';
import { getDb } from './db';

export interface CMSClient {
  _id?: string;
  name: string;
  logo: string;
  whiteBg?: boolean;
  order: number;
  visible: boolean;
  createdAt: Date;
}

const COLLECTION = 'cms_clients';

export async function listClients(): Promise<CMSClient[]> {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({ visible: true })
    .sort({ order: 1 })
    .toArray();
  return docs.map(({ _id, ...rest }) => ({ _id: _id.toString(), ...rest } as CMSClient));
}

export async function listAllClients(): Promise<CMSClient[]> {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({})
    .sort({ order: 1 })
    .toArray();
  return docs.map(({ _id, ...rest }) => ({ _id: _id.toString(), ...rest } as CMSClient));
}

export async function createClient(data: Omit<CMSClient, '_id' | 'createdAt'>): Promise<CMSClient> {
  const db = await getDb();
  const doc = { ...data, createdAt: new Date() };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return { _id: result.insertedId.toString(), ...doc };
}

export async function updateClient(id: string, data: Partial<CMSClient>): Promise<void> {
  const db = await getDb();
  const { _id, createdAt, ...update } = data as CMSClient;
  void _id; void createdAt;
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: update }
  );
}

export async function deleteClient(id: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}

export async function clientCount(): Promise<number> {
  const db = await getDb();
  return db.collection(COLLECTION).countDocuments();
}

export async function bulkCreateClients(
  items: Omit<CMSClient, '_id' | 'createdAt'>[]
): Promise<number> {
  const db = await getDb();
  const docs = items.map((item) => ({ ...item, createdAt: new Date() }));
  const result = await db.collection(COLLECTION).insertMany(docs);
  return result.insertedCount;
}
