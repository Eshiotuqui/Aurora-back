import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from "./products.js"; 

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL não encontrada no arquivo .env');
}

const client = postgres(connectionString, { 
  prepare: false 
});

export const db = drizzle(client, { schema });