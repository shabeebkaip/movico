import 'server-only';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { getDb } from './db';

export interface CMSUser {
  _id?: string;
  email: string;
  passwordHash: string;
  role: 'admin';
  createdAt: Date;
  lastLogin?: Date;
}

const COLLECTION = 'cms_users';

export async function findUserByEmail(email: string): Promise<CMSUser | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ email: email.toLowerCase().trim() });
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { _id: _id.toString(), ...rest } as CMSUser;
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function createUser(email: string, password: string): Promise<CMSUser> {
  const db = await getDb();
  const passwordHash = await bcrypt.hash(password, 12);
  const doc: Omit<CMSUser, '_id'> = {
    email: email.toLowerCase().trim(),
    passwordHash,
    role: 'admin',
    createdAt: new Date(),
  };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return { _id: result.insertedId.toString(), ...doc };
}

export async function updateLastLogin(id: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { lastLogin: new Date() } }
  );
}

export async function userCount(): Promise<number> {
  const db = await getDb();
  return db.collection(COLLECTION).countDocuments();
}

export async function updatePassword(id: string, newPassword: string): Promise<void> {
  const db = await getDb();
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { passwordHash, updatedAt: new Date() } }
  );
}
