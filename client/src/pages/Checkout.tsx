import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartStore';
import { Button } from '../components/ui/Base';
import { ChevronLeft, CheckCircle2, MapPin, Phone, User } from 'lucide-react';
import { backButton, sendData } from '@telegram-apps/sdk';
import { api } from '../utils/api';


const Checkout: React.FC = () => {
    const { items, totalAmount, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');

    const [form, setForm] = useState({
        name: '',
        phone: '',
        address: '',
        comment: '',
        deliveryMethod: 'курьер',
        paymentMethod: 'Оплата при получении'
    });

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            ...form,
            items: Object.values(items).map(i => ({ productId: i.id, quantity: i.quantity, price: i.price })),
            totalAmount
        };

        try {
            const res = await api.post('/orders', orderData);
            setOrderId(res.data.id);
            setIsSuccess(true);
            clearCart();

            // Telegram specific
            if (sendData.isAvailable()) {
                try {
                    sendData(JSON.stringify({ orderId: res.data.id, status: 'created' }));
                } catch (e) {
                    console.log('sendData failed (likely not in a keyboard-button context)', e);
                }
            }

        } catch (err) {
            console.error('Checkout failed', err);
            alert('Ошибка при оформлении заказа');
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-10 text-center animate-in zoom-in-95 duration-500 bg-bg">
                <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={64} />
                </div>
                <h2 className="text-h2 font-bold mb-2 text-text">Заказ оформлен!</h2>
                <p className="text-hint mb-2">Номер заказа: #{orderId.slice(0, 8)}</p>
                <p className="text-body text-hint mb-10">Мы свяжемся с вами в ближайшее время для подтверждения.</p>

                <div className="w-full p-4 bg-surface rounded-l text-left mb-8 border border-primary/20">
                    <p className="text-[10px] font-bold uppercase text-primary mb-2">DEBUG INFO (Browser mode)</p>
                    <pre className="text-[10px] overflow-auto max-h-[150px] whitespace-pre-wrap text-text">
                        {JSON.stringify({ orderId, status: 'success' }, null, 2)}
                    </pre>
                </div>

                <Button fullWidth size="l" onClick={() => navigate('/')}>Вернуться в магазин</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface/30 pb-32 animate-in slide-in-from-right-10 duration-500 text-text">
            <header className="p-4 safe-p-top flex items-center gap-4 bg-bg">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-text md:hidden">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-h2 font-bold flex-1">Оформление</h1>
            </header>

            <main className="p-4 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-bg p-6 rounded-l space-y-5 shadow-card">
                        <h3 className="text-body-plus font-bold mb-2">Контактные данные</h3>

                        <div className="relative">
                            <User className="absolute left-0 top-1/2 -translate-y-1/2 text-hint" size={20} />
                            <input
                                required
                                className="w-full bg-transparent border-b border-surface py-3 pl-8 text-body focus:border-primary transition-colors outline-none"
                                placeholder="Ваше имя"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                        </div>

                        <div className="relative">
                            <Phone className="absolute left-0 top-1/2 -translate-y-1/2 text-hint" size={20} />
                            <input
                                required
                                type="tel"
                                className="w-full bg-transparent border-b border-surface py-3 pl-8 text-body focus:border-primary transition-colors outline-none"
                                placeholder="+7 (___) ___-__-__"
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="bg-bg p-6 rounded-l space-y-5 shadow-card">
                        <h3 className="text-body-plus font-bold mb-2">Доставка</h3>

                        <div className="flex p-1 bg-surface rounded-m">
                            <button
                                type="button"
                                className={`flex-1 py-2 rounded-m text-caption font-bold transition-all ${form.deliveryMethod === 'самовывоз' ? 'bg-bg shadow-sm text-primary' : 'text-hint'}`}
                                onClick={() => setForm({ ...form, deliveryMethod: 'самовывоз' })}
                            >
                                Самовывоз
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-2 rounded-m text-caption font-bold transition-all ${form.deliveryMethod === 'курьер' ? 'bg-bg shadow-sm text-primary' : 'text-hint'}`}
                                onClick={() => setForm({ ...form, deliveryMethod: 'курьер' })}
                            >
                                Курьер
                            </button>
                        </div>

                        {form.deliveryMethod === 'курьер' && (
                            <div className="relative animate-in fade-in slide-in-from-top-2">
                                <MapPin className="absolute left-0 top-3 text-hint" size={20} />
                                <textarea
                                    required
                                    rows={2}
                                    className="w-full bg-transparent border-b border-surface py-3 pl-8 text-body focus:border-primary transition-colors outline-none resize-none"
                                    placeholder="Адрес доставки"
                                    value={form.address}
                                    onChange={e => setForm({ ...form, address: e.target.value })}
                                />
                            </div>
                        )}

                        <textarea
                            rows={2}
                            className="w-full bg-surface/50 rounded-m p-3 text-body focus:bg-surface transition-colors outline-none resize-none"
                            placeholder="Комментарий к заказу"
                            value={form.comment}
                            onChange={e => setForm({ ...form, comment: e.target.value })}
                        />
                    </div>

                    <div className="bg-bg p-6 rounded-l space-y-5 shadow-card">
                        <h3 className="text-body-plus font-bold mb-2">Оплата</h3>
                        <div className="p-3 bg-surface rounded-m text-body font-bold border border-primary text-primary flex items-center justify-between opacity-80 cursor-not-allowed select-none">
                            <span>Оплата при получении</span>
                            <CheckCircle2 size={20} />
                        </div>
                        <p className="text-caption text-hint">Временно доступна только оплата при получении заказа.</p>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-l border border-primary/10">
                        <div className="flex justify-between items-center text-body-plus font-bold text-primary">
                            <span>Итого к оплате:</span>
                            <span>{totalAmount} ₽</span>
                        </div>
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-bg/80 backdrop-blur-xl border-t border-surface safe-p-bottom z-50">
                        <Button
                            type="submit"
                            fullWidth
                            size="l"
                            loading={loading}
                            disabled={totalAmount === 0}
                        >
                            Подтвердить заказ — {totalAmount} ₽
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default Checkout;
