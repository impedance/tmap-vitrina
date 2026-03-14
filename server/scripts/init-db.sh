#!/bin/sh
set -e

cd /app/server

echo "🔧 Creating database schema..."
node -e "
const { createClient } = require('@libsql/client');

const client = createClient({ url: process.env.DATABASE_URL || 'file:/app/data/prod.db' });

// Create tables directly with libsql client
client.execute(\`
  CREATE TABLE IF NOT EXISTS Product (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    price REAL NOT NULL,
    currency TEXT DEFAULT 'RUB',
    weightLabel TEXT,
    badges TEXT DEFAULT '[]',
    images TEXT DEFAULT '[]',
    collection TEXT,
    features TEXT DEFAULT '[]',
    kind TEXT,
    description TEXT,
    composition TEXT,
    storage TEXT,
    delivery TEXT,
    inStock INTEGER DEFAULT 1,
    isB2B INTEGER DEFAULT 0,
    origin TEXT,
    cocoaPercent TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
\`);

client.execute(\`
  CREATE TABLE IF NOT EXISTS Order (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    comment TEXT,
    deliveryMethod TEXT NOT NULL,
    paymentMethod TEXT,
    items TEXT NOT NULL,
    totalAmount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    createdAt TEXT NOT NULL
  )
\`);

console.log('✅ Schema created');
"

echo "🌱 Running seed..."
DATABASE_URL=$DATABASE_URL node dist/drizzle/seed.js

echo "✅ Done!"
