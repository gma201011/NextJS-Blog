import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.NEXT_PUBLIC_MONGODB_URL as string);
  return client;
}