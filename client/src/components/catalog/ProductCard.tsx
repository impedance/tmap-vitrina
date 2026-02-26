import React, { useState } from 'react';
import { Plus, Settings } from 'lucide-react';
import { Badge } from '../ui/Base';
import { useCart } from '../../store/CartStore';
import { Link } from 'react-router-dom';
import { EditProductModal } from '../admin/EditProductModal';
import { Product } from '../../types';

interface ProductCardProps {
    product: Product;
    isAdmin?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isAdmin }) => {
    const { addItem } = useCart();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(product);


    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(currentProduct);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditOpen(true);
    };

    const images = Array.isArray(currentProduct.images) ? currentProduct.images : JSON.parse(currentProduct.images);
    const badges = Array.isArray(currentProduct.badges) ? currentProduct.badges : JSON.parse(currentProduct.badges);

    return (
        <>
            <Link to={`/p/${currentProduct.id}`} className="group relative bg-bg rounded-l overflow-hidden shadow-card flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
                <div className="relative aspect-square overflow-hidden bg-surface">
                    <img
                        src={images[0]}
                        alt={currentProduct.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        {badges.map((b: string) => (
                            <Badge key={b}>{b}</Badge>
                        ))}
                    </div>

                    {isAdmin && (
                        <button
                            onClick={handleEdit}
                            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-bg/80 backdrop-blur text-text active:scale-90 transition-transform z-20"
                        >
                            <Settings size={18} />
                        </button>
                    )}
                </div>

                <div className="p-3 flex flex-col flex-1">
                    <h3 className="text-body font-bold line-clamp-2 mb-1">{currentProduct.title}</h3>
                    <p className="text-caption text-hint line-clamp-1 mb-2">{currentProduct.subtitle}</p>

                    <div className="mt-auto flex items-center justify-between">
                        <div>
                            <span className="text-body-plus font-bold text-primary">{currentProduct.price} {currentProduct.currency}</span>
                            <span className="text-[10px] text-hint block">{currentProduct.weightLabel}</span>
                        </div>

                        <button
                            onClick={handleAdd}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-on-primary active:scale-90 transition-transform cursor-pointer shadow-md"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                </div>

                {!currentProduct.inStock && (
                    <div className="absolute inset-0 bg-bg/60 backdrop-blur-[1px] flex items-center justify-center z-10 pointer-events-none">
                        <span className="bg-destructive text-on-primary px-3 py-1 rounded-s font-bold text-caption rotate-[-15deg]">Нет в наличии</span>
                    </div>
                )}
            </Link>

            <EditProductModal
                product={currentProduct}
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onUpdate={(updated) => setCurrentProduct(updated)}
            />
        </>
    );
};

