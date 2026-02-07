import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

    // Embla Carousels
    const [featuredEmblaRef] = useEmblaCarousel({
        loop: true,
        align: 'center',
        containScroll: 'trimSnaps',
        dragFree: true
    });

    useEffect(() => {
        fetchArtworks();
    }, []);

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
        return artworks.filter(art => art.category?.toLowerCase().includes(catId));
    };

    // Helper to get Featured items
    const getFeaturedItems = () => {
        return artworks.filter(art =>
            art.description?.includes('[FEATURED]') ||
            art.title?.includes('[FEATURED]') ||
            art.tags?.includes('[FEATURED]')
        );
    };

    const getDisplayItems = (items, minCount = 8) => {
        const result = [...items];
        if (result.length < minCount) {
            const placeholdersNeeded = minCount - result.length;
            for (let i = 0; i < placeholdersNeeded; i++) {
                result.push({ id: `placeholder-${i}`, isPlaceholder: true });
            }
        }
        return result;
    };

    const featuredItems = getFeaturedItems();
    const displayFeatured = getDisplayItems(featuredItems);

    return (
        <section id="gallery" className="section-container relative min-h-screen py-24 bg-ghibli-cream/20">



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
                <div className="mb-24">
                    <div className="flex items-center gap-2 mb-6 opacity-60">
                        <span className="w-8 h-[1px] bg-ghibli-charcoal"></span>
                        <span className="text-xs uppercase tracking-widest font-bold">Featured Highlights</span>
                    </div>

                    {/* Embla Viewport */}
                    <div className="overflow-hidden" ref={featuredEmblaRef}>
                        <div className="flex gap-6 select-none touch-pan-y"> {/* Embla Container */}
                            {displayFeatured.map((work, index) => (
                                <div
                                    key={`${work.id || 'feat'}-${index}`}
                                    className="relative flex-[0_0_260px] md:flex-[0_0_320px] aspect-[3/4] rounded-[1.5rem] overflow-hidden group shadow-md hover:shadow-lg transition-all mx-2"
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

                                    {!work.isPlaceholder && (
                                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <h3 className="text-white font-serif font-bold text-lg">{work.title}</h3>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Category Sections - Embla Carousels */}
                <div className="space-y-20">
                    {MAIN_CATEGORIES.map((cat) => {
                        const items = getCategoryItems(cat.id);
                        const displayItems = getDisplayItems(items, 8); // Force 8 items minimum

                        return (
                            <CategorySlider
                                key={cat.id}
                                cat={cat}
                                items={displayItems}
                                isEmpty={items.length === 0}
                            />
                        );
                    })}
                </div>

            </div>
        </section >
    );
};

// Sub-component for Category Slider
const CategorySlider = ({ cat, items, isEmpty }) => {
    const [emblaRef] = useEmblaCarousel({
        align: 'start',
        containScroll: 'trimSnaps',
        dragFree: true
    });

    return (
        <div className="animate-fade-in-up">
            {/* Section Header */}
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
            <div className="overflow-hidden -mx-4 px-4" ref={emblaRef}>
                <div className="flex gap-4 select-none touch-pan-y">
                    {items.map((item, index) => (
                        <div
                            key={`${item.id || 'cat'}-${index}`}
                            className="flex-[0_0_200px] sm:flex-[0_0_240px] rounded-[1.5rem] flex flex-col groupcursor-pointer"
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
                                <h4 className={`font-bold text-sm font-serif truncate transition-colors ${item.isPlaceholder ? 'text-ghibli-charcoal/20' : 'text-ghibli-charcoal/70 group-hover:text-ghibli-charcoal'}`}>
                                    {item.isPlaceholder ? 'Gallery Slot' : (item?.title || `${cat.label} ${index + 1}`)}
                                </h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ArtGallery;
