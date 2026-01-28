import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const CreativeWork = () => {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('artworks')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setArtworks(data || []);
            } catch (err) {
                console.error('Error fetching artworks:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArtworks();
    }, []);

    return (
        <section id="creative-work" className="section-container relative">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <span className="text-ghibli-moss font-bold tracking-[0.2em] uppercase text-xs">
                        Creative Portfolio
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-ghibli-charcoal dark:text-white leading-tight">
                        Handmade with <br />
                        <span className="text-ghibli-moss italic font-serif">patience & love</span>
                    </h2>
                    <p className="text-ghibli-charcoal/70 dark:text-white/70 font-sans leading-relaxed">
                        Beyond the digital screen, I run a small creative shop where I craft physical mandalas and miniature sets.
                        Each piece is a labor of love, designed to bring magic into your home.
                    </p>
                </div>

                {/* Gallery Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <span className="text-4xl animate-bounce">🌿</span>
                        <p className="text-ghibli-moss font-medium animate-pulse">Growing the gallery...</p>
                    </div>
                ) : artworks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                        {artworks.map((art) => (
                            <div key={art.id} className="group relative">
                                <div className="absolute inset-0 bg-ghibli-moss/10 rounded-[2rem] transform rotate-1 group-hover:rotate-3 transition-transform duration-500"></div>
                                <div className="relative bg-white dark:bg-ghibli-dark-card rounded-[2rem] overflow-hidden shadow-lg border border-ghibli-wood/10 card-glass transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
                                    <div className="aspect-square relative overflow-hidden bg-ghibli-paper/20">
                                        {(!art.image_url || art.image_url.trim() === '') ? (
                                            /* Placeholder when NO image is provided or empty string */
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-ghibli-moss/10 to-ghibli-wood/10 animate-pulse">
                                                <span className="text-5xl mb-2">🎨</span>
                                                <span className="text-[10px] font-bold tracking-[0.2em] text-ghibli-moss/60 uppercase">
                                                    Art in Progress
                                                </span>
                                            </div>
                                        ) : (
                                            /* Actual image with smooth fade-in */
                                            <>
                                                <div className="absolute inset-0 bg-ghibli-paper/20 animate-pulse flex items-center justify-center">
                                                    <span className="text-2xl opacity-20">🌿</span>
                                                </div>
                                                <img
                                                    src={art.image_url}
                                                    alt={art.title}
                                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 opacity-0"
                                                    onLoad={(e) => {
                                                        e.target.style.opacity = '1';
                                                        e.target.previousSibling.style.display = 'none';
                                                    }}
                                                />
                                            </>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-ghibli-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end p-6">
                                            <span className="text-white text-xs font-bold tracking-widest uppercase mb-1">
                                                {art.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-2">
                                        <h3 className="text-xl font-bold text-ghibli-charcoal dark:text-white group-hover:text-ghibli-moss transition-colors">
                                            {art.title}
                                        </h3>
                                        <p className="text-sm text-ghibli-charcoal/70 dark:text-white/70 line-clamp-2">
                                            {art.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State: Still looks beautiful */
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 py-12">
                        {/* Visual Side */}
                        <div className="w-full md:w-1/2 relative group">
                            <div className="absolute inset-0 bg-ghibli-moss/20 rounded-[2rem] transform rotate-3 transition-transform group-hover:rotate-6"></div>
                            <div className="relative bg-white dark:bg-ghibli-dark-card p-6 rounded-[2rem] shadow-xl border border-ghibli-wood/10 card-glass aspect-square flex items-center justify-center">
                                <span className="text-6xl animate-float">🌱</span>
                            </div>
                        </div>

                        {/* Text Side */}
                        <div className="w-full md:w-1/2 text-left space-y-6">
                            <h3 className="text-2xl font-bold text-ghibli-charcoal dark:text-white">
                                The garden is being planted!
                            </h3>
                            <p className="text-ghibli-charcoal/70 dark:text-white/70 font-sans leading-relaxed">
                                I'm currently preparing new artworks to share with you. Small business pieces, mandalas, and miniatures are on their way.
                            </p>
                            <div className="pt-4">
                                <a href="#contact" className="inline-block px-10 py-3 rounded-full bg-ghibli-moss text-white font-bold tracking-widest text-xs hover:scale-110 active:scale-95 hover:bg-ghibli-wood transition-all shadow-lg hover:shadow-xl ring-4 ring-transparent hover:ring-ghibli-moss/20">
                                    NOTIFY ME
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CreativeWork;

