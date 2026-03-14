import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const DATABASE_URL = process.env.DATABASE_URL || 'file:/app/data/prod.db';

const client = createClient({ url: DATABASE_URL });
const db = drizzle(client, { schema });

const products = [
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Ashaninka',
        subtitle: 'Тёмный шоколад, Перу',
        price: 890,
        currency: 'RUB',
        weightLabel: '60 г',
        badges: '["Vegan","Новинка"]',
        images: '["/assets/products/ashaninka.webp"]',
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        title: 'Chuncho',
        subtitle: 'Тёмный шоколад, Перу',
        price: 950,
        currency: 'RUB',
        weightLabel: '60 г',
        badges: '["Vegan","Обладатель премий"]',
        images: '["/assets/products/chunchoqin.webp"]',
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440003',
        title: 'White Gold',
        subtitle: 'Белый шоколад, Мадагаскар',
        price: 820,
        currency: 'RUB',
        weightLabel: '60 г',
        badges: '["Новинка"]',
        images: '["/assets/products/white_gold.webp"]',
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440004',
        title: 'Guayas Milk',
        subtitle: 'Молочный шоколад, Эквадор',
        price: 780,
        currency: 'RUB',
        weightLabel: '60 г',
        badges: '["Vegan","Без сахара"]',
        images: '["/assets/products/guayas_milk.webp"]',
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

async function seed() {
    try {
        console.log('🌱 Starting seed...');
        
        // Check if products already exist
        const existing = await db.select().from(schema.products).get();
        
        if (existing) {
            console.log('⚠️  Database already has products. Skipping seed.');
            console.log('💡 To re-seed, delete the database file first.');
            return;
        }
        
        // Insert products
        for (const product of products) {
            await db.insert(schema.products).values(product);
            console.log(`✅ Added: ${product.title}`);
        }
        
        console.log('🎉 Seed completed! 4 products added.');
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seed();
