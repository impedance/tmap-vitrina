import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import axios from 'axios';
import { Plus, Trash2, Edit2, X, Upload } from 'lucide-react';

const Admin = () => {
    const { products, refetch } = useProducts();
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
            alert('Failed to save product');
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
        <div className="p-4">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[var(--tg-theme-button-color)] p-2 rounded-full text-white"
                >
                    <Plus size={20} />
                </button>
            </header>

            <div className="space-y-4">
                {products.map(product => (
                    <div key={product.id} className="glass p-4 rounded-xl flex items-center gap-4">
                        <img
                            src={product.images[0]?.startsWith('/') ? `http://localhost:3001${product.images[0]}` : product.images[0]}
                            className="w-12 h-12 rounded-lg object-cover"
                            alt=""
                        />
                        <div className="flex-1">
                            <h3 className="font-bold truncate">{product.name}</h3>
                            <p className="text-xs text-[var(--tg-theme-hint-color)]">${product.price}</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 text-blue-500"><Edit2 size={18} /></button>
                            <button onClick={() => handleDelete(product.id)} className="p-2 text-red-500"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
                    <div className="bg-[var(--tg-theme-bg-color)] w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold">Add New Product</h2>
                            <button onClick={() => setIsModalOpen(false)}><X /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                            <input
                                placeholder="Product Name"
                                className="w-full p-4 glass rounded-xl outline-none border-0"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Price"
                                type="number"
                                step="0.01"
                                className="w-full p-4 glass rounded-xl outline-none border-0"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                            <textarea
                                placeholder="Description"
                                className="w-full p-4 glass rounded-xl outline-none border-0 h-32"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder='Specs JSON (e.g. {"Screen": "6.1 inch"})'
                                className="w-full p-4 glass rounded-xl outline-none border-0 h-24 font-mono text-xs"
                                value={formData.specs}
                                onChange={e => setFormData({ ...formData, specs: e.target.value })}
                            />

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold opacity-60">Photos</label>
                                <input
                                    type="file" multiple accept="image/*"
                                    onChange={e => setSelectedImages(e.target.files)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold opacity-60">Documents (PDF, etc.)</label>
                                <input
                                    type="file" multiple
                                    onChange={e => setSelectedFiles(e.target.files)}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[var(--tg-theme-button-color)] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                            >
                                <Upload size={18} />
                                Save Product
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
