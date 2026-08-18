import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { FALLBACK_CATEGORIES } from '../constants/categories';
import { isGalleryListing, artMatchesCategory } from '../lib/categoryUtils';
import { isFeatured } from '../lib/artwork';
import { fetchSiteSetting } from '../lib/fetchSettings';
import { useArtworksCatalog } from '../hooks/useArtworksCatalog';
import useSiteSetting from '../hooks/useSiteSettings';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppUrl, hasWhatsApp, DEFAULT_CHANNELS } from '../lib/enquire';
import GalleryPageSkeleton from './skeletons/GalleryPageSkeleton';
import ScrollRevealItem from './ScrollRevealItem';
import ArtworkImage from './ArtworkImage';
import WhatsAppButton from './WhatsAppButton';

const FALLBACK_CATEGORIES_LOCAL = FALLBACK_CATEGORIES;

const ArtGallery = () => {
    const { artworks: catalog, loading } = useArtworksCatalog();
    const { value: channels } = useSiteSetting('contact_channels', DEFAULT_CHANNELS);
    const { wishlist, toggleWishlist } = useStore();
    const artworks = catalog.filter(isGalleryListing);
    const [selectedArt, setSelectedArt] = useState(null);
    const [categories, setCategories] = useState(FALLBACK_CATEGORIES_LOCAL);
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const catValue = await fetchSiteSetting('category_definitions', null);
        if (catValue?.length) setCategories(catValue);
    };

    // Filter artworks based on category
    const filteredArtworks = artworks.filter(art => {
        if (activeFilter === 'All') {
            return !art.category?.toLowerCase().includes('upcoming');
        }
        if (activeFilter === 'Featured') {
            return isFeatured(art);
        }
        const catDef = categories.find((c) => c.label === activeFilter);
        return artMatchesCategory(art, activeFilter, categories) || 
               (catDef && artMatchesCategory(art, catDef.id, categories));
    });

    if (loading) {
        return <GalleryPageSkeleton />;
    }

    return (
        <section id="gallery" className="relative bg-[#FBF8EC] text-ghibli-charcoal font-gallery w-full min-h-screen pb-20 sm:pb-32">
            
            {/* ULTRA MINIMAL HERO SECTION */}
            <div className="relative w-full pt-32 sm:pt-48 pb-12 sm:pb-20 flex flex-col items-center text-center px-4 sm:px-6 md:px-12 z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl mx-auto"
                >
                    <span className="block text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-ghibli-wood mb-4">
                        The Grand Exhibition
                    </span>
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-black font-serif tracking-tighter mb-6 leading-tight text-ghibli-charcoal">
                        Masterpieces in Motion
                    </h1>
                    <p className="text-ghibli-charcoal/60 max-w-xl mx-auto text-base sm:text-xl font-light leading-relaxed">
                        A curated sanctuary of devotion and detail. Explore the pinnacle of handmade craftsmanship.
                    </p>
                </motion.div>
            </div>

            {/* STICKY FILTER BAR */}
            <div className="sticky top-0 z-40 bg-[#FBF8EC]/90 backdrop-blur-xl border-y border-ghibli-wood/10 py-4 mb-12 sm:mb-16">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
                    <div className="flex overflow-x-auto gap-2 sm:gap-4 no-scrollbar items-center justify-start md:justify-center">
                        {['All', 'Featured', ...categories.map(c => c.label)].map((filterLabel) => (
                            <button
                                key={filterLabel}
                                onClick={() => setActiveFilter(filterLabel)}
                                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase whitespace-nowrap transition-all duration-300 ${
                                    activeFilter === filterLabel
                                    ? 'bg-ghibli-charcoal text-white shadow-md'
                                    : 'bg-transparent text-ghibli-charcoal/50 hover:text-ghibli-charcoal hover:bg-ghibli-wood/5'
                                }`}
                            >
                                {filterLabel}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* MASONRY GRID LAYOUT */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
                {filteredArtworks.length > 0 ? (
                    <div className="columns-2 lg:columns-3 xl:columns-4 gap-3 sm:gap-8 space-y-3 sm:space-y-8">
                        {filteredArtworks.map((work, index) => {
                            const inWishlist = wishlist.some(item => item.id === work.id);
                            return (
                            <ScrollRevealItem
                                key={work.id || index}
                                index={index % 10}
                                amount={0.1}
                                delayStep={0.05}
                                duration={0.7}
                                y={30}
                                className="break-inside-avoid"
                            >
                                <div 
                                    className="group cursor-pointer flex flex-col items-center"
                                    onClick={() => setSelectedArt(work)}
                                >
                                    <div className="w-full bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 mb-4 border border-ghibli-wood/5 relative">
                                        <div className="absolute inset-0 bg-black/5 hover:bg-black/0 transition-colors duration-500 z-10 pointer-events-none"></div>
                                        <ArtworkImage
                                            src={work.image_url}
                                            alt={work.title}
                                            size="card"
                                            objectFit="object-cover"
                                            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-1000"
                                        />
                                        {isFeatured(work) && (
                                            <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-ghibli-wood/10 pointer-events-none">
                                                <span className="text-[9px] uppercase tracking-widest font-bold text-ghibli-wood">Featured</span>
                                            </div>
                                        )}
                                        
                                        {/* Wishlist Button Overlay */}
                                        <div className="absolute top-4 right-4 z-20">
                                            <button
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(work); }}
                                                className={`w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm hover:scale-110 transition-all border border-ghibli-wood/10 ${inWishlist ? 'text-red-500' : 'text-ghibli-charcoal/30 hover:text-red-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100'}`}
                                                aria-label={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth={inWishlist ? "0" : "2"} className="w-5 h-5 transition-all duration-300">
                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-center px-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <h3 className="font-serif text-lg sm:text-xl font-bold text-ghibli-charcoal mb-1 group-hover:text-ghibli-wood transition-colors">
                                            {work.title}
                                        </h3>
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-ghibli-charcoal/40">
                                            {work.category || 'Collection'}
                                        </p>
                                    </div>
                                </div>
                            </ScrollRevealItem>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-32 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full border border-ghibli-wood/20 flex items-center justify-center mb-6">
                            <span className="text-2xl text-ghibli-wood">✨</span>
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-ghibli-charcoal mb-2">Pieces in the making</h3>
                        <p className="text-ghibli-charcoal/50 text-sm tracking-wide">New artworks for this collection will be unveiled soon.</p>
                    </div>
                )}
            </div>

            {/* MINIMAL LIGHT MODAL */}
            <AnimatePresence>
                {selectedArt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedArt(null)}
                        className="fixed inset-0 z-[200] bg-[#FBF8EC]/90 backdrop-blur-lg flex items-center justify-center p-4 md:p-8 overflow-y-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.98, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.98, opacity: 0, y: 20 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-white rounded-[2rem] overflow-hidden max-w-5xl w-full flex flex-col md:flex-row shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-ghibli-wood/5 relative my-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedArt(null)}
                                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/50 backdrop-blur-md sm:bg-[#FBF8EC] hover:bg-ghibli-wood/10 flex items-center justify-center text-ghibli-charcoal transition-all font-bold shadow-sm"
                            >✕</button>

                            {/* Image Section */}
                            <div className="w-full md:w-1/2 bg-[#FBF8EC]/30 relative flex items-center justify-center p-4 sm:p-6 md:p-12 border-b md:border-b-0 md:border-r border-ghibli-wood/5 min-h-[45vh] md:min-h-[70vh]">
                                {(!selectedArt.image_url || selectedArt.image_url.trim() === '') ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-4xl opacity-10">✨</span>
                                    </div>
                                ) : (
                                    <ArtworkImage
                                        src={selectedArt.image_url}
                                        alt={selectedArt.title}
                                        size="detail"
                                        objectFit="object-contain"
                                        className="w-full h-full"
                                        imgClassName="drop-shadow-xl rounded-xl object-contain max-h-full"
                                    />
                                )}
                            </div>

                            {/* Details Section */}
                            <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-14 flex flex-col justify-center bg-white relative">
                                {isFeatured(selectedArt) && (
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-ghibli-wood mb-3 sm:mb-4 block">
                                        Featured Masterpiece
                                    </span>
                                )}
                                
                                {selectedArt.title && (
                                    <h3 className="text-2xl sm:text-3xl md:text-5xl font-black font-serif text-ghibli-charcoal mb-3 sm:mb-4 leading-tight">
                                        {selectedArt.title}
                                    </h3>
                                )}

                                <div className="flex items-center gap-3 mb-8">
                                    <span className="text-ghibli-charcoal/40 font-bold tracking-[0.15em] uppercase text-[10px] md:text-xs">
                                        {selectedArt.category?.toUpperCase() || 'COLLECTION'}
                                    </span>
                                    {selectedArt.description?.includes('[SubCategory:') && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-ghibli-wood/30"></span>
                                            <span className="text-ghibli-charcoal/40 font-bold tracking-[0.15em] uppercase text-[10px] md:text-xs">
                                                {selectedArt.description.match(/\[SubCategory:\s*(.*?)\]/)?.[1] || ''}
                                            </span>
                                        </>
                                    )}
                                </div>

                                {selectedArt.description && selectedArt.description.replace(/\[FEATURED\]/g, '').replace(/\[SubCategory:.*?\]/g, '').trim() && (
                                    <div className="prose prose-sm md:prose-base text-ghibli-charcoal/70 leading-relaxed mb-10 font-sans font-light">
                                        <p>
                                            {selectedArt.description
                                                .replace(/\[FEATURED\]/g, '')
                                                .replace(/\[SubCategory:.*?\]/g, '')
                                                .trim()
                                            }
                                        </p>
                                    </div>
                                )}

                                <WhatsAppButton
                                    href={buildWhatsAppUrl(selectedArt, channels)}
                                    disabled={!hasWhatsApp(channels)}
                                    onClick={() => setSelectedArt(null)}
                                    className="mt-auto px-8 py-4 bg-[#25D366] text-white rounded-full font-bold tracking-[0.15em] text-xs uppercase hover:bg-[#20bd5a] transition-all self-start text-center shadow-[0_8px_20px_rgba(37,211,102,0.25)]"
                                >
                                    Inquire About Piece
                                </WhatsAppButton>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default ArtGallery;
