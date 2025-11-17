import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ObjectId } from 'mongodb';
import { getDB } from '../db/connection.js';
import { ProductQueryParams, Product, ProductsResponse } from '../types/product.js';

interface ProductParams {
  id: string;
}

export async function productRoutes(fastify: FastifyInstance): Promise<void> {
  const db = getDB();
  const productsCollection = db.collection<Product>('products');
  
  // Créer l'index textuel s'il n'existe pas déjà (fallback si le seed n'a pas été exécuté)
  // Cette fonction est appelée une seule fois au démarrage des routes
  const ensureIndexes = async () => {
    try {
      // Vérifier si la collection existe
      const collections = await db.listCollections({ name: 'products' }).toArray();
      const collectionExists = collections.length > 0;
      
      if (!collectionExists) {
        // Créer la collection si elle n'existe pas (nécessaire pour créer l'index)
        await db.createCollection('products');
        console.log('Collection "products" created');
      }
      
      // Vérifier si l'index textuel existe et s'il couvre tous les champs nécessaires
      const indexes = await productsCollection.indexes();
      const textIndex = indexes.find(index => {
        const key = index.key as any;
        return key && key._fts === 'text';
      });
      
      // Vérifier si l'index couvre tous les champs (name, description, brand, category, tags)
      const hasFullTextIndex = textIndex && textIndex.weights && 
        textIndex.weights.name && textIndex.weights.description && 
        textIndex.weights.brand && textIndex.weights.category && textIndex.weights.tags;
      
      if (!hasFullTextIndex) {
        // Supprimer l'ancien index textuel s'il existe (partiel)
        if (textIndex && textIndex.name) {
          try {
            await productsCollection.dropIndex(textIndex.name);
            console.log(`Dropped old text index: ${textIndex.name}`);
          } catch (dropError) {
            console.warn('Could not drop old text index:', dropError);
          }
        }
        
        // Créer le nouvel index textuel complet
        await productsCollection.createIndex({ 
          name: 'text', 
          description: 'text',
          brand: 'text',
          category: 'text',
          tags: 'text'
        });
        console.log('Full text index created (covers name, description, brand, category, tags)');
      }
      
      // Créer les autres index s'ils n'existent pas
      const hasCategoryIndex = indexes.some(idx => idx.name === 'category_1');
      const hasBrandIndex = indexes.some(idx => idx.name === 'brand_1');
      const hasPriceIndex = indexes.some(idx => idx.name === 'price_1');
      const hasInStockIndex = indexes.some(idx => idx.name === 'inStock_1');
      
      if (!hasCategoryIndex) await productsCollection.createIndex({ category: 1 });
      if (!hasBrandIndex) await productsCollection.createIndex({ brand: 1 });
      if (!hasPriceIndex) await productsCollection.createIndex({ price: 1 });
      if (!hasInStockIndex) await productsCollection.createIndex({ inStock: 1 });
    } catch (error: any) {
      // Gérer les erreurs spécifiques
      if (error?.code === 26 || error?.codeName === 'NamespaceNotFound') {
        // La collection n'existe pas, on essaie de la créer
        try {
          await db.createCollection('products');
          // Créer les index
          await productsCollection.createIndex({ 
            name: 'text', 
            description: 'text',
            brand: 'text',
            category: 'text',
            tags: 'text'
          });
          await productsCollection.createIndex({ category: 1 });
          await productsCollection.createIndex({ brand: 1 });
          await productsCollection.createIndex({ price: 1 });
          await productsCollection.createIndex({ inStock: 1 });
          console.log('Collection and indexes created (fallback)');
        } catch (createError) {
          console.warn('Could not create collection/indexes:', createError);
        }
      } else {
        console.warn('Could not check/create indexes:', error);
      }
    }
  };
  
  // Appeler une fois au démarrage
  ensureIndexes().catch(console.error);
  
  fastify.get<{
    Querystring: { search?: string };
    Reply: Product[] | { error: string };
  }>('/products', async (request: FastifyRequest<{ Querystring: { search?: string } }>, reply: FastifyReply) => {
    try {
      // @todo : aggreger les données
      const products = await productsCollection.find().toArray();
      return products;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      reply.code(500).send({ error: errorMessage });
    }
  });

  fastify.get<{
    Params: ProductParams;
    Reply: Product | { error: string };
  }>('/products/:id', async (request: FastifyRequest<{ Params: ProductParams }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      let objectId: ObjectId;
      try {
        objectId = new ObjectId(id);
      } catch {
        return reply.code(400).send({ error: 'Invalid product ID' });
      }
      const product = await productsCollection.findOne({ _id: objectId });
      if (!product) {
        return reply.code(404).send({ error: 'Product not found' });
      }
      return product;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      reply.code(500).send({ error: errorMessage });
    }
  });
}


