import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('Product', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    subtitle: text('subtitle'),
    price: real('price').notNull(),
    currency: text('currency').notNull().default('RUB'),
    weightLabel: text('weightLabel'),
    badges: text('badges').notNull().default('[]'),
    images: text('images').notNull().default('[]'),
    collection: text('collection'),
    features: text('features').notNull().default('[]'),
    kind: text('kind'),
    description: text('description'),
    composition: text('composition'),
    storage: text('storage'),
    delivery: text('delivery'),
    inStock: integer('inStock', { mode: 'boolean' }).notNull().default(true),
    isB2B: integer('isB2B', { mode: 'boolean' }).notNull().default(false),
    origin: text('origin'),
    cocoaPercent: text('cocoaPercent'),
    createdAt: text('createdAt').notNull(),
    updatedAt: text('updatedAt').notNull()
});

export const orders = sqliteTable('Order', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    address: text('address'),
    comment: text('comment'),
    deliveryMethod: text('deliveryMethod').notNull(),
    paymentMethod: text('paymentMethod'),
    items: text('items').notNull(),
    totalAmount: real('totalAmount').notNull(),
    status: text('status').notNull().default('pending'),
    createdAt: text('createdAt').notNull()
});
