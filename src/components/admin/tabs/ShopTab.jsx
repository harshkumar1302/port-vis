import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const ShopTab = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    // Form state
    const [editingId, setEditingId] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [stock, setStock] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('shop_products')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (!error) setProducts(data || []);
        else console.error('Failed to fetch products:', error);
        setLoading(false);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setFile(null);
            setPreviewUrl(null);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setDescription('');
        setPrice('');
        setOriginalPrice('');
        setStock('');
        setIsActive(true);
        setFile(null);
        setPreviewUrl(null);
    };

    const handleEdit = (prod) => {
        setEditingId(prod.id);
        setTitle(prod.title || '');
        setDescription(prod.description || '');
        setPrice(prod.price || '');
        setOriginalPrice(prod.original_price || '');
        setStock(prod.stock || '');
        setIsActive(prod.is_active ?? true);
        setPreviewUrl(prod.image_url);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (prod) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${prod.title}"?`);
        if (!confirmDelete) return;

        try {
            if (prod.image_url && prod.image_url.includes('storage/v1/object/public/artworks/')) {
                const fileName = prod.image_url.split('/').pop();
                await supabase.storage.from('artworks').remove([fileName]);
            }

            const res = await fetch('/api/manage-shop', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id: prod.id }),
            });

            if (!res.ok) throw new Error('Failed to delete product');
            setProducts(products.filter(p => p.id !== prod.id));
        } catch (error) {
            alert(`Delete failed: ${error.message}`);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!title || !price) {
            alert("Title and Price are required.");
            return;
        }

        let finalImageUrl = null;
        try {
            setUploading(true);

            if (file) {
                if (file.size > 10 * 1024 * 1024) throw new Error("File size must be less than 10MB");
                const fileExt = file.name.split('.').pop();
                const fileName = `shop_${Date.now()}.${fileExt}`;
                
                // We reuse the 'artworks' storage bucket for simplicity
                let { error: uploadError } = await supabase.storage
                    .from('artworks')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('artworks')
                    .getPublicUrl(fileName);

                finalImageUrl = publicUrl;
            } else if (editingId) {
                const prod = products.find(p => p.id === editingId);
                finalImageUrl = prod.image_url;
            }

            const payload = {
                title,
                description,
                price: Number(price),
                original_price: originalPrice ? Number(originalPrice) : null,
                stock: stock ? Number(stock) : null,
                is_active: isActive,
                image_url: finalImageUrl,
            };

            const method = editingId ? 'PUT' : 'POST';
            if (editingId) payload.id = editingId;

            const res = await fetch('/api/manage-shop', {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to save product');
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            resetForm();
            fetchProducts();
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 animate-in fade-in duration-500">
            {/* Left: Upload Form */}
            <div className="lg:col-span-1">
                <div className="card-ghibli p-6 sm:p-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem] lg:sticky lg:top-32">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-ghibli-navy">{editingId ? 'Edit Product' : 'New Product'}</h2>
                        {editingId && (
                            <button onClick={resetForm} className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors">Cancel</button>
                        )}
                    </div>
                    
                    <form onSubmit={handleUpload} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold" placeholder="Product Name" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood h-24" placeholder="Product details..." />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Price (₹)</label>
                                <input type="number" min="0" step="1" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold" placeholder="99" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Original (₹)</label>
                                <input type="number" min="0" step="1" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold" placeholder="149" />
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <div className="flex-1">
                                <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Stock (Optional)</label>
                                <input type="number" min="0" step="1" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold" placeholder="Unlimited" />
                            </div>
                            <div className="flex-1 pt-6">
                                <label className="flex items-center gap-2 text-sm font-bold text-ghibli-charcoal/70 cursor-pointer">
                                    <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                                    Active / Visible
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70 text-left">Image File {editingId && '(Optional if not changing)'}</label>
                            <div className="relative group">
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="shop-file-upload" required={!editingId} />
                                <label htmlFor="shop-file-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-ghibli-wood/20 rounded-2xl bg-white/30 hover:bg-white/50 transition-all cursor-pointer overflow-hidden group-hover:border-ghibli-wood/40">
                                    {previewUrl ? (
                                        <div className="relative w-full h-full">
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-white text-xs font-bold uppercase tracking-widest">Change Image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center p-6">
                                            <span className="text-3xl block mb-2 opacity-50">🛍️</span>
                                            <span className="text-[10px] font-bold text-ghibli-wood/60 uppercase tracking-widest">Select Image</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        <button disabled={uploading} className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 ${success ? 'bg-green-500 text-white' : 'bg-ghibli-wood text-ghibli-cream hover:bg-[#A0704F]'}`}>
                            {uploading ? 'Processing...' : success ? '✨ Saved!' : editingId ? '✨ Update Product' : `✨ Add Product`}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right: Product List */}
            <div className="lg:col-span-2">
                <div className="card-ghibli p-6 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem] min-h-[500px]">
                    <h2 className="text-2xl font-bold text-ghibli-navy mb-6">Manage Products</h2>
                    
                    {loading ? (
                        <div className="text-center py-20 opacity-50 font-bold">Loading products...</div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-ghibli-wood/20 rounded-2xl">
                            <span className="text-4xl block mb-4 opacity-30">📦</span>
                            <p className="text-ghibli-charcoal/60 font-bold">No products added yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {products.map(prod => (
                                <div key={prod.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 rounded-2xl bg-white/20 border border-transparent hover:border-ghibli-wood/10 transition-all">
                                    <div className="w-full sm:w-20 h-40 sm:h-20 rounded-xl overflow-hidden bg-ghibli-paper/20 flex-shrink-0 relative">
                                        {prod.image_url ? (
                                            <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-30">📦</div>
                                        )}
                                        {!prod.is_active && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="text-white text-[8px] font-bold uppercase tracking-widest px-1 border border-white/50 rounded">Hidden</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h3 className="font-bold text-ghibli-charcoal truncate text-lg">{prod.title}</h3>
                                        <div className="text-sm font-mono text-ghibli-wood/80 mt-1">₹{prod.price}</div>
                                        <div className="text-xs text-ghibli-charcoal/50 mt-1">
                                            Stock: {prod.stock !== null ? prod.stock : '∞'}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-end">
                                        <button
                                            onClick={() => handleEdit(prod)}
                                            className="flex-1 sm:flex-none p-3 text-ghibli-wood/60 hover:text-ghibli-wood hover:bg-ghibli-wood/10 rounded-xl transition-all border border-transparent"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(prod)}
                                            className="flex-1 sm:flex-none p-3 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShopTab;
