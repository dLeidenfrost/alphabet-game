import Fastify from 'fastify';
import cors from '@fastify/cors';
import { db } from './db/index.js';

const fastify = Fastify({
  logger: true,
});

// Enable CORS for frontend
await fastify.register(cors, {
  origin: 'http://localhost:5173', // Vite default port
});

// Example route
fastify.get('/api/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Example route using the database
fastify.get('/api/example', async () => {
  // Example query (uncomment after creating your schema)
  // const results = await db.select().from(exampleTable);
  return { message: 'Replace this with your actual queries' };
});

// Example POST route for game logic
fastify.post<{
  Body: { letter: string; answer: string };
}>('/api/check-answer', async (request, reply) => {
  const { letter, answer } = request.body;
  
  // Your game logic here
  // For example: check if answer starts with or contains the letter
  const isValid = answer.toLowerCase().includes(letter.toLowerCase());
  
  return { valid: isValid, letter, answer };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
