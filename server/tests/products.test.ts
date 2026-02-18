import request from 'supertest';
import app from '../src/app';
import prisma from '../src/utils/prisma';

describe('Products API (Black Box)', () => {
    beforeAll(async () => {
        await prisma.product.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should create a new product', async () => {
        const res = await request(app)
            .post('/api/products')
            .field('name', 'Test Product')
            .field('price', '99.99')
            .field('description', 'Test Description')
            .field('specs', JSON.stringify({ power: '100W' }));

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('Test Product');
        expect(res.body.price).toBe(99.99);
    });

    it('should get all products', async () => {
        const res = await request(app).get('/api/products');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].name).toBe('Test Product');
    });

    it('should get a product by id', async () => {
        const productsRes = await request(app).get('/api/products');
        const productId = productsRes.body[0].id;

        const res = await request(app).get(`/api/products/${productId}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(productId);
        expect(res.body.name).toBe('Test Product');
    });

    it('should update a product', async () => {
        const productsRes = await request(app).get('/api/products');
        const productId = productsRes.body[0].id;

        const res = await request(app)
            .put(`/api/products/${productId}`)
            .field('name', 'Updated Product');

        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Updated Product');
    });

    it('should delete a product', async () => {
        const productsRes = await request(app).get('/api/products');
        const productId = productsRes.body[0].id;

        const res = await request(app).delete(`/api/products/${productId}`);
        expect(res.status).toBe(204);

        const checkRes = await request(app).get(`/api/products/${productId}`);
        expect(checkRes.status).toBe(404);
    });
});
