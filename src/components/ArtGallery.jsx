import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';

import { supabase } from '../lib/supabaseClient';

// --- Constants ---
const MAIN_CATEGORIES = [
    { id: 'mandala', label: 'Mandala Art' },
    { id: 'miniature', label: 'Miniatures' },
    { id: 'gift', label: 'Gift Material' },
    { id: 'diy', label: 'DIY Art' },
];

const ArtGallery = () => {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedArt, setSelectedArt] = useState(null);
    const [categoryPriorities, setCategoryPriorities] = useState({});
    const [artworkOrders, setArtworkOrders] = useState({});

    // Embla Carousels
    const [featuredEmblaRef, featuredEmblaApi] = useEmblaCarousel({
        loop: false,
        align: 'start',
        startIndex: 0,
        containScroll: 'trimSnaps',
        dragFree: true
    });

    const scrollPrev = () => featuredEmblaApi && featuredEmblaApi.scrollPrev();
    const scrollNext = () => featuredEmblaApi && featuredEmblaApi.scrollNext();

    useEffect(() => {
        fetchArtworks();
        fetchShowcaseSettings();
    }, []);

    const fetchShowcaseSettings = async () => {
        try {
            const res = await fetch('/api/settings?id=category_priorities');
            if (res.ok) {
                const data = await res.json();
                setCategoryPriorities(data.value || {});
            }

            const resOrder = await fetch('/api/settings?id=artwork_orders');
            if (resOrder.ok) {
                const data = await resOrder.json();
                setArtworkOrders(data.value || {});
            }
        } catch (err) {
            console.error('Failed to fetch category priorities:', err);
        }
    };


    const fetchArtworks = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('artworks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setArtworks(data || []);
        } catch (error) {
            console.error('Error fetching artworks:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to get items for a category
    const getCategoryItems = (catId) => {
        return artworks.filter(art =>
            art.category?.toLowerCase().includes(catId) &&
            !art.category?.toLowerCase().includes('upcoming') &&
            !art.description?.includes('[FEATURED]') &&
            !art.title?.includes('[FEATURED]')
        );
    };

    // Helper to get Featured items
    const getFeaturedItems = () => {
        return artworks.filter(art =>
            art.description?.includes('[FEATURED]') ||
            art.title?.includes('[FEATURED]') ||
            art.tags?.includes('[FEATURED]') ||
            art.category?.toLowerCase() === 'featured'
        );
    };

    const getDisplayItems = (items, placeholderCount = 8, minThreshold = 8) => {
        const result = [...items];
        // Only show placeholders if we haven't reached the "mature gallery" threshold
        if (result.length < minThreshold) {
            const placeholdersNeeded = Math.max(0, placeholderCount - result.length);
            for (let i = 0; i < placeholdersNeeded; i++) {
                result.push({ id: `placeholder-${i}`, isPlaceholder: true });
            }
        }
        return result;
    };

    // Helper to sort by priority subcategory
    const getPrioritizedItems = (catId, items) => {
        const catMapping = {
            'mandala': 'Mandala',
            'miniature': 'Miniature',
            'gift': 'Gift Material',
            'diy': 'DIY Art'
        };
        const prioritySub = categoryPriorities[catMapping[catId]];
        if (!prioritySub) return items;

        const prioritized = items.filter(art => art.description?.includes(`[SubCategory: ${prioritySub}]`));
        const others = items.filter(art => !art.description?.includes(`[SubCategory: ${prioritySub}]`));
        return [...prioritized, ...others];
    };

    const applyOrder = (items, category) => {
        const order = artworkOrders[category] || [];
        if (order.length === 0) return null; // Return null to indicate no manual order

        return [...items].sort((a, b) => {
            const indexA = order.indexOf(a.id);
            const indexB = order.indexOf(b.id);

            const posA = indexA === -1 ? -Infinity : indexA;
            const posB = indexB === -1 ? -Infinity : indexB;

            if (posA === posB) {
                return new Date(b.created_at) - new Date(a.created_at);
            }
            return posA - posB;
        });
    };


    const featuredItems = getFeaturedItems();
    const displayFeatured = getDisplayItems(featuredItems, 8, 5); // Threshold of 5 for highlights

    return (
        <section id="gallery" className="section-container relative min-h-screen py-12 bg-ghibli-cream/20 font-gallery">
            <div className="max-w-7xl mx-auto px-4 relative z-10">

                {/* 1. Header */}
                <div className="text-center mb-16 space-y-4">
                    <span className="text-ghibli-wood font-bold tracking-[0.2em] uppercase text-xs">
                        Art  <span className="text-ghibli-wood italic font-serif">&</span> Craft
                    </span>
                    <h2 className="text-4xl md:text-6xl font-bold text-ghibli-charcoal font-serif">
                        An Evolving Collection
                    </h2>
                    <p className="text-ghibli-charcoal/60 max-w-xl mx-auto">
                        Curated artifacts of patience and love. Swipe to explore the highlights, or dive deep into the specific collections below.
                    </p>
                </div>

                {/* 2. Best Work Carousel (Embla) - Dynamic */}
                <div className="mb-24 relative">
                    <div className="flex items-center gap-2 mb-6 opacity-60">
                        <span className="w-8 h-[1px] bg-ghibli-charcoal"></span>
                        <span className="text-xs uppercase tracking-widest font-bold">Featured Highlights</span>
                    </div>

                    {/* Embla Viewport */}
                    <div className="overflow-hidden mb-8 py-10 -my-10" ref={featuredEmblaRef}>
                        <div className="flex gap-6 select-none touch-pan-y items-stretch"> {/* Embla Container */}
                            {displayFeatured.map((work, index) => (
                                <div
                                    key={`${work.id || 'feat'}-${index}`}
                                    onClick={() => !work.isPlaceholder && setSelectedArt(work)}
                                    className={`relative flex-[0_0_280px] sm:flex-[0_0_350px] md:flex-[0_0_420px] aspect-[4/3] rounded-[2rem] overflow-hidden group shadow-lg hover:shadow-2xl transition-all mx-2 bg-white ${work.isPlaceholder ? '' : 'cursor-pointer'}`}
                                >
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-10"></div>

                                    {work.isPlaceholder ? (
                                        <div className="w-full h-full bg-ghibli-paper/40 flex flex-col items-center justify-center gap-3">
                                            <span className="text-4xl opacity-30">✨</span>
                                            <span className="text-xs font-bold tracking-widest opacity-30 uppercase text-ghibli-wood">Coming Soon</span>
                                        </div>
                                    ) : (
                                        (!work.image_url || work.image_url.trim() === '') ? (
                                            <div className="w-full h-full bg-ghibli-paper/20 flex items-center justify-center">
                                                <span className="text-2xl opacity-20">🎨</span>
                                            </div>
                                        ) : (
                                            <img
                                                src={work.image_url}
                                                alt={work.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        )
                                    )}

                                    {!work.isPlaceholder && work.title && (
                                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <h3 className="text-white font-serif font-bold text-lg">{work.title}</h3>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-end items-center gap-4 px-2">
                        <button
                            onClick={scrollPrev}
                            className="w-10 h-10 rounded-full border border-ghibli-wood/20 bg-white shadow-sm flex items-center justify-center text-ghibli-wood hover:bg-ghibli-paper transition-all group active:scale-95"
                            aria-label="Previous Highlight"
                        >
                            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                        </button>
                        <button
                            onClick={scrollNext}
                            className="w-10 h-10 rounded-full border border-ghibli-wood/20 bg-white shadow-sm flex items-center justify-center text-ghibli-wood hover:bg-ghibli-paper transition-all group active:scale-95"
                            aria-label="Next Highlight"
                        >
                            <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </div>

                {/* 3. Category Sections - Embla Carousels */}
                <div className="space-y-20">
                    {MAIN_CATEGORIES.map((cat) => {
                        const rawItems = getCategoryItems(cat.id);

                        const catMapping = {
                            'mandala': 'Mandala',
                            'miniature': 'Miniature',
                            'gift': 'Gift Material',
                            'diy': 'DIY Art'
                        };
                        const orderKey = catMapping[cat.id];

                        // 1. Apply Manual Order (if existent), otherwise keeps default (Date desc)
                        let sortedItems = applyOrder(rawItems, orderKey);
                        if (!sortedItems) {
                            sortedItems = rawItems;
                        }

                        // 2. Apply Priority Subcategory Grouping (on top of the sorted items)
                        // This moves prioritized items to the front, preserving their relative manual/date order.
                        const finalItems = getPrioritizedItems(cat.id, sortedItems);

                        const displayItems = getDisplayItems(finalItems, 8, 5); // Threshold of 5 for categories

                        return (
                            <CategorySlider
                                key={cat.id}
                                cat={cat}
                                items={displayItems}
                                isEmpty={rawItems.length === 0}
                                onCardClick={(item) => setSelectedArt({ ...item, category: cat.id })}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Modal - STUDIO STYLE (Imported from FullGallery) */}
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
                            <div className="w-full md:w-[55%] bg-ghibli-paper/10 relative flex items-center justify-center p-6 md:p-8 hidden md:flex">
                                <div className="relative w-full h-full shadow-2xl rounded-lg overflow-hidden max-h-[70vh]">
                                    {(!selectedArt.image_url || selectedArt.image_url.trim() === '') ? (
                                        <div className="w-full h-full bg-white flex items-center justify-center">
                                            <span className="text-6xl opacity-20">✨</span>
                                        </div>
                                    ) : (
                                        <img src={selectedArt.image_url} alt={selectedArt.title} className="w-full h-full object-contain" />
                                    )}
                                </div>
                            </div>

                            {/* Mobile Image (Full Visibility) */}
                            <div className="w-full h-[45vh] md:hidden bg-ghibli-paper/10 relative flex items-center justify-center overflow-hidden p-4">
                                {(!selectedArt.image_url || selectedArt.image_url.trim() === '') ? (
                                    <div className="w-full h-full bg-white flex items-center justify-center">
                                        <span className="text-4xl opacity-20">✨</span>
                                    </div>
                                ) : (
                                    <img src={selectedArt.image_url} alt={selectedArt.title} className="w-full h-full object-contain" />
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
                                        {selectedArt.category?.toUpperCase() || 'COLLECTION'}
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
        </section >
    );
};

// Sub-component for Category Slider
const CategorySlider = ({ cat, items, isEmpty, onCardClick }) => {
    const [emblaRef] = useEmblaCarousel({
        align: 'start',
        containScroll: 'trimSnaps',
        dragFree: true
    });

    return (
        <div className="animate-fade-in-up">
            {/* Section Header ... (keep existing) */}
            <div className="flex items-end justify-between mb-8 px-2">
                <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-ghibli-charcoal font-serif mb-2">
                        {cat.label}
                    </h3>
                    <span className="text-xs font-bold tracking-widest text-ghibli-wood/40 uppercase">
                        ({isEmpty ? 0 : items.filter(i => !i.isPlaceholder).length} Pieces)
                    </span>
                </div>
                <Link
                    to={`/gallery/${cat.id}`}
                    className="text-ghibli-wood/80 font-bold text-xs uppercase tracking-widest hover:text-ghibli-wood transition-colors group flex items-center gap-2"
                >
                    See All
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
            </div>

            {/* Embla Viewport */}
            <div className="overflow-hidden -mx-4 px-4 py-8 -my-8" ref={emblaRef}>
                <div className="flex gap-4 select-none touch-pan-y items-stretch">
                    {items.map((item, index) => (
                        <div
                            key={`${item.id || 'cat'}-${index}`}
                            onClick={() => !item.isPlaceholder && onCardClick(item)}
                            className={`flex-[0_0_200px] sm:flex-[0_0_240px] rounded-[1.5rem] flex flex-col group ${item.isPlaceholder ? '' : 'cursor-pointer'}`}
                        >
                            {/* Card Image Area */}
                            <div className="aspect-[4/5] bg-ghibli-paper/40 rounded-[1.5rem] mb-3 flex items-center justify-center relative overflow-hidden transition-transform duration-500 group-hover:-translate-y-1">
                                {item.isPlaceholder ? (
                                    <div className="flex flex-col items-center gap-2 opacity-20">
                                        <span className="text-3xl">🎨</span>
                                        <span className="text-[9px] font-bold tracking-widest uppercase">In Progress</span>
                                    </div>
                                ) : (
                                    (item && item.image_url) ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 opacity-20">
                                            <span className="text-3xl">🎨</span>
                                            <span className="text-[9px] font-bold tracking-widest uppercase">In Progress</span>
                                        </div>
                                    )
                                )}
                            </div>

                            {/* Card Footer - Minimal */}
                            <div className="px-1">
                                {(item.isPlaceholder || item.title) && (
                                    <h4 className={`font-bold text-sm font-serif truncate transition-colors ${item.isPlaceholder ? 'text-ghibli-charcoal/20' : 'text-ghibli-charcoal/70 group-hover:text-ghibli-charcoal'}`}>
                                        {item.isPlaceholder ? 'Gallery Slot' : item.title}
                                    </h4>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ArtGallery;
