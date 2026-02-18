import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { ShoppingBag, Search } from 'lucide-react';

const Showcase = () => {
    const { products, loading, error } = useProducts();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--tg-theme-button-color)]"></div>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ShoppingBag className="text-[var(--tg-theme-button-color)]" />
                        Product Vitrina
                    </h1>
                    <p className="text-sm text-[var(--tg-theme-hint-color)]">Exclusive Catalog for You</p>
                </div>
                <button className="p-2 rounded-full glass">
                    <Search size={20} />
                </button>
            </header>

            {error && (
                <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-6 text-center">
                    {error}
                </div>
            )}

            {products.length === 0 ? (
                <div className="text-center py-20 text-[var(--tg-theme-hint-color)]">
                    No products available yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Showcase;
