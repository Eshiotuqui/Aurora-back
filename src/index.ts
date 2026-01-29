
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { productRoutes } from './routes/products.routes.js';
import { serve } from '@hono/node-server';

const app = new Hono();


app.use('*', logger());


app.use('*', prettyJSON());


app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
}));


app.get('/', (c) => {
  return c.json({
    status: 'online',
    service: 'aurora-back',
    version: '1.0.0'
  });
});


app.route('/api/products', productRoutes);



app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({
    success: false,
    message: 'Erro interno no servidor',
    error: err.message
  }, 500);
});


app.notFound((c) => {
  return c.json({ message: 'Rota não encontrada' }, 404);
});


const port = 3000;
console.log(`🚀 Aurora API rodando em http://localhost:${port}`);


serve({
  fetch: app.fetch,
  port,
});

export default app;