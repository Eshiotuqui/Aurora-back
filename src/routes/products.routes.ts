import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { baseProductSchema, productSchema } from '../schemas/products.js';
import { ProductService } from '../service/product.service.js';

const productRoutes = new Hono();


const idParamSchema = z.object({
  id: z.string().uuid("ID inválido, deve ser um UUID"),
});


productRoutes.post('/', zValidator('json', productSchema), async (c) => {
  const data = c.req.valid('json');
  const product = await ProductService.create(data);
  return c.json({ message: 'Produto criado!', product }, 201);
});


productRoutes.get('/', async (c) => {
  const products = await ProductService.getAll();
  return c.json(products);
});


productRoutes.get('/:id', zValidator('param', idParamSchema), async (c) => {
  const { id } = c.req.valid('param');
  const product = await ProductService.getById(id);
  
  if (!product) {
    return c.json({ message: 'Produto não encontrado' }, 404);
  }
  
  return c.json(product);
});


productRoutes.patch('/:id', 
  zValidator('param', idParamSchema),
  zValidator('json', baseProductSchema.partial()), 
  async (c) => {
    const { id } = c.req.valid('param');
    const data = c.req.valid('json');
    
    const updated = await ProductService.update(id, data);
    
    if (!updated) {
      return c.json({ message: 'Produto não encontrado' }, 404);
    }
    
    return c.json({ message: 'Produto atualizado!', product: updated });
});


productRoutes.delete('/:id', zValidator('param', idParamSchema), async (c) => {
  const { id } = c.req.valid('param');
  const deleted = await ProductService.delete(id);
  
  if (!deleted) {
    return c.json({ message: 'Produto não encontrado' }, 404);
  }
  
  return c.json({ message: 'Produto removido com sucesso' });
});

export { productRoutes };