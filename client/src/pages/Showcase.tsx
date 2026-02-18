import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { ShoppingBag, Search } from 'lucide-react';

const Showcase = () => {
    const { products, loading, error } = useProducts();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tg-button"></div>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-4xl mx-auto pb-10">
            <header className="mb-8 mt-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-tg-button/10 p-2 rounded-xl">
                            <ShoppingBag className="text-tg-button" size={24} />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-tg-text">
                            Vitrina
                        </h1>
                    </div>
                    <button className="p-2.5 rounded-xl border border-tg-hint/20 text-tg-hint active:scale-90 transition-transform">
                        <Search size={20} />
                    </button>
                </div>
                <p className="text-sm text-tg-hint font-medium">Exclusive Catalog for You</p>
            </header>

            {error && (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl mb-6 text-center text-sm font-medium border border-red-500/20">
                    {error}
                </div>
            )}

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-tg-hint gap-4 bg-tg-secondary-bg/50 rounded-3xl border-2 border-dashed border-tg-hint/20">
                    <span className="text-6xl animate-pulse">🏪</span>
                    <p className="font-semibold text-lg">No products available yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Showcase;
