import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(products.map(p => ({
            ...p,
            specs: JSON.parse(p.specs),
            images: JSON.parse(p.images),
            files: JSON.parse(p.files)
        })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    const productId = req.params.id as string;
    try {
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({
            ...product,
            specs: JSON.parse(product.specs),
            images: JSON.parse(product.images),
            files: JSON.parse(product.files)
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    const { name, price, description, specs } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    try {
        const imageUrls = files?.['images']?.map(f => `/uploads/${f.filename}`) || [];
        const attachedFiles = files?.['files']?.map(f => ({
            name: f.originalname,
            url: `/uploads/${f.filename}`
        })) || [];

        const product = await prisma.product.create({
            data: {
                name: name as string,
                price: price ? parseFloat(price as string) : null,
                description: description as string,
                specs: (specs as string) || '{}',
                images: JSON.stringify(imageUrls),
                files: JSON.stringify(attachedFiles)
            }
        });

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create product' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, price, description, specs } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    try {
        const existingProduct = await prisma.product.findUnique({ where: { id: id as string } });
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const imageUrls = files?.['images']
            ? files['images'].map(f => `/uploads/${f.filename}`)
            : JSON.parse(existingProduct.images);

        const attachedFiles = files?.['files']
            ? files['files'].map(f => ({ name: f.originalname, url: `/uploads/${f.filename}` }))
            : JSON.parse(existingProduct.files);

        const productId = id as string;
        const nameStr = name as string | undefined;
        const priceStr = price as string | undefined;
        const descriptionStr = description as string | undefined;
        const specsStr = specs as string | undefined;

        const product = await prisma.product.update({
            where: { id: productId },
            data: {
                name: nameStr !== undefined ? nameStr : existingProduct.name,
                price: priceStr !== undefined ? parseFloat(priceStr) : existingProduct.price,
                description: descriptionStr !== undefined ? descriptionStr : existingProduct.description,
                specs: specsStr !== undefined ? specsStr : existingProduct.specs,
                images: JSON.stringify(imageUrls),
                files: JSON.stringify(attachedFiles)
            }
        });

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const productId = id as string;
    try {
        await prisma.product.delete({ where: { id: productId } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
