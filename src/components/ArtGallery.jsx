import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { FALLBACK_CATEGORIES } from '../constants/categories';
import { isGalleryListing } from '../lib/categoryUtils';
import { fetchSiteSetting } from '../lib/fetchSettings';
import { useArtworksCatalog } from '../hooks/useArtworksCatalog';
import GalleryPageSkeleton from './skeletons/GalleryPageSkeleton';
import ScrollRevealItem from './ScrollRevealItem';

const FALLBACK_CATEGORIES_LOCAL = FALLBACK_CATEGORIES;

const ArtGallery = () => {
    const { artworks: catalog, loading } = useArtworksCatalog();
    const artworks = catalog.filter(isGalleryListing);
    const [selectedArt, setSelectedArt] = useState(null);
    const [categoryPriorities, setCategoryPriorities] = useState({});
    const [artworkOrders, setArtworkOrders] = useState({});
    const [categories, setCategories] = useState(FALLBACK_CATEGORIES_LOCAL);

    useEffect(() => {
        fetchCategories();
        fetchShowcaseSettings();
    }, []);

    const fetchCategories = async () => {
        const catValue = await fetchSiteSetting('category_definitions', null);
        if (catValue?.length) setCategories(catValue);
    };

    const fetchShowcaseSettings = async () => {
        const priorities = await fetchSiteSetting('category_priorities', {});
        setCategoryPriorities(priorities || {});
        const orders = await fetchSiteSetting('artwork_orders', {});
        setArtworkOrders(orders || {});
    };


    const getCategoryItems = (catLabel) => {
        const catDef = categories.find(c => c.label === catLabel);
        return artworks.filter(art => {
            const artCat = art.category?.trim().toLowerCase();
            const matches = artCat === catLabel?.trim().toLowerCase() || (catDef && artCat === catDef.id?.trim().toLowerCase());
            return matches &&
                !art.category?.toLowerCase().includes('upcoming') &&
                !art.description?.includes('[FEATURED]') &&
                !art.title?.includes('[FEATURED]');
        });
    };

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
        if (result.length < minThreshold) {
            const placeholdersNeeded = Math.max(0, placeholderCount - result.length);
            for (let i = 0; i < placeholdersNeeded; i++) {
                result.push({ id: `placeholder-${i}`, isPlaceholder: true });
            }
        }
        return result;
    };

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
        if (order.length === 0) return null;

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
    let displayFeatured = getDisplayItems(featuredItems, 8, 5);

    if (displayFeatured.length > 0 && displayFeatured.length < 6) {
        displayFeatured = [...displayFeatured, ...displayFeatured];
    }

    if (loading) {
        return <GalleryPageSkeleton />;
    }

    return (
        <section id="gallery" className="relative bg-[#FDFBF7] text-ghibli-charcoal font-gallery overflow-hidden w-full min-h-screen pb-20 sm:pb-32">
            
            {/* HERO SECTION - LIGHT MUSEUM */}
            <div className="relative w-full pt-28 sm:pt-40 pb-16 sm:pb-24 md:pb-32 flex flex-col items-center text-center px-4 sm:px-6 md:px-12 z-10 overflow-hidden">
                {/* Subtle light glowing orbs for museum ambiance */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-white rounded-full blur-[150px] opacity-60"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-[#F4EBE1] rounded-full blur-[150px] opacity-40"></div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 max-w-4xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-white border border-ghibli-wood/10 text-ghibli-wood text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-6 sm:mb-8 shadow-sm">
                            The Grand Exhibition <span className="w-1.5 h-1.5 rounded-full bg-ghibli-wood animate-pulse"></span>
                        </span>
                    </motion.div>
                    
                    <motion.h1 
                        className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-serif tracking-tighter mb-6 sm:mb-8 leading-tight text-ghibli-charcoal drop-shadow-sm flex flex-wrap justify-center gap-x-3 sm:gap-x-4 md:gap-x-6"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.15, delayChildren: 0.4 }
                            }
                        }}
                    >
                        {['Masterpieces', 'in', 'Motion'].map((word, i) => (
                            <motion.span 
                                key={i}
                                variants={{
                                    hidden: { opacity: 0, y: 40, rotateX: -20 },
                                    visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                                }}
                                className="inline-block origin-bottom"
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="text-ghibli-charcoal/60 max-w-2xl mx-auto text-base sm:text-lg md:text-2xl font-light leading-relaxed px-4 sm:px-0"
                    >
                        Step into a curated sanctuary of devotion and detail. Explore the pinnacle of handmade craftsmanship.
                    </motion.p>
                </motion.div>
            </div>

            <div className="w-full relative z-10 border-t border-ghibli-wood/10 pt-20">

                {/* 2. Best Work Carousel (Embla) — Light Mode Coverflow */}
                <div className="mb-20 sm:mb-32 relative w-full">
                    <div className="px-4 sm:px-5 md:px-10 lg:px-14 flex items-center justify-between mb-6 sm:mb-8 max-w-[1600px] mx-auto">
                        <div className="flex items-center gap-4 opacity-80">
                            <span className="w-8 sm:w-12 h-[2px] bg-ghibli-wood/40"></span>
                            <span className="text-xs sm:text-sm md:text-base uppercase tracking-[0.2em] sm:tracking-[0.3em] font-black text-ghibli-charcoal/60">Featured</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                className="swiper-button-prev-custom w-12 h-12 rounded-full border border-ghibli-wood/10 bg-white shadow-sm flex items-center justify-center text-ghibli-charcoal/60 hover:bg-ghibli-cream hover:text-ghibli-charcoal transition-all group active:scale-95 cursor-pointer"
                                aria-label="Previous Highlight"
                            >
                                <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                            </button>
                            <button
                                className="swiper-button-next-custom w-12 h-12 rounded-full border border-ghibli-wood/10 bg-white shadow-sm flex items-center justify-center text-ghibli-charcoal/60 hover:bg-ghibli-cream hover:text-ghibli-charcoal transition-all group active:scale-95 cursor-pointer"
                                aria-label="Next Highlight"
                            >
                                <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                    </div>

                    {/* Right-edge fade for light mode */}
                    <div
                        className="absolute right-0 top-16 bottom-0 w-20 sm:w-36 md:w-56 z-20 pointer-events-none"
                        style={{ background: 'linear-gradient(to left, #FDFBF7 10%, rgba(253,251,247,0) 100%)' }}
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
                        className="w-full py-12 pl-5 md:pl-10 lg:pl-14 pr-0 max-w-[1600px] mx-auto"
                    >
                        {displayFeatured.map((work, index) => (
                            <SwiperSlide 
                                key={`${work.id || 'feat'}-${index}`}
                                className="aspect-[4/5] rounded-[32px] overflow-hidden bg-white shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] transition-all cursor-pointer group"
                                onClick={() => !work.isPlaceholder && setSelectedArt(work)}
                            >
                                <div className="absolute inset-0 bg-black/5 hover:bg-black/0 transition-colors duration-500 z-10 pointer-events-none"></div>
                                {work.isPlaceholder ? (
                                    <div className="w-full h-full bg-ghibli-cream flex flex-col items-center justify-center gap-3">
                                        <span className="text-5xl opacity-20 drop-shadow-md">✨</span>
                                        <span className="text-xs font-bold tracking-[0.2em] opacity-40 uppercase text-ghibli-charcoal">Enigmatic Piece</span>
                                    </div>
                                ) : (
                                    (!work.image_url || work.image_url.trim() === '') ? (
                                        <div className="w-full h-full bg-ghibli-cream flex items-center justify-center">
                                            <span className="text-4xl opacity-20">🎨</span>
                                        </div>
                                    ) : (
                                        <img
                                            src={work.image_url}
                                            alt={work.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                    )
                                )}

                                {!work.isPlaceholder && work.title && (
                                    <div className="absolute bottom-0 left-0 right-0 p-8 pt-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="text-white font-serif font-black text-xl md:text-2xl drop-shadow-lg leading-tight mb-1">{work.title}</h3>
                                        <span className="text-white/80 text-[10px] uppercase tracking-widest font-bold drop-shadow-sm">Featured Artwork</span>
                                    </div>
                                )}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* 3. Category Sections - Light Mode Carousels */}
                <div className="space-y-24 w-full pb-20 max-w-[1600px] mx-auto">
                    {categories.map((cat) => {
                        const rawItems = getCategoryItems(cat.label);
                        const orderKey = cat.label;

                        let sortedItems = applyOrder(rawItems, orderKey);
                        if (!sortedItems) sortedItems = rawItems;

                        const finalItems = getPrioritizedItems(cat.id, sortedItems);
                        const displayItems = getDisplayItems(finalItems, 4, 4);

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

            {/* Modal - LIGHT STUDIO STYLE */}
            <AnimatePresence>
                {selectedArt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedArt(null)}
                        className="fixed inset-0 z-[200] bg-ghibli-charcoal/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-[#FDFBF7] rounded-[2.5rem] overflow-hidden max-w-6xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedArt(null)}
                                className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-ghibli-charcoal/60 hover:text-ghibli-charcoal transition-all font-bold backdrop-blur-md"
                            >✕</button>

                            {/* Image Section */}
                            <div className="w-full md:w-[55%] bg-ghibli-cream relative flex items-center justify-center p-6 md:p-12 hidden md:flex border-r border-ghibli-wood/10">
                                <div className="relative w-full h-full shadow-2xl rounded-2xl overflow-hidden max-h-[75vh]">
                                    {(!selectedArt.image_url || selectedArt.image_url.trim() === '') ? (
                                        <div className="w-full h-full bg-white flex items-center justify-center">
                                            <span className="text-6xl opacity-20">✨</span>
                                        </div>
                                    ) : (
                                        <img src={selectedArt.image_url} alt={selectedArt.title} className="w-full h-full object-contain drop-shadow-2xl" />
                                    )}
                                </div>
                            </div>

                            {/* Mobile Image (Full Visibility) */}
                            <div className="w-full h-[45vh] md:hidden bg-ghibli-cream relative flex items-center justify-center overflow-hidden p-6 border-b border-ghibli-wood/10">
                                {(!selectedArt.image_url || selectedArt.image_url.trim() === '') ? (
                                    <div className="w-full h-full bg-white flex items-center justify-center">
                                        <span className="text-4xl opacity-20">✨</span>
                                    </div>
                                ) : (
                                    <img src={selectedArt.image_url} alt={selectedArt.title} className="w-full h-full object-contain drop-shadow-2xl" />
                                )}
                            </div>

                            {/* Details Section */}
                            <div className="w-full md:w-[45%] p-8 md:p-12 flex flex-col justify-center bg-white relative overflow-y-auto">
                                {/* 1. TITLE */}
                                {selectedArt.title && (
                                    <h3 className="text-4xl md:text-5xl font-black font-serif text-ghibli-charcoal mb-6 leading-tight drop-shadow-sm">
                                        {selectedArt.title}
                                    </h3>
                                )}

                                {/* 2. NAME (Category + Subcategory) */}
                                <div className="flex items-center gap-3 mb-8">
                                    <span className="text-ghibli-wood font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs bg-ghibli-cream border border-ghibli-wood/20 px-4 py-1.5 rounded-full shadow-sm">
                                        {selectedArt.category?.toUpperCase() || 'COLLECTION'}
                                    </span>
                                    {selectedArt.description?.includes('[SubCategory:') && (
                                        <span className="text-ghibli-charcoal/40 font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs">
                                            • {selectedArt.description.match(/\[SubCategory:\s*(.*?)\]/)?.[1] || ''}
                                        </span>
                                    )}
                                </div>

                                {/* 3. STORY */}
                                {selectedArt.description && selectedArt.description.replace(/\[FEATURED\]/g, '').replace(/\[SubCategory:.*?\]/g, '').trim() && (
                                    <div className="prose prose-sm md:prose-base text-ghibli-charcoal/70 leading-loose mb-12 font-sans">
                                        <span className="text-[10px] font-bold tracking-widest uppercase opacity-30 block mb-3 text-ghibli-charcoal">The Legend</span>
                                        <p className="font-light text-lg">
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
                                    className="px-10 py-5 bg-ghibli-charcoal text-white rounded-full font-black tracking-[0.2em] text-xs uppercase hover:bg-ghibli-wood hover:scale-105 transition-all self-start shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] active:translate-y-0 text-center w-full md:w-auto"
                                >
                                    Acquire Piece
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
            <div className="px-5 md:px-10 lg:px-14 w-full flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 border-b border-ghibli-wood/10 pb-4">
                <div>
                    <h3 className="text-3xl md:text-4xl font-black text-ghibli-charcoal font-serif mb-2 tracking-tight drop-shadow-sm">
                        {cat.label}
                    </h3>
                    <span className="text-xs font-bold tracking-widest text-ghibli-charcoal/30 uppercase">
                        ({isEmpty ? 0 : items.filter(i => !i.isPlaceholder).length} Pieces Available)
                    </span>
                </div>
                <Link
                    to={`/gallery/${cat.id}`}
                    className="px-5 py-2.5 sm:px-6 rounded-full bg-white hover:bg-ghibli-cream border border-ghibli-wood/10 text-ghibli-charcoal font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-sm group self-start sm:self-auto"
                >
                    Explore All
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
            </div>

            {/* Carousel wrapper */}
            <div className="relative">
                {/* Right-edge light gradient */}
                <div
                    className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 md:w-48 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to left, #FDFBF7 10%, rgba(253,251,247,0) 100%)' }}
                />

                {/* Embla Viewport */}
                    <div className="overflow-hidden py-12 -my-12 pl-5 md:pl-10 lg:pl-14" ref={emblaRef}>
                    <div className="flex gap-6 md:gap-8 select-none touch-pan-y items-start">
                        {items.map((item, index) => (
                            <ScrollRevealItem
                                key={`${item.id || 'cat'}-${index}`}
                                index={index}
                                amount={0.18}
                                delayStep={0.06}
                                duration={0.9}
                                y={20}
                                scale={0.986}
                                className={`flex-[0_0_72vw] sm:flex-[0_0_280px] md:flex-[0_0_320px] flex flex-col group ${item.isPlaceholder ? '' : 'cursor-pointer'}`}
                            >
                                <div onClick={() => !item.isPlaceholder && onCardClick(item)} className="flex flex-col h-full">
                                {/* Card Image */}
                                <div className={`aspect-[4/5] rounded-[32px] mb-4 relative overflow-hidden transition-all duration-700 ${
                                    item.isPlaceholder
                                        ? 'bg-white border border-dashed border-ghibli-wood/20 shadow-sm'
                                        : 'bg-white shadow-[0_15px_40px_rgba(0,0,0,0.06)] group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] group-hover:-translate-y-3'
                                }`}>
                                    {item.isPlaceholder ? (
                                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 opacity-30">
                                            <div className="w-12 h-12 rounded-full border border-ghibli-wood/30 flex items-center justify-center">
                                                <span className="text-sm text-ghibli-wood leading-none">✦</span>
                                            </div>
                                        </div>
                                    ) : (
                                        (item && item.image_url) ? (
                                            <>
                                                <img
                                                    src={item.image_url}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                                            </>
                                        ) : (
                                            <div className="w-full h-full bg-ghibli-cream flex flex-col items-center justify-center gap-2 opacity-30">
                                                <div className="w-12 h-12 rounded-full border border-ghibli-wood/30 flex items-center justify-center">
                                                    <span className="text-sm text-ghibli-wood leading-none">✦</span>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>

                                {/* Card title */}
                                {!item.isPlaceholder && item.title && (
                                    <div className="px-2">
                                        <h4 className="font-bold text-lg font-serif text-ghibli-charcoal/70 group-hover:text-ghibli-wood transition-colors duration-300">
                                            {item.title}
                                        </h4>
                                    </div>
                                )}
                                </div>
                            </ScrollRevealItem>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtGallery;
