"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orders = exports.products = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
exports.products = (0, sqlite_core_1.sqliteTable)('Product', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    title: (0, sqlite_core_1.text)('title').notNull(),
    subtitle: (0, sqlite_core_1.text)('subtitle'),
    price: (0, sqlite_core_1.real)('price').notNull(),
    currency: (0, sqlite_core_1.text)('currency').notNull().default('RUB'),
    weightLabel: (0, sqlite_core_1.text)('weightLabel'),
    badges: (0, sqlite_core_1.text)('badges').notNull().default('[]'),
    images: (0, sqlite_core_1.text)('images').notNull().default('[]'),
    collection: (0, sqlite_core_1.text)('collection'),
    features: (0, sqlite_core_1.text)('features').notNull().default('[]'),
    kind: (0, sqlite_core_1.text)('kind'),
    description: (0, sqlite_core_1.text)('description'),
    composition: (0, sqlite_core_1.text)('composition'),
    storage: (0, sqlite_core_1.text)('storage'),
    delivery: (0, sqlite_core_1.text)('delivery'),
    inStock: (0, sqlite_core_1.integer)('inStock', { mode: 'boolean' }).notNull().default(true),
    isB2B: (0, sqlite_core_1.integer)('isB2B', { mode: 'boolean' }).notNull().default(false),
    origin: (0, sqlite_core_1.text)('origin'),
    cocoaPercent: (0, sqlite_core_1.text)('cocoaPercent'),
    createdAt: (0, sqlite_core_1.text)('createdAt').notNull(),
    updatedAt: (0, sqlite_core_1.text)('updatedAt').notNull()
});
exports.orders = (0, sqlite_core_1.sqliteTable)('Order', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    name: (0, sqlite_core_1.text)('name').notNull(),
    phone: (0, sqlite_core_1.text)('phone').notNull(),
    address: (0, sqlite_core_1.text)('address'),
    comment: (0, sqlite_core_1.text)('comment'),
    deliveryMethod: (0, sqlite_core_1.text)('deliveryMethod').notNull(),
    paymentMethod: (0, sqlite_core_1.text)('paymentMethod'),
    items: (0, sqlite_core_1.text)('items').notNull(),
    totalAmount: (0, sqlite_core_1.real)('totalAmount').notNull(),
    status: (0, sqlite_core_1.text)('status').notNull().default('pending'),
    createdAt: (0, sqlite_core_1.text)('createdAt').notNull()
});
