import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const FromTheStudio = () => {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedArt, setSelectedArt] = useState(null);

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('artworks')
                    .select('*')
                    .ilike('category', 'upcoming')
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
        <section id="fromthestudio" className="relative overflow-hidden py-24 md:py-32 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 space-y-12 relative z-10">
                {/* Header Section */}
                <div className="space-y-4 mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ghibli-wood/10 border border-ghibli-wood/20 text-ghibli-wood text-xs font-bold tracking-widest uppercase">
                        From the Studio
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-ghibli-charcoal leading-tight tracking-tight">
                        Handmade with <br />
                        <span className="text-ghibli-wood italic font-serif">
                            <a href="/admin" className="cursor-text text-inherit decoration-0 outline-none">patience</a> & love
                        </span>
                    </h2>
                    <p className="text-ghibli-charcoal/70 font-sans leading-relaxed max-w-3xl">
                        Beyond the digital screen, I run a small creative shop where I craft physical mandalas and miniature sets.
                        Each piece is a labor of love, designed to bring magic into your home.
                    </p>
                </div>

                {/* Gallery Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <span className="text-4xl animate-bounce">🌿</span>
                        <p className="text-ghibli-wood font-medium animate-pulse">Growing the gallery...</p>
                    </div>
                ) : artworks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                        {artworks.map((art) => (
                            <div
                                key={art.id}
                                className="group relative cursor-pointer"
                                onClick={() => setSelectedArt(art)}
                            >
                                <div className="absolute inset-0 bg-ghibli-wood/10 rounded-[2rem] transform rotate-1 group-hover:rotate-3 transition-transform duration-500"></div>
                                <div className="relative bg-white rounded-[2rem] overflow-hidden shadow-lg border border-ghibli-wood/10 card-glass transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
                                    <div className="aspect-square relative overflow-hidden bg-ghibli-paper/20">
                                        {(!art.image_url || art.image_url.trim() === '') ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-ghibli-wood/10 to-ghibli-wood/5 animate-pulse">
                                                <span className="text-5xl mb-2">🎨</span>
                                                <span className="text-[10px] font-bold tracking-[0.2em] text-ghibli-wood/60 uppercase">
                                                    Art in Progress
                                                </span>
                                            </div>
                                        ) : (
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
                                    {(art.title || (art.description && art.description.replace(/\[FEATURED\]/g, '').replace(/\[SubCategory:.*?\]/g, '').trim())) && (
                                        <div className="p-6 space-y-2">
                                            {art.title && (
                                                <h3 className="text-xl font-bold text-ghibli-charcoal group-hover:text-ghibli-wood transition-colors">
                                                    {art.title}
                                                </h3>
                                            )}
                                            {art.description && art.description.replace(/\[FEATURED\]/g, '').replace(/\[SubCategory:.*?\]/g, '').trim() && (
                                                <p className="text-sm text-ghibli-charcoal/70 line-clamp-2">
                                                    {art.description.replace(/\[FEATURED\]/g, '').replace(/\[SubCategory:.*?\]/g, '').trim()}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State: Still looks beautiful */
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 py-12">
                        {/* Visual Side */}
                        <div className="w-full md:w-1/2 relative group">
                            <div className="absolute inset-0 bg-ghibli-wood/20 rounded-[2rem] transform rotate-3 transition-transform group-hover:rotate-6"></div>
                            <div className="relative bg-white p-6 rounded-[2rem] shadow-xl border border-ghibli-wood/10 card-glass aspect-square flex items-center justify-center">
                                <span className="text-6xl animate-float">🌱</span>
                            </div>
                        </div>

                        {/* Text Side */}
                        <div className="w-full md:w-1/2 text-left space-y-6">
                            <h3 className="text-2xl font-bold text-ghibli-charcoal">
                                The garden is being planted!
                            </h3>
                            <p className="text-ghibli-charcoal/70 font-sans leading-relaxed">
                                I'm currently preparing new artworks to share with you. Small business pieces, mandalas, and miniatures are on their way.
                            </p>
                            <div className="pt-4 flex justify-center md:justify-start">
                                <a href="#contact" className="inline-block px-6 py-2.5 md:px-10 md:py-3 rounded-full bg-ghibli-wood text-ghibli-cream font-bold tracking-widest text-xs hover:scale-110 active:scale-95 hover:bg-[#A0704F] transition-all shadow-lg hover:shadow-xl ring-4 ring-transparent hover:ring-ghibli-wood/20">
                                    NOTIFY ME
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal - STUDIO STYLE */}
            <AnimatePresence>
                {selectedArt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedArt(null)}
                        className="fixed inset-0 z-[200] bg-ghibli-charcoal/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-ghibli-cream rounded-[2.5rem] overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedArt(null)}
                                className="absolute top-6 right-6 z-20 w-8 h-8 rounded-full bg-ghibli-charcoal/5 hover:bg-ghibli-charcoal/10 flex items-center justify-center text-ghibli-charcoal/60 hover:text-ghibli-charcoal transition-all font-bold"
                            >✕</button>

                            {/* Image Section */}
                            <div className="w-full md:w-[55%] bg-ghibli-paper/30 relative flex items-center justify-center p-8 md:p-12 hidden md:flex">
                                <div className="relative w-full h-full shadow-2xl rounded-lg overflow-hidden max-h-[600px]">
                                    {(!selectedArt.image_url || selectedArt.image_url.trim() === '') ? (
                                        <div className="w-full h-full bg-white flex items-center justify-center">
                                            <span className="text-6xl opacity-20">✨</span>
                                        </div>
                                    ) : (
                                        <img src={selectedArt.image_url} alt={selectedArt.title} className="w-full h-full object-cover" />
                                    )}
                                </div>
                            </div>

                            {/* Mobile Image (Smaller) */}
                            <div className="w-full h-64 md:hidden bg-ghibli-paper/30 relative flex items-center justify-center overflow-hidden">
                                {(!selectedArt.image_url || selectedArt.image_url.trim() === '') ? (
                                    <div className="w-full h-full bg-white flex items-center justify-center">
                                        <span className="text-4xl opacity-20">✨</span>
                                    </div>
                                ) : (
                                    <img src={selectedArt.image_url} alt={selectedArt.title} className="w-full h-full object-cover" />
                                )}
                            </div>

                            {/* Details Section */}
                            <div className="w-full md:w-[45%] p-8 md:p-12 flex flex-col justify-center bg-white relative overflow-y-auto">
                                {/* 1. TITLE */}
                                {selectedArt.title && (
                                    <h3 className="text-3xl md:text-5xl font-bold font-serif text-ghibli-charcoal mb-4 leading-tight">
                                        {selectedArt.title}
                                    </h3>
                                )}

                                {/* 2. NAME (Category + Subcategory) */}
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-ghibli-wood font-bold tracking-[0.2em] uppercase text-[11px] bg-ghibli-paper/30 px-3 py-1 rounded-full">
                                        UPCOMING COLLECTION
                                    </span>
                                    {selectedArt.description?.includes('[SubCategory:') && (
                                        <span className="text-ghibli-charcoal/40 font-bold tracking-[0.2em] uppercase text-[10px]">
                                            • {selectedArt.description.match(/\[SubCategory:\s*(.*?)\]/)?.[1] || ''}
                                        </span>
                                    )}
                                </div>

                                {(selectedArt.title || (selectedArt.description && selectedArt.description.replace(/\[FEATURED\]/g, '').replace(/\[SubCategory:.*?\]/g, '').trim())) && (
                                    <div className="w-12 h-2 mb-8 text-ghibli-gold/40">
                                        <svg viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="4">
                                            <path d="M0 10 Q25 20 50 10 T100 10" />
                                        </svg>
                                    </div>
                                )}

                                {/* 3. STORY */}
                                {selectedArt.description && selectedArt.description.replace(/\[FEATURED\]/g, '').replace(/\[SubCategory:.*?\]/g, '').trim() && (
                                    <div className="prose prose-sm text-ghibli-charcoal/70 leading-loose mb-10 font-sans">
                                        <span className="text-[10px] font-bold tracking-widest uppercase opacity-30 block mb-2">Original Story</span>
                                        <p>
                                            {selectedArt.description
                                                .replace(/\[FEATURED\]/g, '')
                                                .replace(/\[SubCategory:.*?\]/g, '')
                                                .trim()
                                            }
                                        </p>
                                    </div>
                                )}

                                <a
                                    href="/#contact"
                                    onClick={() => setSelectedArt(null)}
                                    className="px-8 py-4 bg-[#8D6E63] text-ghibli-cream rounded-full font-bold tracking-[0.15em] text-xs uppercase hover:bg-[#A0704F] transition-all self-start shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-center w-full md:w-auto"
                                >
                                    Inquire
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default FromTheStudio;


