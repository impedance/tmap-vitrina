import { Request, Response } from 'express';
import { db } from '../utils/db';
import { products } from '../drizzle/schema';
import { eq, desc } from 'drizzle-orm';

const toProductResponse = (p: {
    badges: string;
    images: string;
    features: string;
}) => ({
    ...p,
    badges: JSON.parse(p.badges || '[]'),
    images: JSON.parse(p.images || '[]'),
    features: JSON.parse(p.features || '[]')
});

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
        res.json(allProducts.map((p) => toProductResponse(p as unknown as {
            badges: string;
            images: string;
            features: string;
        })));
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await db.select().from(products).where(eq(products.id, id as string)).get();
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(toProductResponse(product as unknown as {
            badges: string;
            images: string;
            features: string;
        }));
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    const data = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    try {
        const imageUrls = files?.['images']?.map(f => `/uploads/${f.filename}`) || [];
        const inStock = data.inStock === undefined ? true : (data.inStock === 'true' || data.inStock === true);
        const now = new Date().toISOString();

        const result = await db.insert(products).values({
            id: crypto.randomUUID(),
            title: data.title,
            subtitle: data.subtitle,
            price: parseFloat(data.price),
            currency: data.currency || 'RUB',
            weightLabel: data.weightLabel,
            badges: data.badges || '[]',
            images: data.images || JSON.stringify(imageUrls),
            collection: data.collection,
            features: data.features || '[]',
            kind: data.kind,
            description: data.description,
            composition: data.composition,
            storage: data.storage,
            delivery: data.delivery,
            inStock: inStock,
            isB2B: data.isB2B || false,
            origin: data.origin,
            cocoaPercent: data.cocoaPercent,
            createdAt: now,
            updatedAt: now
        }).returning();

        res.status(201).json(toProductResponse(result[0]));
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    try {
        const existingProduct = await db.select().from(products).where(eq(products.id, id as string)).get();
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const imageUrls = files?.['images']
            ? files['images'].map(f => `/uploads/${f.filename}`)
            : JSON.parse(existingProduct.images);

        const now = new Date().toISOString();

        const result = await db.update(products)
            .set({
                title: data.title !== undefined ? data.title : existingProduct.title,
                subtitle: data.subtitle !== undefined ? data.subtitle : existingProduct.subtitle,
                price: data.price !== undefined ? parseFloat(data.price) : existingProduct.price,
                currency: data.currency !== undefined ? data.currency : existingProduct.currency,
                weightLabel: data.weightLabel !== undefined ? data.weightLabel : existingProduct.weightLabel,
                badges: data.badges !== undefined ? data.badges : existingProduct.badges,
                images: data.images !== undefined ? data.images : JSON.stringify(imageUrls),
                collection: data.collection !== undefined ? data.collection : existingProduct.collection,
                features: data.features !== undefined ? data.features : existingProduct.features,
                kind: data.kind !== undefined ? data.kind : existingProduct.kind,
                description: data.description !== undefined ? data.description : existingProduct.description,
                composition: data.composition !== undefined ? data.composition : existingProduct.composition,
                storage: data.storage !== undefined ? data.storage : existingProduct.storage,
                delivery: data.delivery !== undefined ? data.delivery : existingProduct.delivery,
                inStock: data.inStock !== undefined ? (data.inStock === 'true' || data.inStock === true) : existingProduct.inStock,
                updatedAt: now
            })
            .where(eq(products.id, id as string))
            .returning();

        res.json(toProductResponse(result[0]));
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await db.delete(products).where(eq(products.id, id as string));
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
