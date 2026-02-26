import React, { useState } from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import { Button } from '../ui/Base';
import { api } from '../../utils/api';
import { Product } from '../../types';

interface EditProductModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedProduct: Product) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({ product, isOpen, onClose, onUpdate }) => {
    const [form, setForm] = useState({
        title: product.title,
        price: product.price,
        inStock: product.inStock,
        weightLabel: product.weightLabel || '',
        badges: Array.isArray(product.badges) ? product.badges.join(', ') : '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...form,
                badges: JSON.stringify(form.badges.split(',').map((b: string) => b.trim()).filter(Boolean))
            };
            const res = await api.put(`/products/${product.id}`, payload);
            onUpdate(res.data);
            onClose();
        } catch (err) {
            console.error('Update failed', err);
            alert('Ошибка при обновлении');
        } finally {
            setLoading(false);
        }
    };

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose} title="Редактировать товар">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-caption text-hint ml-1">Название</label>
                    <input
                        className="w-full bg-surface rounded-m p-3 text-body outline-none"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-caption text-hint ml-1">Цена (₽)</label>
                        <input
                            type="number"
                            className="w-full bg-surface rounded-m p-3 text-body outline-none"
                            value={form.price}
                            onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-caption text-hint ml-1">Вес</label>
                        <input
                            className="w-full bg-surface rounded-m p-3 text-body outline-none"
                            value={form.weightLabel}
                            onChange={e => setForm({ ...form, weightLabel: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-caption text-hint ml-1">Бейджи (через запятую)</label>
                    <input
                        className="w-full bg-surface rounded-m p-3 text-body outline-none"
                        value={form.badges}
                        onChange={e => setForm({ ...form, badges: e.target.value })}
                        placeholder="Vegan, Новинка"
                    />
                </div>

                <div className="flex items-center justify-between p-3 bg-surface rounded-m">
                    <span className="text-body font-bold">В наличии</span>
                    <button
                        type="button"
                        onClick={() => setForm({ ...form, inStock: !form.inStock })}
                        className={`w-12 h-6 rounded-full transition-colors relative ${form.inStock ? 'bg-primary' : 'bg-hint/30'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.inStock ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>

                <Button fullWidth size="l" type="submit" loading={loading}>
                    Сохранить изменения
                </Button>
            </form>
        </BottomSheet>
    );
};
