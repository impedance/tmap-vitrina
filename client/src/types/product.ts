export interface Product {
    id: string;
    name: string;
    price: number | null;
    description: string;
    specs: Record<string, string>;
    images: string[];
    files: Array<{ name: string; url: string }>;
    createdAt: string;
    updatedAt: string;
}

export type ProductCreateInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'specs' | 'images' | 'files'> & {
    specs?: string;
    images?: File[];
    files?: File[];
};
