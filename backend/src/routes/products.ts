import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ObjectId } from 'mongodb';
import type { Filter } from 'mongodb';
import { getDB } from '../db/connection.js';
import {
  ProductQueryParams,
  Product,
  ProductsResponse,
  Facets,
} from '../types/product.js';

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
      const hasFullTextIndex =
        textIndex &&
        textIndex.weights &&
        textIndex.weights.name &&
        textIndex.weights.description &&
        textIndex.weights.brand &&
        textIndex.weights.category &&
        textIndex.weights.tags;

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
          tags: 'text',
        });
        console.log(
          'Full text index created (covers name, description, brand, category, tags)',
        );
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
            tags: 'text',
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

  // ANAIS: Route LISTE avec facettes + pagination
  fastify.get<{
    Querystring: ProductQueryParams;
    Reply: ProductsResponse | { error: string };
  }>('/products', async (
    request: FastifyRequest<{ Querystring: ProductQueryParams }>,
    reply: FastifyReply,
  ) => {
    try {
      const {
        search,
        category,
        brand,
        priceMin,
        priceMax,
        inStock,
        page = '1',
        limit = '20',
      } = request.query;

      const pageNumber = Math.max(parseInt(page ?? '1', 10) || 1, 1);
      const pageSize = Math.max(parseInt(limit ?? '20', 10) || 20, 1);
      const skip = (pageNumber - 1) * pageSize;

      const filters: Filter<Product> = {};

      // Recherche texte
      if (search && search.trim()) {
        filters.$text = { $search: search.trim() };
      }

      // Normalisation string | string[] -> string[]
      const normalizeArray = (
        value?: string | string[],
      ): string[] | undefined => {
        if (!value) return;
        if (Array.isArray(value)) return value;
        return value
          .split(',')
          .map(v => v.trim())
          .filter(Boolean);
      };

      const categories = normalizeArray(category);
      if (categories && categories.length > 0) {
        filters.category = { $in: categories };
      }

      const brands = normalizeArray(brand);
      if (brands && brands.length > 0) {
        filters.brand = { $in: brands };
      }

      if (inStock === 'true') filters.inStock = true;
      if (inStock === 'false') filters.inStock = false;

      if (priceMin || priceMax) {
        const priceFilter: any = {};
        if (priceMin) priceFilter.$gte = Number(priceMin);
        if (priceMax) priceFilter.$lte = Number(priceMax);
        if (Object.keys(priceFilter).length > 0) {
          filters.price = priceFilter;
        }
      }

      const [agg] = await productsCollection
        .aggregate<{
          items: Product[];
          totalCount: { value: number }[];
          categories: { _id: string; count: number }[];
          brands: { _id: string; count: number }[];
          availability: { _id: boolean; count: number }[];
          priceRange: { _id: null; min: number; max: number }[];
        }>([
          { $match: filters },
          {
            $facet: {
              items: [
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: pageSize },
              ],
              totalCount: [{ $count: 'value' }],
              categories: [
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { count: -1, _id: 1 } },
              ],
              brands: [
                { $group: { _id: '$brand', count: { $sum: 1 } } },
                { $sort: { count: -1, _id: 1 } },
              ],
              availability: [
                { $group: { _id: '$inStock', count: { $sum: 1 } } },
              ],
              priceRange: [
                {
                  $group: {
                    _id: null,
                    min: { $min: '$price' },
                    max: { $max: '$price' },
                  },
                },
              ],
            },
          },
        ])
        .toArray();

      const total = agg?.totalCount?.[0]?.value ?? 0;
      const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

      /*---------Facettes---------*/
      const categoriesFacet: Facets['categories'] = {};
      for (const c of agg?.categories ?? []) {
        if (c._id) categoriesFacet[c._id] = c.count;
      }

      const brandsFacet: Facets['brands'] = {};
      for (const b of agg?.brands ?? []) {
        if (b._id) brandsFacet[b._id] = b.count;
      }

      let inStockCount = 0;
      let outOfStockCount = 0;
      for (const a of agg?.availability ?? []) {
        if (a._id === true) inStockCount = a.count;
        if (a._id === false) outOfStockCount = a.count;
      }

      const priceAgg = agg?.priceRange?.[0];
      const priceRange: Facets['priceRange'] = {
        min: priceAgg?.min ?? 0,
        max: priceAgg?.max ?? 0,
      };

      const facets: Facets = {
        categories: categoriesFacet,
        brands: brandsFacet,
        priceRange,
        availability: {
          inStock: inStockCount,
          outOfStock: outOfStockCount,
        },
      };

      const response: ProductsResponse = {
        products: agg?.items ?? [],
        pagination: {
          page: pageNumber,
          limit: pageSize,
          total,
          totalPages,
        },
        facets,
      };

      return reply.send(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      reply.code(500).send({ error: errorMessage });
    }
  });

  // Route détail
  fastify.get<{
    Params: ProductParams;
    Reply: Product | { error: string };
  }>('/products/:id', async (
    request: FastifyRequest<{ Params: ProductParams }>,
    reply: FastifyReply,
  ) => {
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
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      reply.code(500).send({ error: errorMessage });
    }
  });
}
