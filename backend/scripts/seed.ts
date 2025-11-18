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

const BATCH_SIZE = 1000; // Insert par batch de 1000 pour optimiser les performances

async function seed(): Promise<void> {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection<Product>('products');
    
    // Vérifier le nombre de produits existants
    const existingCount = await collection.countDocuments();
    const MIN_PRODUCTS = 1000;
    
    if (existingCount >= MIN_PRODUCTS) {
      console.log(`✓ Database already has ${existingCount} products (>= ${MIN_PRODUCTS}). Skipping seed.`);
      return;
    }
    
    console.log(`Found ${existingCount} products (need at least ${MIN_PRODUCTS}). Seeding...`);
    console.log('Clearing existing products...');
    await collection.deleteMany({});
    console.log('✓ Cleared existing products');
    
    const productsJsonPath = join(__dirname, 'products.json');
    console.log(`Loading products from ${productsJsonPath}...`);
    const fileContent = readFileSync(productsJsonPath, 'utf-8');
    const productsData = JSON.parse(fileContent);
    console.log(`✓ Loaded ${productsData.length} products from file`);
    
    if (!Array.isArray(productsData)) {
      throw new Error('products.json must contain an array of products');
    }
    
    if (productsData.length === 0) {
      throw new Error('products.json is empty');
    }
    
    const now = new Date();
    console.log('Processing products...');
    const products: Product[] = productsData.map((product: Omit<Product, 'createdAt' | 'updatedAt'>, index: number) => {
      if (index % 1000 === 0) {
        console.log(`  Processed ${index}/${productsData.length} products...`);
      }
      return {
        ...product,
        createdAt: new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Date aléatoire dans la dernière année
        updatedAt: now
      };
    });
    console.log(`✓ Processed all ${products.length} products`);

    // Insertion par batch pour optimiser les performances
    const totalBatches = Math.ceil(products.length / BATCH_SIZE);
    console.log(`Starting insertion of ${products.length} products in ${totalBatches} batches...`);
    let totalInserted = 0;
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);
      const bulkOps = batch.map(product => ({
        insertOne: { document: product }
      }));
      try {
        const result = await collection.bulkWrite(bulkOps, { ordered: false });
        totalInserted += result.insertedCount;
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        console.log(`  ✓ Inserted batch ${batchNum}/${totalBatches} (${totalInserted}/${products.length})`);
      } catch (batchError) {
        console.error(`  ✗ Error inserting batch ${Math.floor(i / BATCH_SIZE) + 1}:`, batchError);
        throw batchError;
      }
    }
    
    console.log(`✓ Successfully inserted ${totalInserted} products out of ${products.length} total`);
    
    if (totalInserted !== products.length) {
      throw new Error(`Mismatch: expected ${products.length} products but inserted ${totalInserted}`);
    }

    // Les index sont créés automatiquement par init-indexes.js au démarrage de MongoDB
    console.log('✓ Seed completed successfully!');
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


