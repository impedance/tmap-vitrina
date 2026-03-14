import { db } from '../src/utils/db';
import { products } from '../src/drizzle/schema';
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct
} from '../src/controllers/products';
import { eq } from 'drizzle-orm';

type MockRes = {
    statusCode: number;
    body: any;
    status: (code: number) => MockRes;
    json: (payload: any) => MockRes;
    send: (payload?: any) => MockRes;
};

const createMockRes = (): MockRes => {
    const res: MockRes = {
        statusCode: 200,
        body: undefined,
        status(code: number) {
            res.statusCode = code;
            return res;
        },
        json(payload: any) {
            res.body = payload;
            return res;
        },
        send(payload?: any) {
            res.body = payload;
            return res;
        }
    };
    return res;
};

describe('Products controller', () => {
    beforeAll(async () => {
        await db.delete(products);
    });

    afterAll(async () => {
        // No need to disconnect for SQLite
    });

    it('should create a new product', async () => {
        const req: any = {
            body: {
                title: 'Test Product',
                subtitle: 'Test Subtitle',
                price: '99.99',
                weightLabel: '100 г',
                badges: JSON.stringify(['Новинка']),
                features: JSON.stringify(['Vegan']),
                images: JSON.stringify(['/assets/products/ashaninka.png']),
                inStock: 'true',
                description: 'Test Description'
            },
            files: undefined
        };
        const res = createMockRes();

        await createProduct(req, res as any);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Test Product');
        expect(res.body.price).toBe(99.99);
        expect(Array.isArray(res.body.badges)).toBe(true);
        expect(res.body.inStock).toBe(true);
    });

    it('should get all products', async () => {
        const req: any = {};
        const res = createMockRes();

        await getAllProducts(req, res as any);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].title).toBe('Test Product');
    });

    it('should get a product by id', async () => {
        const allRes = createMockRes();
        await getAllProducts({} as any, allRes as any);
        const productId = allRes.body[0].id as string;

        const req: any = { params: { id: productId } };
        const res = createMockRes();

        await getProductById(req, res as any);

        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(productId);
        expect(res.body.title).toBe('Test Product');
    });

    it('should update a product', async () => {
        const allRes = createMockRes();
        await getAllProducts({} as any, allRes as any);
        const productId = allRes.body[0].id as string;

        const req: any = {
            params: { id: productId },
            body: { title: 'Updated Product', inStock: 'false' },
            files: undefined
        };
        const res = createMockRes();

        await updateProduct(req, res as any);

        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Updated Product');
        expect(res.body.inStock).toBe(false);
    });

    it('should delete a product', async () => {
        const allRes = createMockRes();
        await getAllProducts({} as any, allRes as any);
        const productId = allRes.body[0].id as string;

        const req: any = { params: { id: productId } };
        const res = createMockRes();

        await deleteProduct(req, res as any);
        expect(res.statusCode).toBe(204);

        const checkRes = createMockRes();
        await getProductById({ params: { id: productId } } as any, checkRes as any);
        expect(checkRes.statusCode).toBe(404);
    });
});
