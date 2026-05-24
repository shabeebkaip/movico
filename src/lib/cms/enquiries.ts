import "server-only";
import { getDb } from "./db";

export type EnquiryStatus = "new" | "viewed" | "archived";

export interface Enquiry {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  budget: string;
  message?: string;
  status: EnquiryStatus;
  createdAt: Date;
}

const COL = "enquiries";

export async function createEnquiry(data: Omit<Enquiry, "_id" | "status" | "createdAt">): Promise<string> {
  const db = await getDb();
  const result = await db.collection(COL).insertOne({
    ...data,
    status: "new" as EnquiryStatus,
    createdAt: new Date(),
  });
  return result.insertedId.toString();
}

export async function listEnquiries(): Promise<Enquiry[]> {
  const db = await getDb();
  const docs = await db.collection(COL).find({}).sort({ createdAt: -1 }).toArray();
  return docs.map((d) => ({ ...d, _id: d._id.toString() })) as unknown as Enquiry[];
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  await db.collection(COL).updateOne({ _id: new ObjectId(id) }, { $set: { status } });
}

export async function deleteEnquiry(id: string): Promise<void> {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  await db.collection(COL).deleteOne({ _id: new ObjectId(id) });
}

export async function countNewEnquiries(): Promise<number> {
  const db = await getDb();
  return db.collection(COL).countDocuments({ status: "new" });
}
