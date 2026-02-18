import { Product } from '../types/product';
import { Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';

interface Props {
    product: Product;
}

const ProductCard = ({ product }: Props) => {
    const hasImage = product.images && product.images.length > 0;
    const mainImage = hasImage ? product.images[0] : null;
    const displayImage = mainImage?.startsWith('/') ? `http://localhost:3001${mainImage}` : mainImage;

    return (
        <Link
            to={`/product/${product.id}`}
            className="block bg-tg-bg border border-tg-hint/20 rounded-2xl overflow-hidden active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md"
        >
            <div className="aspect-square w-full relative bg-tg-secondary-bg flex items-center justify-center">
                {hasImage ? (
                    <img
                        src={displayImage!}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-6xl">📦</span>
                        <Package className="text-tg-hint/30" size={32} />
                    </div>
                )}
                {product.price && (
                    <div className="absolute top-3 right-3 bg-tg-button text-tg-button-text px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                        ${product.price.toLocaleString()}
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-bold text-lg mb-1 truncate text-tg-text">{product.name}</h3>
                <p className="text-sm text-tg-hint line-clamp-2 mb-4">
                    {product.description}
                </p>
                <div className="flex items-center justify-between text-tg-button font-semibold">
                    <span className="text-sm uppercase tracking-wider">Details</span>
                    <ArrowRight size={18} />
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
