import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// Shared Categories Data (ideally this should be in a shared config file, but keeping here for now)
const CATEGORIES_DATA = {
    'Mandala': ['Dot Mandala', 'Generic Mandala', 'Wall Mandala'],
    'Miniature': ['Miniatures', 'Clay Sets'],
    'Gift Material': ['Vintage Frame', 'Fridge Magnet', 'Key Chains', 'Brooch', 'Garlands', 'Gopi Dots', 'Bottle Arts', 'Tote Bags', 'Car Hanging'],
    'DIY Art': ['Bookmarks', 'Stick Bookmarks (Clay)', 'Wooden Bookmarks', 'MDF Boards', 'Backdrops'],
};

const AdminDashboard = () => {
    const [session, setSession] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [artworks, setArtworks] = useState([]);

    // Artwork form state
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState('Mandala');
    const [subCategory, setSubCategory] = useState('');
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isFeatured, setIsFeatured] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Update sub-category when main category changes
    useEffect(() => {
        if (CATEGORIES_DATA[category]) {
            setSubCategory(CATEGORIES_DATA[category][0]);
        } else {
            setSubCategory('');
        }
    }, [category]);

    useEffect(() => {
        const sessionAuth = sessionStorage.getItem('ghibli_admin_key');
        if (sessionAuth === 'secure_active_2026') {
            setSession({ user: { id: 'admin-master', email: 'hello@creativeme' } });
        }
    }, []);

    useEffect(() => {
        if (session) {
            fetchArtworks();
        }
    }, [session]);

    const fetchArtworks = async () => {
        const { data, error } = await supabase
            .from('artworks')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error) setArtworks(data || []);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        if (email === 'hello@creativeme' && password === 'upload@2026Updesh') {
            setTimeout(() => {
                const adminSession = { user: { id: 'admin-master', email: 'hello@creativeme' } };
                setSession(adminSession);
                sessionStorage.setItem('ghibli_admin_key', 'secure_active_2026');
                setLoading(false);
            }, 1000);
        } else {
            setLoading(false);
            alert("🔒 Access Denied. Invalid Authorization Key.");
        }
    };

    const handleSignOut = () => {
        sessionStorage.removeItem('ghibli_admin_key');
        setSession(null);
        window.location.href = '/';
    };

    const [uploadType, setUploadType] = useState('gallery'); // gallery, featured, upcoming

    // ... existing login logic ...

    const handleEdit = (art) => {
        setEditingId(art.id);
        setTitle(art.title || '');

        // Parse description and subcategory
        let cleanDesc = art.description || '';
        let extractedSub = '';

        // Extract subcategory if present
        const subMatch = cleanDesc.match(/\[SubCategory:\s*(.*?)\]/);
        if (subMatch) {
            extractedSub = subMatch[1];
            cleanDesc = cleanDesc.replace(/\[SubCategory:.*?\]/g, '').trim();
        }

        // Extract featured status
        const isFeaturedItem = cleanDesc.includes('[FEATURED]');
        cleanDesc = cleanDesc.replace(/\[FEATURED\]/g, '').trim();

        setDesc(cleanDesc);

        // Determine mode and category
        if (art.category === 'Upcoming') {
            setUploadType('upcoming');
            setCategory('Mandala'); // Reset category dropdown
        } else if (art.category === 'Featured' || isFeaturedItem) {
            setUploadType('featured');
            setCategory('Mandala');
        } else {
            setUploadType('gallery');
            setCategory(art.category || 'Mandala');
            // Wait for category useEffect to set initial subCategory, then override it
            setTimeout(() => setSubCategory(extractedSub), 0);
        }

        setPreviewUrl(art.image_url);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!session) return;
        if (!file && !editingId) return;

        try {
            setUploading(true);
            let finalImageUrl = null;

            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                // 1. Upload Image
                let { error: uploadError } = await supabase.storage
                    .from('artworks')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // 2. Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('artworks')
                    .getPublicUrl(filePath);

                finalImageUrl = publicUrl;
            } else if (editingId) {
                const art = artworks.find(a => a.id === editingId);
                finalImageUrl = art.image_url;
            }

            // 3. Prepare Metadata
            let finalDescription = desc;
            let finalCategory = category;

            if (uploadType === 'upcoming') {
                finalCategory = 'Upcoming';
            } else if (uploadType === 'featured') {
                finalCategory = 'Featured';
                finalDescription += `\n\n[FEATURED]`;
            } else {
                if (subCategory) finalDescription += `\n\n[SubCategory: ${subCategory}]`;
            }

            if (editingId) {
                // Update Existing
                const { error: dbError } = await supabase
                    .from('artworks')
                    .update({
                        title,
                        description: finalDescription,
                        category: finalCategory,
                        image_url: finalImageUrl,
                    })
                    .eq('id', editingId);

                if (dbError) throw dbError;
            } else {
                // Insert New
                const { error: dbError } = await supabase
                    .from('artworks')
                    .insert([
                        {
                            title,
                            description: finalDescription,
                            category: finalCategory,
                            image_url: finalImageUrl,
                            user_id: session.user.id,
                        },
                    ]);

                if (dbError) throw dbError;
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            resetForm();
            fetchArtworks();
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setDesc('');
        setCategory('Mandala');
        setFile(null);
        setPreviewUrl(null);
        setUploadType('gallery');
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

    const handleDelete = async (art) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${art.title}"? This cannot be undone.`);
        if (!confirmDelete) return;

        try {
            if (art.image_url && art.image_url.includes('storage/v1/object/public/artworks/')) {
                const fileName = art.image_url.split('/').pop();
                await supabase.storage.from('artworks').remove([fileName]);
            }
            const { error: dbError } = await supabase.from('artworks').delete().eq('id', art.id);
            if (dbError) throw dbError;
            setArtworks(artworks.filter(a => a.id !== art.id));
        } catch (error) {
            alert(`Delete failed: ${error.message}`);
        }
    };

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-ghibli-cream p-4 sm:p-6">
                <div className="max-w-md w-full">
                    <a href="/" className="inline-flex items-center gap-2 text-ghibli-wood hover:text-ghibli-navy mb-8 font-bold transition-all group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Studio
                    </a>
                    <div className="card-ghibli p-10 bg-white/40 backdrop-blur-xl border border-white/20 text-center shadow-2xl rounded-[2rem]">
                        <h1 className="text-3xl font-bold text-ghibli-navy font-serif mb-2">Admin Login</h1>
                        <span className="text-[10px] font-bold tracking-[0.3em] text-ghibli-wood/60 uppercase block mb-8">🔒 Secure Authentication System</span>
                        <form onSubmit={handleLogin} className="space-y-6 text-left">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Email</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Password</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold" required />
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-4 bg-ghibli-wood text-ghibli-cream rounded-xl font-bold text-lg hover:bg-[#A0704F] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 mt-4 active:scale-95">
                                {loading ? 'Logging in...' : 'Enter Studio'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-10 pt-24 sm:pt-32 bg-ghibli-cream transition-colors duration-500">
            <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0">
                    <div className="flex flex-col">
                        <a href="/" className="text-sm font-bold text-ghibli-wood hover:text-ghibli-navy transition-colors mb-2 flex items-center gap-1 group">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span> Exit to Site
                        </a>
                        <h1 className="text-3xl sm:text-4xl font-bold text-ghibli-wood font-serif">Artist Dashboard</h1>
                    </div>
                    <button onClick={handleSignOut} className="w-full sm:w-auto px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-95">
                        <span>🚪</span> Sign Out
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
                    {/* Upload Form */}
                    <div className="lg:col-span-1">
                        <div className="card-ghibli p-6 sm:p-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem] lg:sticky lg:top-32">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-ghibli-navy">{editingId ? 'Edit Artwork' : 'New Creation'}</h2>
                                {editingId && (
                                    <button onClick={resetForm} className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline">Cancel</button>
                                )}
                            </div>

                            {/* Mode Selector */}
                            <div className="flex bg-ghibli-paper/20 p-1 rounded-xl mb-8">
                                <button
                                    onClick={() => setUploadType('gallery')}
                                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${uploadType === 'gallery' ? 'bg-white text-ghibli-wood shadow-sm' : 'text-ghibli-charcoal/40 hover:text-ghibli-charcoal/60'}`}
                                >
                                    Gallery
                                </button>
                                <button
                                    onClick={() => setUploadType('featured')}
                                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${uploadType === 'featured' ? 'bg-white text-ghibli-wood shadow-sm' : 'text-ghibli-charcoal/40 hover:text-ghibli-charcoal/60'}`}
                                >
                                    Featured
                                </button>
                                <button
                                    onClick={() => setUploadType('upcoming')}
                                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${uploadType === 'upcoming' ? 'bg-white text-ghibli-wood shadow-sm' : 'text-ghibli-charcoal/40 hover:text-ghibli-charcoal/60'}`}
                                >
                                    Upcoming
                                </button>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Title (Optional)</label>
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold" />
                                </div>

                                {uploadType === 'gallery' ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Main Category</label>
                                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold cursor-pointer">
                                                {Object.keys(CATEGORIES_DATA).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Sub-Category</label>
                                            <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold cursor-pointer">
                                                {CATEGORIES_DATA[category]?.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-xl bg-ghibli-wood/5 border border-ghibli-wood/10 text-center">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-ghibli-wood opacity-60">
                                            {uploadType === 'featured' ? '★ FOR TOP HIGHLIGHTS' : '🌿 FOR UPCOMING ART'}
                                        </span>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Story</label>
                                    <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood h-24" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70 text-left">Image File {editingId && '(Optional if not changing)'}</label>
                                    <div className="relative group">
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" required={!editingId} />
                                        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-ghibli-wood/20 rounded-2xl bg-white/30 hover:bg-white/50 transition-all cursor-pointer overflow-hidden group-hover:border-ghibli-wood/40">
                                            {previewUrl ? (
                                                <div className="relative w-full h-full">
                                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-white text-xs font-bold uppercase tracking-widest">Change Image</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center p-6">
                                                    <span className="text-3xl block mb-2 opacity-50">📸</span>
                                                    <span className="text-[10px] font-bold text-ghibli-wood/60 uppercase tracking-widest">Select File</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <button disabled={uploading} className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1 ${success ? 'bg-green-500 text-white' : 'bg-ghibli-wood text-ghibli-cream hover:bg-[#A0704F]'}`}>
                                    {uploading ? 'Processing...' : success ? '✨ Done!' : editingId ? '✨ Update Artwork' : `✨ Add to ${uploadType === 'upcoming' ? 'Upcoming Art' : uploadType === 'featured' ? 'Highlights' : 'Gallery'}`}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Manage List */}
                    <div className="lg:col-span-2">
                        <div className="card-ghibli p-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem]">
                            <h2 className="text-2xl font-bold mb-8 text-ghibli-navy">Manage Collection ({artworks.length})</h2>
                            <div className="space-y-4">
                                {artworks.length === 0 ? (
                                    <div className="text-center py-20 bg-white/10 rounded-3xl border border-dashed border-ghibli-wood/10">
                                        <span className="text-6xl block mb-6 animate-pulse opacity-40">🌙</span>
                                        <p className="font-bold tracking-[0.3em] text-sm uppercase text-ghibli-wood/80 font-serif">
                                            The gallery is empty
                                        </p>
                                        <p className="text-[10px] text-ghibli-wood/40 mt-4 uppercase tracking-widest font-bold">
                                            Waiting for your first masterpiece
                                        </p>
                                    </div>
                                ) : (
                                    artworks.map((art) => {
                                        const isFeatured = art.description?.includes('[FEATURED]') || art.title?.includes('[FEATURED]');
                                        return (
                                            <div key={art.id} className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 rounded-2xl transition-all border border-transparent hover:border-ghibli-wood/10 group ${isFeatured ? 'bg-ghibli-wood/5' : 'bg-white/20 hover:bg-white/40'}`}>
                                                <div className="w-full sm:w-20 h-40 sm:h-20 rounded-xl overflow-hidden bg-ghibli-paper/20 flex-shrink-0 relative">
                                                    <img src={art.image_url} alt={art.title} className="w-full h-full object-cover" />
                                                    {isFeatured && (
                                                        <div className="absolute top-1 right-1 bg-yellow-400 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm" title="Featured Item">
                                                            ★
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="px-2 py-0.5 rounded-md bg-ghibli-wood/10 text-[9px] font-bold text-ghibli-wood uppercase tracking-widest">{art.category}</span>
                                                        {isFeatured && <span className="text-[9px] font-bold text-yellow-600 uppercase tracking-widest bg-yellow-100 px-2 py-0.5 rounded-md">Featured</span>}
                                                    </div>
                                                    <h3 className="font-bold text-ghibli-charcoal truncate">{art.title || 'Untitled'}</h3>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(art)}
                                                        className="p-3 text-ghibli-wood/60 hover:text-ghibli-wood hover:bg-ghibli-wood/10 rounded-xl transition-all flex items-center justify-center"
                                                        title="Edit artwork"
                                                    >
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M12 20h9" />
                                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(art)}
                                                        className="p-3 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all flex items-center justify-center"
                                                        title="Delete artwork"
                                                    >
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M3 6h18" />
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
