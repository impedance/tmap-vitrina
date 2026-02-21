import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ChevronLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../store/CartStore';
import { Stepper } from '../components/ui/Controls';
import { Button } from '../components/ui/Base';
import { backButton } from '@telegram-apps/sdk';

const Cart: React.FC = () => {
    const { items, updateQuantity, removeItem, totalAmount, totalItems } = useCart();
    const navigate = useNavigate();
    const itemList = Object.values(items);

    React.useEffect(() => {
        if (backButton.show.isAvailable()) {
            backButton.show();
            const off = backButton.onClick(() => navigate(-1));
            return () => {
                off();
                backButton.hide();
            };
        }
    }, [navigate]);

    if (totalItems === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-10 text-center animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-6 text-hint">
                    <ShoppingBag size={48} />
                </div>
                <h2 className="text-h3 font-bold mb-2">Корзина пуста</h2>
                <p className="text-hint mb-8 text-body">Кажется, вы забыли добавить немного шоколадного счастья.</p>
                <Link to="/">
                    <Button size="l">Вернуться в каталог</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="pb-32 min-h-screen bg-surface/30 animate-in fade-in slide-in-from-bottom-4 duration-500 text-text">
            {/* Header */}
            <header className="p-4 safe-p-top flex items-center gap-4 bg-bg">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-text md:hidden">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-h2 font-bold flex-1">Корзина</h1>
                <span className="text-caption bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
                    {totalItems} шт.
                </span>
            </header>

            {/* Item List */}
            <main className="p-4 space-y-3">
                {itemList.map(item => (
                    <div key={item.id} className="bg-bg p-3 rounded-l flex gap-3 shadow-card animate-in slide-in-from-right-4 duration-300">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-20 h-20 rounded-m object-cover flex-shrink-0"
                        />
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="text-body font-bold line-clamp-2">{item.title}</h3>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-destructive/50 hover:text-destructive transition-colors p-1 active:scale-90"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-body-plus font-bold text-primary">{item.price} ₽</span>
                                <Stepper
                                    value={item.quantity}
                                    onChange={(val) => updateQuantity(item.id, val)}
                                    min={1}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            {/* Order Summary */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-bg/80 backdrop-blur-xl border-t border-surface safe-p-bottom z-50">
                <div className="flex items-center justify-between mb-4 px-2">
                    <span className="text-body text-hint">Общая стоимость</span>
                    <span className="text-h2 font-bold text-primary">{totalAmount} ₽</span>
                </div>
                <Link to="/checkout">
                    <Button fullWidth size="l">Оформить заказ</Button>
                </Link>
            </div>
        </div>
    );
};

export default Cart;
