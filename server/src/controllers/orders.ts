import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createOrder = async (req: Request, res: Response) => {
    const { name, phone, address, comment, deliveryMethod, items, totalAmount } = req.body;

    try {
        const order = await prisma.order.create({
            data: {
                name,
                phone,
                address,
                comment,
                deliveryMethod,
                items: JSON.stringify(items),
                totalAmount: parseFloat(totalAmount),
                status: 'pending'
            }
        });

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders.map(o => ({
            ...o,
            items: JSON.parse(o.items)
        })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};
