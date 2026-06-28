import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

import { supabase } from '../lib/supabaseClient';

// --- Constants ---
// Default Categories Data - Used for initial setup if DB is empty
const FALLBACK_CATEGORIES = [
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
    const [categories, setCategories] = useState(FALLBACK_CATEGORIES);

    useEffect(() => {
        fetchCategories();
        fetchArtworks();
        fetchShowcaseSettings();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/settings?id=category_definitions');
            if (res.ok) {
                const data = await res.json();
                if (data.value && Array.isArray(data.value) && data.value.length > 0) {
                    setCategories(data.value);
                }
            }
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

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
    const getCategoryItems = (catLabel) => {
        const catDef = categories.find(c => c.label === catLabel);
        return artworks.filter(art => {
            const artCat = art.category?.trim().toLowerCase();
            const matches = artCat === catLabel?.trim().toLowerCase() || (catDef && artCat === catDef.id?.trim().toLowerCase());
            return matches &&
                !art.category?.toLowerCase().includes('upcoming') &&
                !art.description?.includes('[FEATURED]') &&
                !art.title?.includes('[FEATURED]')
        });
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
        const cat = categories.find(c => c.id === catId);
        if (!cat) return items;

        const prioritySub = categoryPriorities[cat.label];
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
    let displayFeatured = getDisplayItems(featuredItems, 8, 5); // Threshold of 5 for highlights
    
    // GUARANTEE INFINITE LOOP:
    // Embla requires total slide width > viewport width to loop. 
    // If there are only 5 slides, it might stop looping on ultra-wide monitors.
    // We duplicate the array if there are fewer than 10 items to ensure it acts as an infinite wheel.
    if (displayFeatured.length > 0 && displayFeatured.length < 10) {
        displayFeatured = [...displayFeatured, ...displayFeatured, ...displayFeatured].slice(0, 15);
    }

    return (
        <section id="gallery" className="relative py-24 md:py-32 bg-ghibli-cream/20 font-gallery overflow-hidden w-full scroll-mt-24">
            <div className="w-full relative z-10">

                {/* 1. Header — Creonnect centered alignment */}
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-16 space-y-4">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ghibli-wood/10 border border-ghibli-wood/20 text-ghibli-wood text-xs font-bold tracking-widest uppercase">
                        Art  <span className="text-ghibli-wood italic font-serif">&</span> Craft
                    </span>
                    <h2 className="text-4xl md:text-6xl font-extrabold text-ghibli-charcoal font-serif tracking-tight">
                        An Evolving Collection
                    </h2>
                    <p className="text-ghibli-charcoal/60 max-w-3xl text-lg leading-relaxed">
                        Curated artifacts of patience and love. Swipe to explore the highlights, or dive deep into the specific collections below.
                    </p>
                </div>

                {/* 2. Best Work Carousel (Embla) — Center Focus Coverflow */}
                <div className="mb-24 relative w-full">
                    <div className="px-5 md:px-10 lg:px-14 flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 opacity-60">
                            <span className="w-8 h-[1px] bg-ghibli-charcoal"></span>
                            <span className="text-xs uppercase tracking-widest font-bold">Featured Highlights</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                className="swiper-button-prev-custom w-10 h-10 rounded-full border border-ghibli-wood/20 bg-white shadow-sm flex items-center justify-center text-ghibli-wood hover:bg-ghibli-paper transition-all group active:scale-95 cursor-pointer"
                                aria-label="Previous Highlight"
                            >
                                <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                            </button>
                            <button
                                className="swiper-button-next-custom w-10 h-10 rounded-full border border-ghibli-wood/20 bg-white shadow-sm flex items-center justify-center text-ghibli-wood hover:bg-ghibli-paper transition-all group active:scale-95 cursor-pointer"
                                aria-label="Next Highlight"
                            >
                                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                    </div>

                    {/* Right-edge fade — blurs last slide into the page background */}
                    <div
                        className="absolute right-0 top-16 bottom-0 w-20 sm:w-36 md:w-56 z-20 pointer-events-none"
                        style={{ background: 'linear-gradient(to left, #FFFDF5 15%, rgba(255,253,245,0) 100%)' }}
                    />

                    {/* Swiper Viewport */}
                    <Swiper
                        key={displayFeatured.length}
                        grabCursor={true}
                        centeredSlides={false}
                        loop={true}
                        observer={true}
                        observeParents={true}
                        breakpoints={{
                            320: { slidesPerView: 1.2, spaceBetween: 16 },
                            640: { slidesPerView: 2.2, spaceBetween: 24 },
                            1024: { slidesPerView: 4, spaceBetween: 32 }
                        }}
                        navigation={{
                            nextEl: '.swiper-button-next-custom',
                            prevEl: '.swiper-button-prev-custom',
                        }}
                        modules={[Navigation, Autoplay]}
                        className="w-full py-8 pl-5 md:pl-10 lg:pl-14 pr-0"
                    >
                        {displayFeatured.map((work, index) => (
                            <SwiperSlide 
                                key={`${work.id || 'feat'}-${index}`}
                                className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-white shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                onClick={() => !work.isPlaceholder && setSelectedArt(work)}
                            >
                                <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors duration-300 z-10 pointer-events-none"></div>
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
                                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                        />
                                    )
                                )}

                                {!work.isPlaceholder && work.title && (
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
                                        <h3 className="text-white font-serif font-bold text-lg md:text-xl drop-shadow-md">{work.title}</h3>
                                    </div>
                                )}
                            </SwiperSlide>
                        ))}
                    </Swiper>


                </div>

                {/* 3. Category Sections - Embla Carousels */}
                <div className="space-y-20 w-full pb-20">
                    {categories.map((cat) => {
                        const rawItems = getCategoryItems(cat.label);

                        const orderKey = cat.label;

                        // 1. Apply Manual Order (if existent), otherwise keeps default (Date desc)
                        let sortedItems = applyOrder(rawItems, orderKey);
                        if (!sortedItems) {
                            sortedItems = rawItems;
                        }

                        // 2. Apply Priority Subcategory Grouping (on top of the sorted items)
                        // This moves prioritized items to the front, preserving their relative manual/date order.
                        const finalItems = getPrioritizedItems(cat.id, sortedItems);

                        const displayItems = getDisplayItems(finalItems, 4, 4); // Show max 4 placeholder slots

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
    }, [WheelGesturesPlugin()]);

    return (
        <div className="animate-fade-in-up">
            {/* Section Header */}
            <div className="px-5 md:px-10 lg:px-14 w-full flex flex-row items-end justify-between mb-7">
                <div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-ghibli-charcoal font-serif mb-1 tracking-tight">
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

            {/* Carousel wrapper */}
            <div className="relative">
                {/* Right-edge gradient — last card dissolves into the page */}
                <div
                    className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 md:w-48 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to left, #FFFDF5 15%, rgba(255,253,245,0) 100%)' }}
                />

                {/* Embla Viewport */}
                <div className="overflow-hidden py-8 -my-8 pl-5 md:pl-10 lg:pl-14" ref={emblaRef}>
                    <div className="flex gap-4 md:gap-5 select-none touch-pan-y items-start">
                        {items.map((item, index) => (
                            <div
                                key={`${item.id || 'cat'}-${index}`}
                                onClick={() => !item.isPlaceholder && onCardClick(item)}
                                className={`flex-[0_0_175px] sm:flex-[0_0_210px] md:flex-[0_0_240px] flex flex-col group ${item.isPlaceholder ? '' : 'cursor-pointer'}`}
                            >
                                {/* Card Image */}
                                <div className={`aspect-[3/4] rounded-2xl mb-3 relative overflow-hidden transition-all duration-500 ${
                                    item.isPlaceholder
                                        ? 'bg-ghibli-paper/25 border border-dashed border-ghibli-wood/15'
                                        : 'bg-ghibli-paper/40 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-2 group-hover:shadow-black/10'
                                }`}>
                                    {item.isPlaceholder ? (
                                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 opacity-20">
                                            <div className="w-9 h-9 rounded-full border border-ghibli-wood/60 flex items-center justify-center">
                                                <span className="text-xs text-ghibli-wood leading-none">✦</span>
                                            </div>
                                        </div>
                                    ) : (
                                        (item && item.image_url) ? (
                                            <>
                                                <img
                                                    src={item.image_url}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                {/* Hover reveal gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </>
                                        ) : (
                                            <div className="w-full h-full bg-ghibli-paper/40 flex flex-col items-center justify-center gap-2 opacity-20">
                                                <div className="w-9 h-9 rounded-full border border-ghibli-wood/60 flex items-center justify-center">
                                                    <span className="text-xs text-ghibli-wood leading-none">✦</span>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>

                                {/* Card title — real artworks only */}
                                {!item.isPlaceholder && item.title && (
                                    <div className="px-0.5">
                                        <h4 className="font-semibold text-sm font-serif truncate text-ghibli-charcoal/60 group-hover:text-ghibli-charcoal transition-colors duration-200">
                                            {item.title}
                                        </h4>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtGallery;
