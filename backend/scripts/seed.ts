import { MongoClient, ObjectId } from 'mongodb';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27018/products_db';

interface Product {
  _id?: ObjectId;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  inStock: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

async function seed(): Promise<void> {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection<Product>('products');
    
    // Vider la collection
    await collection.deleteMany({});
    console.log('Cleared existing products');

    // Charger les produits depuis le fichier JSON
    const productsJsonPath = join(__dirname, 'products.json');
    const productsData = JSON.parse(readFileSync(productsJsonPath, 'utf-8'));
    
    // Ajouter les dates aux produits
    const now = new Date();
    const products: Product[] = productsData.map((product: Omit<Product, 'createdAt' | 'updatedAt'>) => ({
      ...product,
      createdAt: new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Date aléatoire dans la dernière année
      updatedAt: now
    }));

    // Utiliser bulkWrite pour une insertion plus efficace
    const bulkOps = products.map(product => ({
      insertOne: { document: product }
    }));
    
    const result = await collection.bulkWrite(bulkOps, { ordered: false });
    console.log(`Inserted ${result.insertedCount} products`);

    // Créer des index pour améliorer les performances
    // Index textuel pour la recherche $text (doit être créé avant d'utiliser $text)
    // Inclut name, description, brand, category et tags

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Exécuter le seed
seed()
  .then(() => {
    console.log('Seed script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed script failed:', error);
    process.exit(1);
  });


