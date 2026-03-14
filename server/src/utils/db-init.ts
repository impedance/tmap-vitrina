import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../drizzle/schema';

const DATABASE_URL = process.env.DATABASE_URL || 'file:/app/data/prod.db';

export async function initDatabase() {
    const client = createClient({ url: DATABASE_URL });
    
    try {
        // Check if tables exist
        const result = await client.execute(`
            SELECT name FROM sqlite_master WHERE type='table' AND name='Product'
        `);
        
        if (result.rows.length === 0) {
            console.log('🔧 Initializing database...');
            
            // Create tables
            await client.execute(`
                CREATE TABLE IF NOT EXISTS "Product" (
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
            `);
            
            await client.execute(`
                CREATE TABLE IF NOT EXISTS "Order" (
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
            `);
            
            // Seed initial products
            const db = drizzle(client, { schema });
            const now = new Date().toISOString();
            
            const products = [
                {
                    id: '550e8400-e29b-41d4-a716-446655440001',
                    title: 'Ashaninka',
                    subtitle: 'Тёмный шоколад, Перу',
                    price: 890,
                    currency: 'RUB',
                    weightLabel: '60 г',
                    badges: '["Vegan","Новинка"]',
                    images: '["/samples/amazing/ashaninka.png"]',
                    collection: 'Классическая серия',
                    features: '["Перу","70% какао"]',
                    kind: 'Плитка',
                    description: 'Изысканный тёмный шоколад из какао-бобов сорта Криолло из региона Ашанинка, Перу. Ноты красных фруктов с лёгкой кислинкой.',
                    composition: 'Какао тёртое, какао масло, сахар тростниковый. Содержание какао solids 70%.',
                    storage: 'Хранить при температуре +15...+21°C, вдали от прямых солнечных лучей.',
                    delivery: 'Доставка по Москве и России. Самовывоз из магазина.',
                    inStock: true,
                    isB2B: false,
                    origin: 'Перу',
                    cocoaPercent: '70%',
                    createdAt: now,
                    updatedAt: now
                },
                {
                    id: '550e8400-e29b-41d4-a716-446655440002',
                    title: 'Chuncho',
                    subtitle: 'Тёмный шоколад, Перу',
                    price: 950,
                    currency: 'RUB',
                    weightLabel: '60 г',
                    badges: '["Vegan","Обладатель премий"]',
                    images: '["/samples/amazing/chunchoqin.jpg"]',
                    collection: 'Классическая серия',
                    features: '["Перу","80% какао","Award winner"]',
                    kind: 'Плитка',
                    description: 'Легендарный шоколад из какао-бобов Чунчо, Перу. Победитель международных конкурсов. Интенсивный вкус с нотами орехов и специй.',
                    composition: 'Какао тёртое, какао масло, сахар тростниковый. Содержание какао solids 80%.',
                    storage: 'Хранить при температуре +15...+21°C, вдали от прямых солнечных лучей.',
                    delivery: 'Доставка по Москве и России. Самовывоз из магазина.',
                    inStock: true,
                    isB2B: false,
                    origin: 'Перу',
                    cocoaPercent: '80%',
                    createdAt: now,
                    updatedAt: now
                },
                {
                    id: '550e8400-e29b-41d4-a716-446655440003',
                    title: 'White Gold',
                    subtitle: 'Белый шоколад, Мадагаскар',
                    price: 820,
                    currency: 'RUB',
                    weightLabel: '60 г',
                    badges: '["Новинка"]',
                    images: '["/samples/amazing/white_gold.png"]',
                    collection: 'Шоколад с начинками',
                    features: '["Мадагаскар","Белый шоколад"]',
                    kind: 'Плитка',
                    description: 'Нежный белый шоколад с мадагаскарской ванилью. Сливочный вкус с ароматом натуральной ванили.',
                    composition: 'Какао масло, сухое молоко, сахар, ваниль мадагаскарская. Содержание какао масла 32%.',
                    storage: 'Хранить при температуре +15...+21°C, вдали от прямых солнечных лучей.',
                    delivery: 'Доставка по Москве и России. Самовывоз из магазина.',
                    inStock: true,
                    isB2B: false,
                    origin: 'Мадагаскар',
                    cocoaPercent: '32%',
                    createdAt: now,
                    updatedAt: now
                },
                {
                    id: '550e8400-e29b-41d4-a716-446655440004',
                    title: 'Guayas Milk',
                    subtitle: 'Молочный шоколад, Эквадор',
                    price: 780,
                    currency: 'RUB',
                    weightLabel: '60 г',
                    badges: '["Vegan","Без сахара"]',
                    images: '["/samples/amazing/guayas_milk.png"]',
                    collection: 'Детская серия',
                    features: '["Эквадор","Молочный","Без сахара"]',
                    kind: 'Плитка',
                    description: 'Мягкий молочный шоколад из региона Гуаяс, Эквадор. Сладкий вкус с карамельными нотами без добавленного сахара.',
                    composition: 'Какао тёртое, какао масло, сухое молоко, подсластитель эритрит. Содержание какао solids 45%.',
                    storage: 'Хранить при температуре +15...+21°C, вдали от прямых солнечных лучей.',
                    delivery: 'Доставка по Москве и России. Самовывоз из магазина.',
                    inStock: true,
                    isB2B: false,
                    origin: 'Эквадор',
                    cocoaPercent: '45%',
                    createdAt: now,
                    updatedAt: now
                }
            ];
            
            for (const product of products) {
                await db.insert(schema.products).values(product);
                console.log(`  ✅ Added: ${product.title}`);
            }
            
            console.log('🎉 Database initialized with 4 products');
        } else {
            console.log('✅ Database already initialized');
        }
    } catch (error) {
        console.error('❌ Database init error:', error);
        throw error;
    }
}
