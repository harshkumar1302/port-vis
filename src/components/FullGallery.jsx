import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const FullGallery = () => {
    const { category } = useParams();
    const [selectedArt, setSelectedArt] = useState(null);
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                setLoading(true);
                let query = supabase
                    .from('artworks')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (category !== 'all') {
                    // Match category (case-insensitive-ish as we store capitalized)
                    query = query.ilike('category', category);
                }

                const { data, error } = await query;
                if (error) throw error;
                setArtworks(data || []);
            } catch (err) {
                console.error('Error fetching full gallery:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchArtworks();
    }, [category]);

    const categoryTitle = category === 'all' ? 'All Works' : `${category} Collection`;

    return (
        <div className="min-h-screen pt-32 pb-20 bg-ghibli-cream">
            <div className="section-container">
                {/* Header */}
                <div className="mb-12">
                    <Link to="/" className="inline-flex items-center gap-2 text-ghibli-wood hover:text-ghibli-navy mb-6 font-bold transition-all group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Studio
                    </Link>
                    <h1 className="text-5xl font-serif font-bold text-ghibli-charcoal mb-4 capitalize">
                        {categoryTitle}
                    </h1>
                    <p className="text-ghibli-charcoal/60 max-w-2xl">
                        Exploring the depths of {category === 'all' ? 'my creative journey' : category.toLowerCase()} through patience, color, and soul.
                    </p>
                </div>

                {/* Grid Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <span className="text-4xl animate-bounce">🎨</span>
                        <p className="text-ghibli-moss font-medium animate-pulse">Gathering the collection...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                        {Array.from({ length: Math.max(8, artworks.length) }).map((_, index) => {
                            const art = artworks[index];
                            const isPlaceholder = !art;
                            const id = isPlaceholder ? `placeholder-${index}` : art.id;
                            const title = isPlaceholder ? `Piece ${index + 1}` : art.title;

                            return (
                                <div
                                    key={id}
                                    className={`group animate-fade-in ${isPlaceholder ? 'cursor-default' : 'cursor-pointer'}`}
                                    onClick={() => !isPlaceholder && setSelectedArt(art)}
                                >
                                    <div className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-ghibli-wood/5 transition-all duration-500 group-hover:-translate-y-2 hover:shadow-2xl">
                                        <div className="aspect-[4/5] bg-ghibli-paper/30 relative flex items-center justify-center overflow-hidden">
                                            {isPlaceholder ? (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-ghibli-moss/5 to-ghibli-wood/5 group-hover:from-ghibli-moss/10 transition-colors">
                                                    <span className="text-5xl opacity-20 grayscale scale-90 group-hover:scale-100 group-hover:grayscale-0 transition-all duration-500">📜</span>
                                                    <span className="text-[10px] font-bold tracking-widest text-ghibli-wood/30 uppercase mt-4">In Progress</span>
                                                </div>
                                            ) : (
                                                <>
                                                    {(!art.image_url || art.image_url.trim() === '') ? (
                                                        <span className="text-7xl group-hover:scale-110 transition-transform">✨</span>
                                                    ) : (
                                                        <img src={art.image_url} alt={art.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    )}
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-ghibli-wood/10 transition-colors duration-500"></div>
                                                </>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isPlaceholder ? 'text-ghibli-charcoal/40' : 'text-ghibli-wood'}`}>
                                                {isPlaceholder ? 'Gallery Slot' : art.category}
                                            </span>
                                            <h3 className={`text-lg font-bold mt-1 font-serif line-clamp-1 transition-colors ${isPlaceholder ? 'text-ghibli-charcoal/20' : 'text-ghibli-charcoal group-hover:text-ghibli-moss'}`}>
                                                {title}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedArt && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-ghibli-charcoal/80 backdrop-blur-md animate-fade-in"
                    onClick={() => setSelectedArt(null)}
                >
                    <div
                        className="bg-ghibli-cream p-8 md:p-12 rounded-[3rem] max-w-4xl w-full flex flex-col md:flex-row gap-8 shadow-2xl relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <button className="absolute top-6 right-8 text-3xl opacity-50 hover:opacity-100 transition-opacity" onClick={() => setSelectedArt(null)}>×</button>

                        <div className="w-full md:w-1/2 aspect-square bg-ghibli-paper/50 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner">
                            {(!selectedArt.image_url || selectedArt.image_url.trim() === '') ? (
                                <span className="text-[8rem]">✨</span>
                            ) : (
                                <img src={selectedArt.image_url} alt={selectedArt.title} className="w-full h-full object-cover" />
                            )}
                        </div>

                        <div className="w-full md:w-1/2 flex flex-col justify-center text-left">
                            <span className="text-ghibli-wood font-bold uppercase tracking-widest text-xs mb-4">{selectedArt.category}</span>
                            <h3 className="text-4xl font-serif font-bold text-ghibli-charcoal mb-6 underline decoration-ghibli-gold/30 decoration-wavy underline-offset-8">
                                {selectedArt.title}
                            </h3>
                            <p className="text-ghibli-charcoal/80 leading-loose font-sans text-lg mb-8">
                                {selectedArt.description}
                            </p>
                            <a href="#contact" onClick={() => setSelectedArt(null)} className="px-8 py-3 bg-ghibli-wood text-ghibli-cream rounded-full font-bold tracking-widest text-sm hover:bg-ghibli-navy transition-all self-start shadow-lg">
                                INQUIRE
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FullGallery;

