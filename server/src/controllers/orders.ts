import { Request, Response } from 'express';
import { db } from '../utils/db';
import { orders } from '../drizzle/schema';
import { desc } from 'drizzle-orm';

export const createOrder = async (req: Request, res: Response) => {
    const { name, phone, address, comment, deliveryMethod, paymentMethod, items, totalAmount } = req.body;

    try {
        const now = new Date().toISOString();
        
        const result = await db.insert(orders).values({
            id: crypto.randomUUID(),
            name,
            phone,
            address,
            comment,
            deliveryMethod,
            paymentMethod,
            items: JSON.stringify(items),
            totalAmount: parseFloat(totalAmount),
            status: 'pending',
            createdAt: now
        }).returning();

        res.status(201).json(result[0]);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
        res.json(allOrders.map((o) => ({
            ...o,
            items: JSON.parse(o.items)
        })));
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};
