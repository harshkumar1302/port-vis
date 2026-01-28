
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AdminDashboard = () => {
    const [session, setSession] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Artwork form state
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState('Mandala');
    const [file, setFile] = useState(null);

    useEffect(() => {
        const sessionAuth = sessionStorage.getItem('ghibli_admin_key');
        if (sessionAuth === 'secure_active_2026') {
            setSession({ user: { id: 'admin-master', email: 'hello@creativeme' } });
        }
    }, []);

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
            const fileName = `${Math.random()}.${fileExt}`;
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
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    // Login UI remains same
    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-ghibli-cream dark:bg-ghibli-dark-bg p-6">
                <div className="max-w-md w-full">
                    <a href="/" className="inline-flex items-center gap-2 text-ghibli-wood hover:text-ghibli-navy mb-8 font-bold transition-all group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Studio
                    </a>

                    <div className="card-ghibli p-10 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 text-center shadow-2xl">
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
                                className="w-full py-4 bg-ghibli-wood text-ghibli-cream rounded-xl font-bold text-lg hover:bg-ghibli-navy transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 mt-4"
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
        <div className="min-h-screen p-10 pt-32 bg-ghibli-cream dark:bg-ghibli-dark-bg">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div className="flex flex-col">
                        <a href="/" className="text-sm font-bold text-ghibli-wood hover:text-ghibli-navy transition-colors mb-2 flex items-center gap-1 group">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span> Exit to Site
                        </a>
                        <h1 className="text-4xl font-bold text-ghibli-wood dark:text-ghibli-paper font-serif">Artist Dashboard</h1>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="px-6 py-2 bg-red-500/80 text-white rounded-full text-sm font-bold shadow-lg hover:bg-red-600 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>

                <div className="card-ghibli p-10 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20">
                    <h2 className="text-2xl font-bold mb-8 text-ghibli-navy dark:text-ghibli-gold">Upload New Artwork</h2>
                    <form onSubmit={handleUpload} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood dark:text-ghibli-charcoal font-bold cursor-pointer appearance-none"
                                >
                                    <option>Mandala</option>
                                    <option>Miniature</option>
                                    <option>Canva</option>
                                    <option>Calligraphy</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70 dark:text-white/70">Story / Description</label>
                            <textarea
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood dark:text-ghibli-charcoal h-32"
                                placeholder="What is the story behind this piece?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70 dark:text-white/70">Image File</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="w-full p-3 rounded-xl border-2 border-dashed border-ghibli-wood/20 hover:border-ghibli-wood/50 transition-colors cursor-pointer"
                                required
                            />
                        </div>

                        <button
                            disabled={uploading}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 ${success ? 'bg-green-500 text-white' : 'bg-ghibli-wood text-ghibli-cream hover:bg-ghibli-navy'}`}
                        >
                            {uploading ? 'Uploading to Gallery...' : success ? '✨ Success! Added to Collection' : '✨ Add to Collection'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
