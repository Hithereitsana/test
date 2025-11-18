import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getDB } from '../db/connection.js';
import { Product } from '../types/product.js';

export async function indexRoutes(fastify: FastifyInstance): Promise<void> {
  const db = getDB();
  const productsCollection = db.collection<Product>('products');

  // Endpoint pour créer ou recréer l'index textuel
  fastify.post<{
    Reply: { message: string } | { error: string };
  }>('/indexes/products', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const indexes = await productsCollection.indexes();
      const textIndex = indexes.find(index => {
        const key = index.key as any;
        return key && key._fts === 'text';
      });
      if (textIndex && textIndex.name) {
        await productsCollection.dropIndex(textIndex.name);
      }
      /* 
      @warn : vous préférerez le seed mais pouvez utiliser cette route `docker-compose run --rm seed npm run seed`
      @todo : créer les indexes nécéssaires pour la recherche et les filtres 
      */
      return { message: 'Index created successfully' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      reply.code(500).send({ error: errorMessage });
    }
  });

  // Endpoint pour lister les index
  fastify.get<{
    Reply: { indexes: any[] } | { error: string };
  }>('/indexes/products', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const indexes = await productsCollection.indexes();
      return { indexes };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      reply.code(500).send({ error: errorMessage });
    }
  });
}
