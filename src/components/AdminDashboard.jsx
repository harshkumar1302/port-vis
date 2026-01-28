
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

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
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

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

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !session) return;

        try {
            setUploading(true);
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

            // 3. Save Metadata to DB
            const { error: dbError } = await supabase
                .from('artworks')
                .insert([
                    {
                        title,
                        description: desc,
                        category,
                        image_url: publicUrl,
                        user_id: session.user.id
                    },
                ]);

            if (dbError) throw dbError;

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            setTitle('');
            setDesc('');
            setCategory('Mandala');
            setFile(null);
            setPreviewUrl(null);
            fetchArtworks(); // Refresh list
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
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
            // 1. Delete from Storage if it's a supabase URL
            if (art.image_url && art.image_url.includes('storage/v1/object/public/artworks/')) {
                const fileName = art.image_url.split('/').pop();
                const { error: storageError } = await supabase.storage
                    .from('artworks')
                    .remove([fileName]);

                if (storageError) {
                    console.warn('Storage delete could not find file, proceeding to DB delete...', storageError);
                }
            }

            // 2. Delete from DB - with count to check if RLS blocked it
            const { error: dbError, count } = await supabase
                .from('artworks')
                .delete({ count: 'exact' }) // Requesting exact count
                .eq('id', art.id);

            if (dbError) throw dbError;

            // If count is 0, it means the row exists but RLS prevented deletion
            if (count === 0) {
                alert("🔒 Permission Denied: The database refused to delete this item. Please ensure you've run the 'Anyone can delete art' SQL script in Supabase.");
                return;
            }

            setArtworks(artworks.filter(a => a.id !== art.id));
        } catch (error) {
            console.error('Delete error details:', error);
            alert(`Delete failed: ${error.message}`);
        }
    };

    // Login UI remains same
    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-ghibli-cream dark:bg-ghibli-dark-bg p-4 sm:p-6">
                <div className="max-w-md w-full">
                    <a href="/" className="inline-flex items-center gap-2 text-ghibli-wood hover:text-ghibli-navy mb-8 font-bold transition-all group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Studio
                    </a>

                    <div className="card-ghibli p-10 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 text-center shadow-2xl rounded-[2rem]">
                        <div className="flex flex-col items-center mb-8">
                            <h1 className="text-3xl font-bold text-ghibli-navy dark:text-ghibli-gold font-serif">Admin Login</h1>
                            <span className="text-[10px] font-bold tracking-[0.3em] text-ghibli-wood/60 uppercase mt-2">🔒 Secure Authentication System</span>
                        </div>
                        <form onSubmit={handleLogin} className="space-y-6 text-left">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70 dark:text-white/70">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood dark:text-ghibli-charcoal font-bold"
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70 dark:text-white/70">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood dark:text-ghibli-charcoal font-bold"
                                    placeholder="Password"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-ghibli-wood text-ghibli-cream rounded-xl font-bold text-lg hover:bg-ghibli-navy transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 mt-4 active:scale-95"
                            >
                                {loading ? 'Logging in...' : 'Enter Studio'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-10 pt-24 sm:pt-32 bg-ghibli-cream dark:bg-ghibli-dark-bg transition-colors duration-500">
            <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0">
                    <div className="flex flex-col">
                        <a href="/" className="text-sm font-bold text-ghibli-wood hover:text-ghibli-navy transition-colors mb-2 flex items-center gap-1 group">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span> Exit to Site
                        </a>
                        <h1 className="text-3xl sm:text-4xl font-bold text-ghibli-wood dark:text-ghibli-paper font-serif">Artist Dashboard</h1>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="w-full sm:w-auto px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <span>🚪</span> Sign Out
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
                    {/* Left Side: Upload Form */}
                    <div className="lg:col-span-1">
                        <div className="card-ghibli p-6 sm:p-8 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-[2rem] lg:sticky lg:top-32">
                            <h2 className="text-2xl font-bold mb-8 text-ghibli-navy dark:text-ghibli-gold">New Creation</h2>
                            <form onSubmit={handleUpload} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70 dark:text-white/70">Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood dark:text-ghibli-charcoal font-bold"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70 dark:text-white/70">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood dark:text-ghibli-charcoal font-bold cursor-pointer"
                                    >
                                        <option>Mandala</option>
                                        <option>Miniature</option>
                                        <option>Canva</option>
                                        <option>Calligraphy</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70 dark:text-white/70">Story</label>
                                    <textarea
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood dark:text-ghibli-charcoal h-24"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70 dark:text-white/70 text-left">Reference Image</label>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="file-upload"
                                            required
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-ghibli-wood/20 rounded-2xl bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10 transition-all cursor-pointer overflow-hidden group-hover:border-ghibli-wood/40"
                                        >
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
                                                    <span className="text-[10px] font-bold text-ghibli-wood/60 dark:text-white/40 uppercase tracking-widest">Select Artwork File</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>
                                <button
                                    disabled={uploading}
                                    className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1 ${success ? 'bg-green-500 text-white' : 'bg-ghibli-wood text-ghibli-cream hover:bg-ghibli-navy'}`}
                                >
                                    {uploading ? 'Uploading...' : success ? '✨ Done!' : '✨ Add Work'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Side: Management List */}
                    <div className="lg:col-span-2">
                        <div className="card-ghibli p-8 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-[2rem]">
                            <h2 className="text-2xl font-bold mb-8 text-ghibli-navy dark:text-ghibli-gold">Manage Collection ({artworks.length})</h2>
                            <div className="space-y-4">
                                {artworks.length === 0 ? (
                                    <div className="text-center py-20 bg-white/10 dark:bg-white/5 rounded-3xl border border-dashed border-ghibli-wood/10">
                                        <span className="text-6xl block mb-6 animate-pulse opacity-40">🌙</span>
                                        <p className="font-bold tracking-[0.3em] text-sm uppercase text-ghibli-wood/80 dark:text-ghibli-paper font-serif">
                                            The gallery is empty
                                        </p>
                                        <p className="text-[10px] text-ghibli-wood/40 dark:text-white/30 mt-4 uppercase tracking-widest font-bold">
                                            Waiting for your first masterpiece
                                        </p>
                                    </div>
                                ) : (
                                    artworks.map((art) => (
                                        <div key={art.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 rounded-2xl bg-white/20 dark:bg-white/5 hover:bg-white/40 dark:hover:bg-white/10 transition-all border border-transparent hover:border-ghibli-wood/10 group">
                                            <div className="w-full sm:w-20 h-40 sm:h-20 rounded-xl overflow-hidden bg-ghibli-paper/20 flex-shrink-0">
                                                {art.image_url ? (
                                                    <img src={art.image_url} alt={art.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-2xl">✨</div>
                                                )}
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-2 py-0.5 rounded-md bg-ghibli-wood/10 text-[9px] font-bold text-ghibli-wood uppercase tracking-widest">
                                                        {art.category}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-ghibli-charcoal dark:text-white truncate text-lg sm:text-base">{art.title}</h3>
                                                <p className="text-xs text-ghibli-charcoal/50 dark:text-white/40 line-clamp-2 sm:line-clamp-1">{art.description}</p>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(art)}
                                                className="self-end sm:self-center p-3 text-red-500 opacity-60 sm:opacity-20 group-hover:opacity-100 hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
                                                title="Delete Piece"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))
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

