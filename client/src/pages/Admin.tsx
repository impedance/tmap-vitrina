import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Plus, Trash2, Package, X, Upload, Save, DollarSign, Type, FileJson } from 'lucide-react';
import axios from 'axios';

const Admin = () => {
    const { products, loading, refetch } = useProducts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        specs: '{}'
    });
    const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('description', formData.description);
        data.append('specs', formData.specs);

        if (selectedImages) {
            for (let i = 0; i < selectedImages.length; i++) {
                data.append('images', selectedImages[i]);
            }
        }
        if (selectedFiles) {
            for (let i = 0; i < selectedFiles.length; i++) {
                data.append('files', selectedFiles[i]);
            }
        }

        try {
            await axios.post('http://localhost:3001/api/products', data);
            setIsModalOpen(false);
            setFormData({ name: '', price: '', description: '', specs: '{}' });
            setSelectedImages(null);
            setSelectedFiles(null);
            refetch();
        } catch (err) {
            alert('Failed to create product');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await axios.delete(`http://localhost:3001/api/products/${id}`);
            refetch();
        } catch (err) {
            alert('Failed to delete product');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto pb-20">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-tg-text">Admin Panel</h1>
                    <p className="text-sm text-tg-hint font-medium">Manage your boutique catalog</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-tg-button text-tg-button-text p-3 rounded-2xl shadow-lg active:scale-90 transition-transform flex items-center gap-2 font-bold"
                >
                    <Plus size={24} />
                    <span className="hidden sm:inline">Add Product</span>
                </button>
            </header>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-tg-button"></div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {products.length === 0 && (
                        <div className="text-center py-20 bg-tg-secondary-bg/50 rounded-3xl border-2 border-dashed border-tg-hint/20 text-tg-hint font-bold">
                            No products to manage. Start by adding one!
                        </div>
                    )}
                    {products.map(product => (
                        <div key={product.id} className="bg-tg-bg border border-tg-hint/10 p-5 rounded-2xl flex items-center gap-5 group hover:border-tg-button/30 transition-colors shadow-sm">
                            <div className="w-16 h-16 rounded-xl bg-tg-secondary-bg flex items-center justify-center overflow-hidden flex-shrink-0">
                                {product.images[0] ? (
                                    <img
                                        src={product.images[0].startsWith('/') ? `http://localhost:3001${product.images[0]}` : product.images[0]}
                                        className="w-full h-full object-cover"
                                        alt=""
                                    />
                                ) : (
                                    <span className="text-2xl">📦</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-black text-tg-text truncate text-lg uppercase tracking-tight">{product.name}</h3>
                                <p className="text-tg-button font-black text-sm">${product.price?.toLocaleString() || '0'}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(product.id)}
                                className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all active:scale-95"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="bg-tg-bg w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden border border-tg-hint/20">
                        <div className="p-6 border-b border-tg-hint/10 flex items-center justify-between bg-tg-secondary-bg/30">
                            <h2 className="text-xl font-black text-tg-text uppercase tracking-tighter">Add New Product</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-tg-hint p-1">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
                            <div className="space-y-4">
                                <div className="relative">
                                    <label className="text-xs font-black uppercase tracking-widest text-tg-hint ml-1 mb-1 block">Product Title</label>
                                    <div className="flex items-center gap-3 bg-tg-secondary-bg/50 p-4 rounded-2xl border border-tg-hint/10 focus-within:border-tg-button transition-colors">
                                        <Type size={18} className="text-tg-hint" />
                                        <input
                                            type="text"
                                            placeholder="Enter name..."
                                            className="bg-transparent outline-none w-full font-bold text-tg-text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="text-xs font-black uppercase tracking-widest text-tg-hint ml-1 mb-1 block">Price (USD)</label>
                                    <div className="flex items-center gap-3 bg-tg-secondary-bg/50 p-4 rounded-2xl border border-tg-hint/10 focus-within:border-tg-button transition-colors">
                                        <DollarSign size={18} className="text-tg-hint" />
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            className="bg-transparent outline-none w-full font-bold text-tg-text"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="text-xs font-black uppercase tracking-widest text-tg-hint ml-1 mb-1 block">Description</label>
                                    <textarea
                                        placeholder="Tell about the product..."
                                        className="w-full bg-tg-secondary-bg/50 p-4 rounded-2xl border border-tg-hint/10 focus:border-tg-button outline-none min-h-[120px] font-medium text-tg-text"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <label className="text-xs font-black uppercase tracking-widest text-tg-hint ml-1 mb-1 block">Specifications (JSON)</label>
                                    <div className="flex items-center gap-3 bg-tg-secondary-bg/50 p-4 rounded-2xl border border-tg-hint/10 focus-within:border-tg-button transition-colors">
                                        <FileJson size={18} className="text-tg-hint" />
                                        <input
                                            type="text"
                                            className="bg-transparent outline-none w-full font-mono text-xs text-tg-text"
                                            value={formData.specs}
                                            onChange={e => setFormData({ ...formData, specs: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-black uppercase tracking-widest text-tg-hint ml-1 block">Images</label>
                                        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-tg-hint/20 rounded-2xl hover:border-tg-button/50 transition-colors cursor-pointer bg-tg-secondary-bg/20">
                                            <Upload size={24} className="text-tg-button mb-2" />
                                            <span className="text-[10px] font-black uppercase text-tg-hint text-center">Photos</span>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                onChange={e => setSelectedImages(e.target.files)}
                                            />
                                        </label>
                                        {selectedImages && <p className="text-[10px] font-bold text-center mt-1 text-tg-button uppercase tracking-tighter">{selectedImages.length} selected</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-black uppercase tracking-widest text-tg-hint ml-1 block">Files</label>
                                        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-tg-hint/20 rounded-2xl hover:border-tg-button/50 transition-colors cursor-pointer bg-tg-secondary-bg/20">
                                            <Package size={24} className="text-tg-button mb-2" />
                                            <span className="text-[10px] font-black uppercase text-tg-hint text-center">Docs</span>
                                            <input
                                                type="file"
                                                multiple
                                                className="hidden"
                                                onChange={e => setSelectedFiles(e.target.files)}
                                            />
                                        </label>
                                        {selectedFiles && <p className="text-[10px] font-bold text-center mt-1 text-tg-button uppercase tracking-tighter">{selectedFiles.length} selected</p>}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-tg-button text-tg-button-text py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all mt-4"
                            >
                                <Save size={24} />
                                Publish Product
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
