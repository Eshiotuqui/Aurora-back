import { db } from "../db/index.js";
import { products } from "../db/products.js";
import type { ProductInput, productSchema } from "../schemas/products.js";
import { eq } from "drizzle-orm"; 
import { z } from 'zod';

type ProductUpdateInput = z.infer<ReturnType<typeof productSchema.partial>>;

export const ProductService = {

  async create(data: ProductInput) {
    const [product] = await db.insert(products).values({
      ...data,
      price: data.price.toString(),
    }).returning();
    
    return product;
  },


  async getAll() {
    return await db.select().from(products);
  },


  async getById(id: string) {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    
    return product || null;
  },


  async update(id: string, data: ProductUpdateInput) {
    const { price, ...rest } = data;

    const [updatedProduct] = await db
      .update(products)
      .set({
        ...rest,
        // Usamos uma checagem segura para garantir que só tentamos converter se houver valor
        ...(price !== undefined && price !== null && { price: price.toString() }),
      })
      .where(eq(products.id, id))
      .returning();
    
    return updatedProduct || null;
  },


  async delete(id: string) {
    const [deletedProduct] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();
    
    return deletedProduct || null;
  }
};