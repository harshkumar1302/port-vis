import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { FALLBACK_CATEGORIES } from '../constants/categories';
import { getSubCategory, formatPrice, getDiscountPct } from '../lib/artwork';
import { isGalleryListing, artMatchesCategory, artMatchesSubCategory } from '../lib/categoryUtils';
import WhatsAppButton from './WhatsAppButton';
import ArtworkImage from './ArtworkImage';
import { fetchSiteSetting } from '../lib/fetchSettings';
import useSiteSetting from '../hooks/useSiteSettings';
import { buildWhatsAppUrl, DEFAULT_CHANNELS } from '../lib/enquire';
import { useArtworksCatalog } from '../hooks/useArtworksCatalog';
import FullGalleryPageSkeleton from './skeletons/FullGalleryPageSkeleton';
import ScrollRevealItem from './ScrollRevealItem';

const FALLBACK_CATEGORIES_LOCAL = FALLBACK_CATEGORIES;

const FullGallery = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const { artworks: catalog, loading } = useArtworksCatalog();
    const { value: channels } = useSiteSetting('contact_channels', DEFAULT_CHANNELS);
    const artworks = catalog.filter(isGalleryListing);
    const [selectedSubCategory, setSelectedSubCategory] = useState('All');
    const [selectedArt, setSelectedArt] = useState(null);
    const [categoryPriorities, setCategoryPriorities] = useState({});
    const [artworkOrders, setArtworkOrders] = useState({});
    const [categories, setCategories] = useState(FALLBACK_CATEGORIES_LOCAL);

    const currentCategory = categories.find(c => c.id === category);

    useEffect(() => {
        fetchSettings();
        window.scrollTo(0, 0);
    }, [category]);

    useEffect(() => {
        if (!currentCategory) {
            navigate('/gallery');
        }
    }, [currentCategory, navigate]);

    const fetchSettings = async () => {
        const catValue = await fetchSiteSetting('category_definitions', null);
        if (catValue?.length) setCategories(catValue);

        const priorities = await fetchSiteSetting('category_priorities', {});
        setCategoryPriorities(priorities || {});

        const orders = await fetchSiteSetting('artwork_orders', {});
        setArtworkOrders(orders || {});
    };


    const filteredArtworks = artworks.filter(art => {
        if (!category || !currentCategory) return false;
        if (!artMatchesCategory(art, category, categories)) return false;
        if (selectedSubCategory !== 'All' && !artMatchesSubCategory(art, selectedSubCategory)) {
            return false;
        }
        return true;
    });

    const getPrioritizedItems = (catId, items) => {
        const cat = categories.find(c => c.id === catId);
        if (!cat) return items;

        const prioritySub = categoryPriorities[cat.label];
        if (!prioritySub) return items;

        const prioritized = items.filter(art => art.description?.includes(`[SubCategory: ${prioritySub}]`));
        const others = items.filter(art => !art.description?.includes(`[SubCategory: ${prioritySub}]`));
        return [...prioritized, ...others];
    };

    const applyOrder = (items, categoryId) => {
        const cat = categories.find(c => c.id === categoryId);
        if (!cat) return items;
        const orderKey = cat.label;
        const order = artworkOrders[orderKey] || [];
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

    let displayArtworks = [...filteredArtworks];

    const manualSorted = applyOrder(displayArtworks, category);
    if (manualSorted) {
        displayArtworks = manualSorted;
    }

    if (selectedSubCategory === 'All') {
        displayArtworks = getPrioritizedItems(category, displayArtworks);
    }

    if (loading) {
        return <FullGalleryPageSkeleton categoryLabel={currentCategory?.label} />;
    }

    if (!currentCategory) return null;

    return (
        <div className="min-h-screen bg-[#FBF8EC] text-ghibli-charcoal pt-24 sm:pt-32 pb-20 sm:pb-32">
            <div className="page-container max-w-[1400px]">
                
                {/* Back Navigation */}
                <Link
                    to="/gallery"
                    className="px-4 sm:px-6 py-2 rounded-full bg-white hover:bg-ghibli-cream border border-ghibli-wood/10 text-ghibli-charcoal/60 hover:text-ghibli-charcoal font-bold text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase flex items-center gap-2 sm:gap-3 mb-10 sm:mb-16 transition-all group w-fit shadow-sm"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    <span className="hidden sm:inline">Return to Grand Exhibition</span>
                    <span className="sm:hidden">Back to Gallery</span>
                </Link>

                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-10 sm:mb-16"
                >
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 0.7, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-4 mb-4"
                    >
                        <span className="w-8 h-[1px] bg-ghibli-wood"></span>
                        <span className="text-xs uppercase tracking-[0.3em] font-black text-ghibli-wood">Curated Collection</span>
                    </motion.div>
                    
                    <motion.h1 
                        className="text-3xl sm:text-5xl md:text-7xl font-black text-ghibli-charcoal font-serif tracking-tighter drop-shadow-sm mb-4 sm:mb-6 flex flex-wrap gap-x-2 sm:gap-x-3 md:gap-x-4"
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
                        {currentCategory.label.split(' ').map((word, i) => (
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
                        className="text-ghibli-charcoal/60 max-w-2xl text-base sm:text-lg md:text-xl font-light leading-relaxed"
                    >
                        A breathtaking selection of {currentCategory.label.toLowerCase()} pieces, each telling a profound story of patience and perfection.
                    </motion.p>
                </motion.div>

                {/* Sticky Floating Sub-Category Tabs (Glassmorphism Light) */}
                <div className="sticky sticky-below-header-padded z-40 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-10 md:px-10 py-4 sm:py-6 mb-10 sm:mb-16 pointer-events-none">
                    <div className="flex overflow-x-auto gap-2 sm:gap-3 no-scrollbar w-full pointer-events-auto bg-white/70 backdrop-blur-xl border border-ghibli-wood/10 p-2 sm:p-3 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.06)]">
                        {['All', ...(currentCategory?.subCategories || [])].map((sub) => (
                            <button
                                key={sub}
                                onClick={() => setSelectedSubCategory(sub)}
                                className={`px-4 sm:px-8 py-2.5 sm:py-3 rounded-full text-[10px] sm:text-xs font-black tracking-[0.12em] sm:tracking-[0.15em] uppercase whitespace-nowrap transition-all duration-300 min-h-[44px] ${selectedSubCategory === sub
                                    ? 'bg-ghibli-charcoal text-white shadow-md'
                                    : 'bg-transparent text-ghibli-charcoal/50 hover:bg-ghibli-cream hover:text-ghibli-charcoal'
                                    }`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 md:gap-8 min-h-[50vh]">
                    {displayArtworks.length > 0 ? (
                        displayArtworks.map((art, index) => (
                            index >= 8 ? (
                                <div key={art.id} className="h-full">
                                    <div
                                        onClick={() => setSelectedArt(art)}
                                        className="group cursor-pointer bg-white rounded-2xl sm:rounded-[32px] p-2 sm:p-4 shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] transition-all duration-300 border border-ghibli-wood/5 flex flex-col relative overflow-hidden h-full"
                                    >
                                        <div className="bg-ghibli-paper/20 rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-6">
                                            <div className="w-full aspect-[4/5] relative">
                                                <ArtworkImage src={art.image_url} alt={art.title} size="card" objectFit="object-contain" className="absolute inset-0" imgClassName="p-4" />
                                            </div>
                                        </div>
                                        {art.title && (
                                            <div className="px-1 sm:px-2 pb-1 sm:pb-2">
                                                <h4 className="font-bold text-ghibli-charcoal text-sm sm:text-lg font-serif line-clamp-2">{art.title}</h4>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                            <ScrollRevealItem
                                key={art.id}
                                index={index}
                                amount={0.18}
                                delayStep={0.05}
                                duration={0.55}
                                y={16}
                                scale={0.99}
                                className="h-full"
                            >
                                <div
                                    onClick={() => setSelectedArt(art)}
                                    className="group cursor-pointer bg-white rounded-2xl sm:rounded-[32px] p-2 sm:p-4 shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] transition-all duration-700 border border-ghibli-wood/5 flex flex-col hover:-translate-y-2 relative overflow-hidden h-full"
                                >
                                    {/* Subtle hover glow in background */}
                                    <div className="absolute inset-0 bg-ghibli-cream/0 group-hover:bg-ghibli-cream/50 transition-colors duration-500 z-0 rounded-2xl sm:rounded-[32px]"></div>

                                    <div className="relative z-10">
                                        <div className="bg-ghibli-paper/20 rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-6 relative">
                                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-700 z-10"></div>
                                            <div className="w-full aspect-[4/5] relative">
                                                <ArtworkImage
                                                    src={art.image_url}
                                                    alt={art.title}
                                                    size="card"
                                                    objectFit="object-contain"
                                                    className="absolute inset-0"
                                                    imgClassName="p-4 transition-transform duration-1000 group-hover:scale-105"
                                                />
                                            </div>
                                        </div>

                                        {art.title && (
                                            <div className="px-1 sm:px-2 pb-1 sm:pb-2">
                                                <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] text-ghibli-wood/50 uppercase block mb-1 sm:mb-3">
                                                    {category}
                                                </span>
                                                <h4 className="font-bold text-ghibli-charcoal text-sm sm:text-lg md:text-2xl font-serif group-hover:text-ghibli-wood transition-colors duration-300 leading-snug line-clamp-2">
                                                    {art.title}
                                                </h4>
                                                {art.price && (
                                                    <div className="mt-2 sm:mt-4 flex items-baseline gap-2 sm:gap-3 border-t border-ghibli-wood/10 pt-2 sm:pt-4">
                                                        <span className="font-black text-sm sm:text-lg md:text-xl text-ghibli-charcoal">{formatPrice(art.price)}</span>
                                                        {art.original_price && getDiscountPct(art) && (
                                                            <span className="text-sm text-ghibli-charcoal/30 line-through font-bold">{formatPrice(art.original_price)}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </ScrollRevealItem>
                            )
                        ))
                    ) : (
                        <div className="col-span-full text-center py-24">
                            <h3 className="text-xl font-bold text-ghibli-charcoal mb-2">Coming soon</h3>
                            <p className="text-ghibli-charcoal/60">New pieces for this collection are on the way.</p>
                        </div>
                    )}
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
                            className="bg-ghibli-cream rounded-[2.5rem] overflow-hidden max-w-6xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative"
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
                                        <ArtworkImage
                                            src={selectedArt.image_url}
                                            alt={selectedArt.title}
                                            size="detail"
                                            objectFit="object-contain"
                                            imgClassName="drop-shadow-2xl"
                                        />
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
                                    <ArtworkImage
                                        src={selectedArt.image_url}
                                        alt={selectedArt.title}
                                        size="detail"
                                        objectFit="object-contain"
                                        imgClassName="drop-shadow-2xl"
                                    />
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
                                        {category?.toUpperCase() || 'COLLECTION'}
                                    </span>
                                    {getSubCategory(selectedArt) && (
                                        <span className="text-ghibli-charcoal/40 font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs">
                                            • {getSubCategory(selectedArt)}
                                        </span>
                                    )}
                                </div>

                                {(selectedArt.price || selectedArt.original_price) && (
                                    <div className="flex items-baseline gap-4 mb-8 bg-ghibli-cream/50 p-4 rounded-2xl border border-ghibli-wood/5">
                                        {selectedArt.price && <span className="text-3xl font-black text-ghibli-charcoal">{formatPrice(selectedArt.price)}</span>}
                                        {selectedArt.original_price && getDiscountPct(selectedArt) && (
                                            <span className="text-lg text-ghibli-charcoal/30 line-through font-bold">{formatPrice(selectedArt.original_price)}</span>
                                        )}
                                    </div>
                                )}

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

                                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto mt-auto">
                                    <WhatsAppButton
                                        href={buildWhatsAppUrl(selectedArt, channels)}
                                        onClick={() => setSelectedArt(null)}
                                        className="px-8 py-5 bg-[#25D366]/80 text-white rounded-full font-black tracking-[0.15em] text-xs uppercase self-start shadow-[0_10px_30px_rgba(37,211,102,0.2)] text-center flex-1"
                                    >
                                        Inquire About Piece
                                    </WhatsAppButton>
                                    <a
                                        href="/#contact"
                                        onClick={() => setSelectedArt(null)}
                                        className="px-8 py-5 bg-white text-ghibli-charcoal rounded-full font-black tracking-[0.15em] text-xs uppercase hover:bg-ghibli-cream transition-all self-start border border-ghibli-wood/20 hover:border-ghibli-wood shadow-sm text-center flex-1"
                                    >
                                        Contact
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FullGallery;
