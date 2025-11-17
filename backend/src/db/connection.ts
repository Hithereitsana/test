import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27018/products_db';
let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDB(): Promise<Db> {
  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      // Extraire le nom de la base de données de l'URI ou utiliser 'products_db' par défaut
      const dbName = MONGODB_URI.split('/').pop()?.split('?')[0] || 'products_db';
      db = client.db(dbName);
      console.log(`Connected to MongoDB database: ${dbName}`);
    }
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export function getDB(): Db {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return db;
}


