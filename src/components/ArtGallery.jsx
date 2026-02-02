import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ArtGallery = () => {
    const [selectedArt, setSelectedArt] = useState(null);
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = ['Mandala', 'Miniature', 'Canva', 'Calligraphy'];

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
                console.error('Error fetching gallery:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchArtworks();
    }, []);

    return (
        <section id="gallery" className="section-container relative">
            <div className="text-center mb-16">
                <span className="text-ghibli-wood font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
                    The Collection
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-ghibli-charcoal font-serif mb-8 text-shadow-sm">
                    Museum of <span className="italic text-ghibli-wood">Small Things</span>
                </h2>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <span className="text-4xl animate-bounce">🎨</span>
                    <p className="text-ghibli-moss font-medium animate-pulse">Curating the collections...</p>
                </div>
            ) : (
                /* Category Sections */
                <div className="space-y-24">
                    {categories.map((cat) => {
                        const catArtworks = artworks.filter(art => art.category === cat);

                        // Create 4 slots for the preview grid (balanced for 4-col grid)
                        const slots = Array.from({ length: 4 }).map((_, index) => {
                            if (catArtworks[index]) {
                                return { ...catArtworks[index], isPlaceholder: false };
                            }
                            return {
                                id: `placeholder-${cat}-${index}`,
                                title: `${cat} Piece ${index + 1}`,
                                isPlaceholder: true
                            };
                        });

                        return (
                            <div key={cat} className="animate-fade-in">
                                <div className="flex justify-between items-end mb-8 border-b border-ghibli-wood/10 pb-4">
                                    <div>
                                        <h3 className="text-3xl font-serif font-bold text-ghibli-charcoal">{cat}</h3>
                                        <p className="text-xs font-bold text-ghibli-wood/60 tracking-widest uppercase mt-2">({catArtworks.length} Pieces)</p>
                                    </div>
                                    <Link
                                        to={`/gallery/${cat.toLowerCase()}`}
                                        className="text-sm font-bold text-ghibli-wood hover:text-ghibli-navy flex items-center gap-2 group transition-all"
                                    >
                                        See All <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </Link>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                                    {slots.map((art) => (
                                        <div
                                            key={art.id}
                                            className={`group ${art.isPlaceholder ? 'cursor-default' : 'cursor-pointer'}`}
                                            onClick={() => !art.isPlaceholder && setSelectedArt(art)}
                                        >
                                            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-ghibli-wood/5 transition-all duration-500 group-hover:-translate-y-2 hover:shadow-2xl">
                                                <div className="aspect-[4/5] bg-ghibli-paper/30 relative flex items-center justify-center overflow-hidden">
                                                    {art.isPlaceholder ? (
                                                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-ghibli-moss/5 to-ghibli-wood/5 group-hover:from-ghibli-moss/10 transition-colors">
                                                            <span className="text-4xl opacity-20 grayscale scale-90 group-hover:scale-100 group-hover:grayscale-0 transition-all duration-500">🎨</span>
                                                            <span className="text-[9px] font-bold tracking-widest text-ghibli-charcoal/40 uppercase mt-3">In Progress</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {(!art.image_url || art.image_url.trim() === '') ? (
                                                                <span className="text-5xl group-hover:scale-110 transition-transform">✨</span>
                                                            ) : (
                                                                <img
                                                                    src={art.image_url}
                                                                    alt={art.title}
                                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                                />
                                                            )}
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-ghibli-wood/10 transition-colors duration-500"></div>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="p-5">
                                                    <h4 className={`text-base font-bold font-serif line-clamp-1 transition-colors ${art.isPlaceholder ? 'text-ghibli-charcoal/20' : 'text-ghibli-charcoal group-hover:text-ghibli-moss'}`}>
                                                        {art.title}
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

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
                            <a href="#contact" onClick={() => setSelectedArt(null)} className="px-8 py-3 bg-ghibli-wood text-ghibli-cream rounded-full font-bold tracking-widest text-sm hover:bg-ghibli-navy transition-all self-start shadow-lg hover:-translate-y-1">
                                INQUIRE
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ArtGallery;

