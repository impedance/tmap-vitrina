import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { ChevronLeft, FileText, MessageCircle, ExternalLink } from 'lucide-react';
import WebApp from '@twa-dev/sdk';

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { product, loading, error } = useProduct(id);
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--tg-theme-button-color)]"></div>
            </div>
        );
    }

    if (!product || error) {
        return (
            <div className="p-8 text-center text-red-500">
                Product not found or error loading.
            </div>
        );
    }

    const handleContact = () => {
        // In a real app, this would be a config or dynamic value
        WebApp.openTelegramLink('https://t.me/your_bot_or_account');
    };

    return (
        <div className="pb-24">
            <button
                onClick={() => navigate(-1)}
                className="fixed top-4 left-4 z-10 p-2 rounded-full glass"
            >
                <ChevronLeft size={24} />
            </button>

            {/* Hero / Gallery */}
            <div className="relative h-80 bg-black/5">
                <img
                    src={product.images[0]?.startsWith('/') ? `http://localhost:3000${product.images[0]}` : product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                />
            </div>

            <div className="p-4">
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                {product.price && (
                    <p className="text-xl text-[var(--tg-theme-button-color)] font-semibold mb-4">
                        ${product.price.toLocaleString()}
                    </p>
                )}

                <div className="prose prose-sm dark:prose-invert max-w-none text-[var(--tg-theme-text-color)] opacity-80 mb-8">
                    {product.description}
                </div>

                {/* Technical Specs */}
                {Object.keys(product.specs).length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-bold mb-4">Specifications</h2>
                        <div className="glass rounded-xl overflow-hidden">
                            {Object.entries(product.specs).map(([key, value], index) => (
                                <div
                                    key={key}
                                    className={`flex justify-between p-3 ${index !== 0 ? 'border-t border-white/10' : ''}`}
                                >
                                    <span className="text-[var(--tg-theme-hint-color)]">{key}</span>
                                    <span className="font-medium text-right">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Attachments */}
                {product.files.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-bold mb-4">Documents & Instructions</h2>
                        <div className="space-y-2">
                            {product.files.map((file, index) => (
                                <a
                                    key={index}
                                    href={`http://localhost:3000${file.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 glass rounded-xl active:scale-95 transition-transform"
                                >
                                    <FileText className="text-[var(--tg-theme-button-color)]" size={20} />
                                    <span className="flex-1 truncate">{file.name}</span>
                                    <ExternalLink size={16} className="opacity-50" />
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--tg-theme-bg-color)] to-transparent">
                <button
                    onClick={handleContact}
                    className="w-full bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition-transform"
                >
                    <MessageCircle size={20} />
                    Contact Specialist
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;
