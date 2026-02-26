import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
    items: Record<string, CartItem>;
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalAmount: number;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<Record<string, CartItem>>(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addItem = (product: Product, quantity: number = 1) => {
        setItems(prev => {
            const existing = prev[product.id];
            if (existing) {
                return {
                    ...prev,
                    [product.id]: { ...existing, quantity: existing.quantity + quantity }
                };
            }
            return {
                ...prev,
                [product.id]: {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: Array.isArray(product.images) ? product.images[0] : JSON.parse(product.images)[0] || '',
                    quantity
                }
            };
        });
    };

    const removeItem = (productId: string) => {
        setItems(prev => {
            const newItems = { ...prev };
            delete newItems[productId];
            return newItems;
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }
        setItems(prev => ({
            ...prev,
            [productId]: { ...prev[productId], quantity }
        }));
    };

    const clearCart = () => setItems({});

    const totalAmount = Object.values(items).reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalItems = Object.values(items).reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalAmount, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
