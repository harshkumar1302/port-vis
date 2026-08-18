import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { FALLBACK_CATEGORIES } from '../constants/categories';
import { getDiscountPct, formatPrice } from '../lib/artwork';
import { isGalleryListing, artMatchesCategory, artMatchesSubCategory } from '../lib/categoryUtils';
import { getGalleryPiecePath } from '../lib/pieceUrls';
import ArtworkImage from './ArtworkImage';
import { fetchSiteSetting } from '../lib/fetchSettings';
import { useArtworksCatalog } from '../hooks/useArtworksCatalog';
import FullGalleryPageSkeleton from './skeletons/FullGalleryPageSkeleton';
import ScrollRevealItem from './ScrollRevealItem';

const FALLBACK_CATEGORIES_LOCAL = FALLBACK_CATEGORIES;

const FullGallery = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const { artworks: catalog, loading } = useArtworksCatalog();
    const artworks = catalog.filter(isGalleryListing);
    const [selectedSubCategory, setSelectedSubCategory] = useState('All');
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
                                <Link
                                    to={getGalleryPiecePath(art)}
                                    state={{ art }}
                                    className="group cursor-pointer bg-white rounded-2xl sm:rounded-[32px] p-2 sm:p-4 shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] transition-all duration-300 border border-ghibli-wood/5 flex flex-col relative overflow-hidden h-full block"
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
                                </Link>
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
                                <Link
                                    to={getGalleryPiecePath(art)}
                                    state={{ art }}
                                    className="group cursor-pointer bg-white rounded-2xl sm:rounded-[32px] p-2 sm:p-4 shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] transition-all duration-700 border border-ghibli-wood/5 flex flex-col hover:-translate-y-2 relative overflow-hidden h-full block"
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
                                </Link>
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
        </div>
    );
};

export default FullGallery;
