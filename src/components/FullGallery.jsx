import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { artworks } from '../data/artworks';

const FullGallery = () => {
    const { category } = useParams();
    const [selectedArt, setSelectedArt] = useState(null);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const filteredArtworks = category === 'all'
        ? artworks
        : artworks.filter(art => art.category.toLowerCase() === category.toLowerCase());

    const categoryTitle = category === 'all' ? 'All Works' : `${category} Collection`;

    return (
        <div className="min-h-screen pt-32 pb-20 bg-ghibli-cream dark:bg-ghibli-dark-bg">
            <div className="section-container">
                {/* Header */}
                <div className="mb-12">
                    <Link to="/" className="inline-flex items-center gap-2 text-ghibli-wood hover:text-ghibli-navy mb-6 font-bold transition-all group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Studio
                    </Link>
                    <h1 className="text-5xl font-serif font-bold text-ghibli-charcoal dark:text-white mb-4 capitalize">
                        {categoryTitle}
                    </h1>
                    <p className="text-ghibli-charcoal/60 dark:text-white/60 max-w-2xl">
                        Exploring the depths of {category === 'all' ? 'my creative journey' : category.toLowerCase()} through patience, color, and soul.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                    {filteredArtworks.map((art) => (
                        <div
                            key={art.id}
                            className="group cursor-pointer animate-fade-in"
                            onClick={() => setSelectedArt(art)}
                        >
                            <div className="bg-white dark:bg-ghibli-dark-card rounded-[2rem] overflow-hidden shadow-lg border border-ghibli-wood/5 dark:border-white/5 transition-all duration-500 group-hover:-translate-y-2 hover:shadow-2xl">
                                <div className="aspect-[4/5] bg-ghibli-paper/30 relative flex items-center justify-center overflow-hidden">
                                    {art.image ? (
                                        <img src={art.image} alt={art.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    ) : (
                                        <span className="text-7xl group-hover:scale-110 transition-transform">{art.icon || '✨'}</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-ghibli-wood/10 transition-colors duration-500"></div>
                                </div>
                                <div className="p-6">
                                    <span className="text-[10px] font-bold text-ghibli-wood dark:text-ghibli-gold uppercase tracking-widest">{art.category}</span>
                                    <h3 className="text-lg font-bold text-ghibli-charcoal dark:text-white mt-1 font-serif line-clamp-1">{art.title}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal - Reusing same style */}
            {selectedArt && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-ghibli-charcoal/80 backdrop-blur-md animate-fade-in"
                    onClick={() => setSelectedArt(null)}
                >
                    <div
                        className="bg-ghibli-cream dark:bg-ghibli-dark-bg p-8 md:p-12 rounded-[3rem] max-w-4xl w-full flex flex-col md:flex-row gap-8 shadow-2xl relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <button className="absolute top-6 right-8 text-3xl opacity-50 hover:opacity-100 transition-opacity" onClick={() => setSelectedArt(null)}>×</button>

                        <div className="w-full md:w-1/2 aspect-square bg-ghibli-paper/50 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner">
                            {selectedArt.image ? (
                                <img src={selectedArt.image} alt={selectedArt.title} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-[8rem]">{selectedArt.icon || "✨"}</span>
                            )}
                        </div>

                        <div className="w-full md:w-1/2 flex flex-col justify-center text-left">
                            <span className="text-ghibli-wood dark:text-ghibli-gold font-bold uppercase tracking-widest text-xs mb-4">{selectedArt.category}</span>
                            <h3 className="text-4xl font-serif font-bold text-ghibli-charcoal dark:text-white mb-6 underline decoration-ghibli-gold/30 decoration-wavy underline-offset-8">
                                {selectedArt.title}
                            </h3>
                            <p className="text-ghibli-charcoal/80 dark:text-white/80 leading-loose font-sans text-lg mb-8">
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
