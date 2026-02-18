import { Product } from '../types/product';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Props {
    product: Product;
}

const ProductCard = ({ product }: Props) => {
    const mainImage = product.images[0] || 'https://via.placeholder.com/300?text=No+Image';
    const displayImage = mainImage.startsWith('/') ? `http://localhost:3001${mainImage}` : mainImage;

    return (
        <Link
            to={`/product/${product.id}`}
            className="block glass rounded-2xl overflow-hidden active:scale-95 transition-transform duration-200"
        >
            <div className="aspect-square w-full relative">
                <img
                    src={displayImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
                {product.price && (
                    <div className="absolute top-3 right-3 bg-[var(--tg-theme-button-color)] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        ${product.price.toLocaleString()}
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
                <p className="text-sm text-[var(--tg-theme-hint-color)] line-clamp-2 mb-4">
                    {product.description}
                </p>
                <div className="flex items-center justify-between text-[var(--tg-theme-button-color)] font-medium">
                    <span>See Details</span>
                    <ArrowRight size={18} />
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
