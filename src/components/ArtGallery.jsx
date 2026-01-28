import { useState } from 'react';
import { Link } from 'react-router-dom';
import { artworks, categories } from '../data/artworks';

const ArtGallery = () => {
    const [selectedArt, setSelectedArt] = useState(null);

    return (
        <section id="gallery" className="section-container relative">
            <div className="text-center mb-16">
                <span className="text-ghibli-wood dark:text-ghibli-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
                    The Collection
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-ghibli-charcoal dark:text-white font-serif mb-8 text-shadow-sm">
                    Museum of <span className="italic text-ghibli-wood">Small Things</span>
                </h2>
            </div>

            {/* Category Sections */}
            <div className="space-y-24">
                {categories.map((cat) => {
                    const catArtworks = artworks.filter(art => art.category === cat);
                    const previewArtworks = catArtworks.slice(0, 4);

                    return (
                        <div key={cat} className="animate-fade-in">
                            <div className="flex justify-between items-end mb-8 border-b border-ghibli-wood/10 pb-4">
                                <div>
                                    <h3 className="text-3xl font-serif font-bold text-ghibli-charcoal dark:text-white">{cat}</h3>
                                    <p className="text-xs font-bold text-ghibli-wood tracking-widest uppercase mt-2">({catArtworks.length} Pieces)</p>
                                </div>
                                <Link
                                    to={`/gallery/${cat.toLowerCase()}`}
                                    className="text-sm font-bold text-ghibli-wood hover:text-ghibli-navy flex items-center gap-2 group transition-all"
                                >
                                    See All <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                                {previewArtworks.map((art) => (
                                    <div
                                        key={art.id}
                                        className="group cursor-pointer"
                                        onClick={() => setSelectedArt(art)}
                                    >
                                        <div className="glossy-glass overflow-hidden group-hover:-translate-y-2">
                                            <div className="aspect-[4/5] bg-ghibli-paper/30 relative flex items-center justify-center overflow-hidden">
                                                {art.image ? (
                                                    <img src={art.image} alt={art.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                ) : (
                                                    <span className="text-7xl group-hover:scale-110 transition-transform">{art.icon || '✨'}</span>
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-ghibli-wood/10 transition-colors duration-500"></div>
                                            </div>
                                            <div className="p-5">
                                                <h4 className="text-base md:text-lg font-bold text-ghibli-charcoal dark:text-white font-serif line-clamp-1">{art.title}</h4>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
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
