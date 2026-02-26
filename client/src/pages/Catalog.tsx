import React, { useEffect, useState, useMemo } from 'react';
import { Search, Filter, ShoppingCart } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { ProductCard } from '../components/catalog/ProductCard';
import { Chip } from '../components/ui/Base';
import { BottomSheet } from '../components/ui/BottomSheet';
import { useCart } from '../store/CartStore';
import { api } from '../utils/api';
import { Product } from '../types';

const Catalog: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchParams] = useSearchParams();
    const isAdmin = searchParams.get('admin') === '1';
    const { totalItems, totalAmount } = useCart();

    // Filters state
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [selectedKinds, setSelectedKinds] = useState<string[]>([]);
    const [sortType, setSortType] = useState<string>('popular');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setProducts(res.data);
            } catch (err) {
                console.error('Failed to fetch products', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const collections = useMemo(() => {
        const all = products.map(p => p.collection).filter(Boolean) as string[];
        return Array.from(new Set(all));
    }, [products]);

    const availableFeatures = useMemo(() => {
        const all = products.flatMap(p => p.features || []).filter(Boolean) as string[];
        return Array.from(new Set(all)).sort();
    }, [products]);

    const availableKinds = useMemo(() => {
        const all = products.map(p => p.kind).filter(Boolean) as string[];
        return Array.from(new Set(all)).sort();
    }, [products]);

    const filteredProducts = useMemo(() => {
        const result = products.filter(p => {
            const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
            const matchCollection = !selectedCollection || p.collection === selectedCollection;
            const matchFeatures = selectedFeatures.length === 0 || selectedFeatures.every(f => (p.features || []).includes(f));
            const matchKind = selectedKinds.length === 0 || selectedKinds.includes(p.kind);
            return matchSearch && matchCollection && matchFeatures && matchKind;
        });

        return result.sort((a, b) => {
            if (sortType === 'price-asc') return a.price - b.price;
            if (sortType === 'price-desc') return b.price - a.price;
            if (sortType === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            return 0; // 'popular' or default
        });
    }, [products, search, selectedCollection, selectedFeatures, selectedKinds, sortType]);

    const toggleFeature = (f: string) => {
        setSelectedFeatures(prev => prev.includes(f) ? prev.filter(item => item !== f) : [...prev, f]);
    };

    const toggleKind = (k: string) => {
        setSelectedKinds(prev => prev.includes(k) ? prev.filter(item => item !== k) : [...prev, k]);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-hint animate-pulse">Загрузка шедевров...</p>
            </div>
        );
    }

    return (
        <div className="pb-24">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md p-4 safe-p-top">
                <div className="flex items-center gap-3 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-hint" size={18} />
                        <input
                            type="text"
                            placeholder="Поиск шоколада..."
                            className="w-full bg-surface border-none rounded-m py-2 pl-10 pr-4 text-body focus:ring-2 focus:ring-primary transition-all outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="p-2 rounded-m bg-surface text-text active:scale-90 transition-transform cursor-pointer"
                    >
                        <Filter size={20} />
                    </button>
                </div>

                {/* Categories Chips */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                    <Chip
                        label="Все"
                        active={!selectedCollection}
                        onClick={() => setSelectedCollection(null)}
                    />
                    {collections.map(c => (
                        <Chip
                            key={c}
                            label={c}
                            active={selectedCollection === c}
                            onClick={() => setSelectedCollection(c)}
                        />
                    ))}
                </div>
            </header>

            {/* Grid */}
            <main className="px-4 mt-2">
                <div className="grid grid-cols-2 gap-3">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} isAdmin={isAdmin} />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-hint">Ничего не нашли :(</p>
                    </div>
                )}
            </main>

            {/* Floating Cart Button */}
            {totalItems > 0 && (
                <div className="fixed bottom-6 left-4 right-4 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <Link to="/cart" className="flex items-center justify-between bg-primary text-on-primary p-4 rounded-l shadow-xl shadow-primary/30 active:scale-95 transition-transform hover:brightness-110">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <ShoppingCart size={24} />
                                <span className="absolute -top-2 -right-2 bg-accent text-on-primary text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-primary">
                                    {totalItems}
                                </span>
                            </div>
                            <span className="font-bold text-body-plus">Корзина</span>
                        </div>
                        <span className="font-bold text-body-plus">{totalAmount} ₽</span>
                    </Link>
                </div>
            )}

            {/* Filters BottomSheet */}
            <BottomSheet
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                title="Фильтры"
            >
                <div className="space-y-6">
                    <div>
                        <h3 className="text-body font-bold mb-3 font-semibold">Сортировка</h3>
                        <div className="flex flex-wrap gap-2">
                            <Chip label="Сначала популярные" active={sortType === 'popular'} onClick={() => setSortType('popular')} />
                            <Chip label="Сначала новинки" active={sortType === 'newest'} onClick={() => setSortType('newest')} />
                            <Chip label="Сначала дешевые" active={sortType === 'price-asc'} onClick={() => setSortType('price-asc')} />
                            <Chip label="Сначала дорогие" active={sortType === 'price-desc'} onClick={() => setSortType('price-desc')} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-body font-bold mb-3 font-semibold">Коллекции</h3>
                        <div className="flex flex-wrap gap-2">
                            <Chip
                                label="Все"
                                active={!selectedCollection}
                                onClick={() => setSelectedCollection(null)}
                            />
                            {collections.map(c => (
                                <Chip
                                    key={c}
                                    label={c}
                                    active={selectedCollection === c}
                                    onClick={() => setSelectedCollection(c)}
                                />
                            ))}
                        </div>
                    </div>

                    {availableFeatures.length > 0 && (
                        <div>
                            <h3 className="text-body font-bold mb-3 font-semibold">Особенности</h3>
                            <div className="space-y-3">
                                {availableFeatures.map(f => (
                                    <label key={f} className="flex items-center gap-3 cursor-pointer">
                                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedFeatures.includes(f) ? 'bg-primary border-primary' : 'border-hint/50'}`}>
                                            {selectedFeatures.includes(f) && <div className="w-2.5 h-2.5 bg-on-primary rounded-[1px]" />}
                                        </div>
                                        <span className="text-body select-none">{f}</span>
                                        <input type="checkbox" className="hidden" checked={selectedFeatures.includes(f)} onChange={() => toggleFeature(f)} />
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {availableKinds.length > 0 && (
                        <div>
                            <h3 className="text-body font-bold mb-3 font-semibold">Вид</h3>
                            <div className="space-y-3">
                                {availableKinds.map(k => (
                                    <label key={k} className="flex items-center gap-3 cursor-pointer">
                                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedKinds.includes(k) ? 'bg-primary border-primary' : 'border-hint/50'}`}>
                                            {selectedKinds.includes(k) && <div className="w-2.5 h-2.5 bg-on-primary rounded-[1px]" />}
                                        </div>
                                        <span className="text-body select-none">{k}</span>
                                        <input type="checkbox" className="hidden" checked={selectedKinds.includes(k)} onChange={() => toggleKind(k)} />
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="sticky bottom-0 bg-bg pt-2 pb-safe-bottom">
                        <button
                            onClick={() => setIsFilterOpen(false)}
                            className="w-full bg-primary text-on-primary py-4 rounded-l font-bold mt-2 shadow-card"
                        >
                            Показать результаты ({filteredProducts.length})
                        </button>
                    </div>
                </div>
            </BottomSheet>
        </div>
    );
};

export default Catalog;
