import 'server-only';
import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is not set');

// One promise for the lifetime of the process — survives hot-reload via global
const g = global as typeof globalThis & {
  _mongoPromise?: Promise<MongoClient>;
};

if (!g._mongoPromise) {
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 1,
    connectTimeoutMS: 10_000,
    socketTimeoutMS: 45_000,
    serverSelectionTimeoutMS: 10_000,
    maxIdleTimeMS: 120_000,
  });
  g._mongoPromise = client.connect();
}

const clientPromise = g._mongoPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
}

export async function getClient(): Promise<MongoClient> {
  return clientPromise;
}
