import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { connectDB } from './db/connection.js';
import { productRoutes } from './routes/products.js';
import { indexRoutes } from './routes/indexes.js';

const fastify: FastifyInstance = Fastify({
  logger: true
});

// Register CORS
await fastify.register(cors, {
  origin: true
});

// Connect to MongoDB
await connectDB();

// Register routes
await fastify.register(productRoutes, { prefix: '/api' });
await fastify.register(indexRoutes, { prefix: '/api' });

// Health check
fastify.get('/health', async () => {
  return { status: 'ok' };
});

// Start server
const start = async (): Promise<void> => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server listening on http://0.0.0.0:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();


