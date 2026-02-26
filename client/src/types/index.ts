export interface Product {
    id: string;
    title: string;
    subtitle?: string;
    price: number;
    currency?: string;
    images: string[] | string; // API sometimes returns JSON stringified arrays
    badges: string[] | string; // API sometimes returns JSON stringified arrays
    inStock: boolean;
    weightLabel?: string;
    description?: string;
    composition?: string;
    storage?: string;
    delivery?: string;
    collection?: string;
    features?: string[];
    kind?: string;
    createdAt?: string;
}

export interface CartItem {
    id: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
}
