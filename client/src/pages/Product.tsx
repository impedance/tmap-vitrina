import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { backButton } from '@telegram-apps/sdk-react';
import { Button } from '../components/ui/Base';
import { Stepper, Accordion } from '../components/ui/Controls';
import { useCart } from '../store/CartStore';
import { ChevronLeft, Share } from 'lucide-react';
import { api } from '../utils/api';
import { ProductCard } from '../components/catalog/ProductCard';
import { Product as ProductType } from '../types';

const Product: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<ProductType | null>(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const { addItem } = useCart();
    const [similar, setSimilar] = useState<ProductType[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);

                if (res.data.collection) {
                    const allRes = await api.get(`/products`);
                    const all = allRes.data;
                    const sm = all.filter((p: ProductType) => p.collection === res.data.collection && p.id !== res.data.id).slice(0, 4);
                    setSimilar(sm);
                } else {
                    setSimilar([]);
                }
            } catch (err) {
                console.error('Failed to fetch product', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();

        // Show Back Button in Telegram
        let off: VoidFunction | undefined;
        if (backButton.isSupported() && backButton.isMounted()) {
            backButton.show();
            off = backButton.onClick(() => navigate(-1));
        }

        return () => {
            if (off) off();
            if (backButton.isSupported() && backButton.isMounted()) {
                backButton.hide();
            }
        };
    }, [id, navigate]);

    if (loading) return null;
    if (!product) return <div className="p-10 text-center">Товар не найден</div>;

    const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images);
    const badges = Array.isArray(product.badges) ? product.badges : JSON.parse(product.badges);

    return (
        <div className="pb-32 bg-bg min-h-screen animate-in fade-in slide-in-from-right-10 duration-500">
            {/* Gallery Header */}
            <div className="relative aspect-[4/5] bg-surface">
                <img
                    src={images[0]}
                    className="w-full h-full object-cover"
                    alt={product.title}
                />

                {/* Custom Nav for Browser */}
                <div className="absolute top-4 left-4 right-4 flex justify-between safe-p-top">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-bg/80 backdrop-blur text-text active:scale-90 transition-transform md:hidden"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-bg/80 backdrop-blur text-text active:scale-90 transition-transform">
                        <Share size={20} />
                    </button>
                </div>

                <div className="absolute bottom-4 left-4 flex gap-1">
                    {badges.map((b: string) => (
                        <span key={b} className="px-3 py-1 bg-primary text-on-primary rounded-full text-caption font-bold shadow-lg">
                            {b}
                        </span>
                    ))}
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-h2 font-bold mb-1">{product.title}</h1>
                    <p className="text-body-plus text-hint italic">{product.subtitle}</p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-h2 font-bold text-primary">{product.price} {product.currency}</span>
                        <span className="text-caption text-hint">{product.weightLabel}</span>
                    </div>
                    <Stepper value={qty} onChange={setQty} min={1} />
                </div>

                <div className="space-y-2">
                    {product.description && <Accordion title="Описание">{product.description}</Accordion>}
                    {product.composition && <Accordion title="Состав">{product.composition}</Accordion>}
                    {product.storage && <Accordion title="Хранение">{product.storage}</Accordion>}
                    {product.delivery && <Accordion title="Доставка">{product.delivery}</Accordion>}
                </div>

                {similar.length > 0 && (
                    <div className="pt-8 -mx-6">
                        <h2 className="text-h2 font-bold px-6 mb-4">Вам может понравиться</h2>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-2">
                            {similar.map(p => (
                                <div key={p.id} className="min-w-[160px] flex-shrink-0">
                                    <ProductCard product={p} isAdmin={false} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-bg/80 backdrop-blur-xl border-t border-surface safe-p-bottom z-50">
                <Button
                    fullWidth
                    size="l"
                    onClick={() => {
                        addItem(product, qty);
                        navigate('/cart');
                    }}
                >
                    В корзину — {(product.price * qty).toFixed(0)} {product.currency}
                </Button>
            </div>
        </div>
    );
};

export default Product;
