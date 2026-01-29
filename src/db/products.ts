import { pgTable, uuid, text, decimal, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';


export const categoryEnum = pgEnum('product_category', ['bijuteria', 'croche']);

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  isAvailable: boolean('is_available').default(true),
  imgUrl: text('img_url'),
  category: categoryEnum('category').notNull(),
  subtype: text('subtype').notNull(), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
});