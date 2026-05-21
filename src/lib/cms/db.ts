import 'server-only';
import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is not set in environment variables');

// Reuse connection across requests in development (hot-reload safe)
const globalForMongo = global as typeof globalThis & {
  _mongoClient?: MongoClient;
};

async function getClient(): Promise<MongoClient> {
  if (globalForMongo._mongoClient) return globalForMongo._mongoClient;
  const client = new MongoClient(uri);
  await client.connect();
  globalForMongo._mongoClient = client;
  return client;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db();
}
