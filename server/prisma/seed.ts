import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const products = [
        {
            title: 'Темный шоколад с фундуком',
            subtitle: 'Коллекция Classic',
            price: 450,
            currency: 'RUB',
            weightLabel: '100 г',
            badges: JSON.stringify(['Новинка', 'Best-seller']),
            images: JSON.stringify(['https://picsum.photos/seed/choco1/400/400']),
            collection: 'Classic',
            features: JSON.stringify(['Без сахара', 'Vegan']),
            kind: 'Плитка',
            description: 'Изысканный темный шоколад (70% какао) с цельным обжаренным фундуком.',
            composition: 'Какао-тертое, масло какао, фундук, подсластитель мальтит.',
            storage: 'Хранить при температуре от +15 до +21°C',
            delivery: 'Доставка по Москве 1-2 дня',
            inStock: true,
        },
        {
            title: 'Молочный шоколад с миндалем',
            subtitle: 'Коллекция Classic',
            price: 420,
            currency: 'RUB',
            weightLabel: '100 г',
            badges: JSON.stringify(['Vegan']),
            images: JSON.stringify(['https://picsum.photos/seed/choco2/400/400']),
            collection: 'Classic',
            features: JSON.stringify(['Детям']),
            kind: 'Плитка',
            description: 'Нежный молочный шоколад с лепестками миндаля.',
            composition: 'Какао-масло, сухое кокосовое молоко, миндаль, эритрит.',
            storage: 'Хранить в сухом прохладном месте',
            delivery: 'Самовывоз бесплатно',
            inStock: true,
        },
        {
            title: 'Белый шоколад с малиной',
            subtitle: 'Ягодная серия',
            price: 480,
            currency: 'RUB',
            weightLabel: '100 г',
            badges: JSON.stringify(['Новинка']),
            images: JSON.stringify(['https://picsum.photos/seed/choco3/400/400']),
            collection: 'Berries',
            features: JSON.stringify(['Organic']),
            kind: 'Плитка',
            description: 'Белый шоколад на кокосовом молоке с сублимированной малиной.',
            composition: 'Масло какао, кешью, кокосовая мука, малина.',
            storage: 'Хранить 6 месяцев',
            delivery: 'Доставка по РФ',
            inStock: true,
        },
        {
            title: 'Конфеты ассорти "Премиум"',
            subtitle: 'Набор в коробке',
            price: 1200,
            currency: 'RUB',
            weightLabel: '250 г',
            badges: JSON.stringify(['Premium']),
            images: JSON.stringify(['https://picsum.photos/seed/choco4/400/400']),
            collection: 'Gifts',
            features: JSON.stringify(['Ручная работа']),
            kind: 'Кубики',
            description: 'Набор из 16 конфет с разными начинками: пралине, ганаш, карамель.',
            composition: 'Какао-продукты, орехи, фруктовые пюре, натуральные подсластители.',
            storage: 'Хранить при температуре 18±3°C',
            delivery: 'Курьером до двери',
            inStock: true,
        }
    ];

    for (const product of products) {
        await prisma.product.create({
            data: product,
        });
    }

    console.log('Seed finished!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
