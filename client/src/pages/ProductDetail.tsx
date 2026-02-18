import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { ChevronLeft, FileText, MessageCircle, ExternalLink, Package } from 'lucide-react';
import WebApp from '@twa-dev/sdk';

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { product, loading, error } = useProduct(id);
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tg-button"></div>
            </div>
        );
    }

    if (!product || error) {
        return (
            <div className="p-8 text-center text-red-500">
                <div className="text-6xl mb-4">🔍</div>
                <p className="font-bold">Product not found.</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 text-tg-button font-semibold"
                >
                    Back to Showcase
                </button>
            </div>
        );
    }

    const handleContact = () => {
        WebApp.openTelegramLink('https://t.me/your_bot_or_account');
    };

    const hasImage = product.images && product.images.length > 0;
    const mainImage = hasImage ? product.images[0] : null;
    const displayImage = mainImage?.startsWith('/') ? `http://localhost:3001${mainImage}` : mainImage;

    return (
        <div className="pb-32 bg-tg-bg min-h-screen">
            <nav className="fixed top-0 left-0 right-0 p-4 z-50 flex items-center justify-between pointer-events-none">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2.5 rounded-xl glass shadow-lg pointer-events-auto active:scale-90 transition-transform"
                >
                    <ChevronLeft size={24} className="text-tg-text" />
                </button>
            </nav>

            {/* Hero / Gallery */}
            <div className="relative h-96 bg-tg-secondary-bg flex items-center justify-center overflow-hidden">
                {hasImage ? (
                    <>
                        <img
                            src={displayImage!}
                            alt={product.name}
                            className="w-full h-full object-contain relative z-10"
                        />
                        <div
                            className="absolute inset-0 blur-3xl opacity-20 scale-150"
                            style={{ backgroundImage: `url(${displayImage})`, backgroundSize: 'cover' }}
                        />
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-8xl">📦</span>
                        <Package className="text-tg-hint/20" size={48} />
                    </div>
                )}
            </div>

            <div className="p-6 -mt-8 relative z-20 bg-tg-bg rounded-t-[32px] shadow-[0_-12px_24px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-black text-tg-text mb-1">{product.name}</h1>
                        <p className="text-sm font-bold text-tg-hint uppercase tracking-widest">Premium Product</p>
                    </div>
                    {product.price && (
                        <div className="bg-tg-button/10 text-tg-button px-4 py-2 rounded-2xl text-xl font-black">
                            ${product.price.toLocaleString()}
                        </div>
                    )}
                </div>

                <div className="prose prose-sm leading-relaxed text-tg-text/80 mb-10 font-medium">
                    {product.description}
                </div>

                {/* Technical Specs */}
                {Object.keys(product.specs).length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-xl font-black mb-4 flex items-center gap-2 text-tg-text">
                            <span className="w-2 h-6 bg-tg-button rounded-full" />
                            Specifications
                        </h2>
                        <div className="bg-tg-secondary-bg/30 rounded-2xl border border-tg-hint/10 overflow-hidden">
                            {Object.entries(product.specs).map(([key, value], index) => (
                                <div
                                    key={key}
                                    className={`flex justify-between p-4 ${index !== 0 ? 'border-t border-tg-hint/5' : ''}`}
                                >
                                    <span className="text-tg-hint font-medium">{key}</span>
                                    <span className="font-bold text-tg-text text-right">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Attachments */}
                {product.files.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-black mb-4 flex items-center gap-2 text-tg-text">
                            <span className="w-2 h-6 bg-tg-button rounded-full" />
                            Resources
                        </h2>
                        <div className="grid grid-cols-1 gap-3">
                            {product.files.map((file, index) => (
                                <a
                                    key={index}
                                    href={`http://localhost:3001${file.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 bg-tg-bg border border-tg-hint/20 rounded-2xl active:scale-95 transition-all hover:border-tg-button/30 hover:bg-tg-button/5"
                                >
                                    <div className="bg-tg-button/10 p-2.5 rounded-xl">
                                        <FileText className="text-tg-button" size={20} />
                                    </div>
                                    <span className="flex-1 font-bold truncate text-tg-text">{file.name}</span>
                                    <ExternalLink size={16} className="text-tg-hint" />
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-tg-bg via-tg-bg to-transparent z-50">
                <button
                    onClick={handleContact}
                    className="w-full bg-tg-button text-tg-button-text py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-[0_12px_24px_rgba(36,129,204,0.3)] active:scale-95 transition-all"
                >
                    <MessageCircle size={24} />
                    Message Specialist
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;
