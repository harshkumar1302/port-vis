import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

// --- Constants (Shared with ArtGallery) ---
const MAIN_CATEGORIES = [
    { id: 'mandala', label: 'Mandala Art' },
    { id: 'miniature', label: 'Miniatures' },
    { id: 'gift', label: 'Gift Material' },
    { id: 'diy', label: 'DIY Art' },
];

const SUB_CATEGORIES = {
    mandala: ['All', 'Dot Mandala', 'Generic Mandala', 'Wall Mandala'],
    miniature: ['All', 'Miniatures', 'Clay Sets'],
    gift: ['All', 'Vintage Frame', 'Fridge Magnet', 'Key Chains', 'Brooch', 'Garlands', 'Gopi Dots', 'Bottle Arts', 'Tote Bags', 'Car Hanging'],
    diy: ['All', 'Bookmarks', 'Stick Bookmarks (Clay)', 'Wooden Bookmarks', 'MDF Boards', 'Backdrops'],
};

const FullGallery = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubCategory, setSelectedSubCategory] = useState('All');
    const [selectedArt, setSelectedArt] = useState(null);

    // Validate category
    const currentCategory = MAIN_CATEGORIES.find(c => c.id === category);

    useEffect(() => {
        if (!currentCategory) {
            navigate('/');
            return;
        }
        fetchArtworks();
        window.scrollTo(0, 0);
    }, [category, navigate, currentCategory]);

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

    // Filter Logic
    const filteredArtworks = artworks.filter(art => {
        if (!category) return false;

        // 1. Main Category Match
        const catMatch = art.category?.toLowerCase().includes(category);
        if (!catMatch) return false;

        // 2. Sub-Category Match
        if (selectedSubCategory !== 'All') {
            const subMatch =
                art.description?.toLowerCase().includes(selectedSubCategory.toLowerCase()) ||
                art.title?.toLowerCase().includes(selectedSubCategory.toLowerCase()) ||
                art.tags?.includes(selectedSubCategory);
            if (!subMatch) return false;
        }
        return true;
    });

    if (!currentCategory) return null;

    return (
        <div className="min-h-screen bg-ghibli-cream/30 pt-32 pb-24 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Navigation */}
                <Link
                    to="/"
                    className="text-ghibli-wood hover:text-ghibli-charcoal font-bold text-sm tracking-widest uppercase flex items-center gap-2 mb-12 transition-colors group w-fit"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    Back to Studio
                </Link>

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-ghibli-charcoal font-serif mb-4">
                        {currentCategory.label} Collection
                    </h1>
                    <p className="text-ghibli-charcoal/60 max-w-2xl text-lg">
                        A curated selection of {currentCategory.label.toLowerCase()} pieces, each telling a story of patience and craftsmanship.
                    </p>
                </div>

                {/* Sub-Category Tabs (Sticky) */}
                <div className="sticky top-24 z-30 bg-ghibli-cream/95 backdrop-blur-sm -mx-4 px-4 md:-mx-8 md:px-8 py-4 mb-12 border-b border-ghibli-wood/10">
                    <div className="flex overflow-x-auto gap-3 no-scrollbar max-w-7xl mx-auto">
                        {SUB_CATEGORIES[category]?.map((sub) => (
                            <button
                                key={sub}
                                onClick={() => setSelectedSubCategory(sub)}
                                className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-[0.1em] uppercase whitespace-nowrap transition-all border ${selectedSubCategory === sub
                                        ? 'bg-ghibli-wood text-ghibli-cream border-ghibli-wood'
                                        : 'bg-white text-ghibli-charcoal/60 border-ghibli-wood/10 hover:border-ghibli-wood/30'
                                    }`}
                            >
                                {sub}
                            </button>
                        )) || null}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 min-h-[50vh]">
                    {filteredArtworks.length > 0 ? (
                        filteredArtworks.map((art) => (
                            <div
                                key={art.id}
                                onClick={() => setSelectedArt(art)}
                                className="group cursor-pointer bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-xl transition-all duration-500 border border-ghibli-wood/5 flex flex-col h-full hover:-translate-y-1"
                            >
                                <div className="aspect-[4/5] bg-ghibli-paper/20 rounded-2xl overflow-hidden mb-6 relative">
                                    <div className="absolute inset-0 bg-ghibli-wood/0 group-hover:bg-ghibli-wood/5 transition-colors duration-500 z-10"></div>
                                    {(!art.image_url || art.image_url.trim() === '') ? (
                                        <div className="w-full h-full flex items-center justify-center flex-col gap-2">
                                            <span className="text-4xl opacity-10 group-hover:scale-110 transition-transform duration-500">🎨</span>
                                            <span className="text-[10px] font-bold tracking-widest text-ghibli-charcoal/20 uppercase">In Progress</span>
                                        </div>
                                    ) : (
                                        <img
                                            src={art.image_url}
                                            alt={art.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    )}
                                </div>

                                <div className="mt-auto px-2 pb-2">
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-ghibli-wood/50 uppercase block mb-2">
                                        {category}
                                    </span>
                                    <h4 className="font-bold text-ghibli-charcoal text-xl font-serif group-hover:text-ghibli-wood transition-colors line-clamp-1">
                                        {art.title || 'Untitled Piece'}
                                    </h4>
                                </div>
                            </div>
                        ))
                    ) : (
                        /* Empty State Placeholders - STUDIO LOOK */
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-[2rem] p-4 border border-ghibli-wood/5 opacity-60">
                                <div className="aspect-[4/5] bg-ghibli-paper/20 rounded-2xl mb-6 flex items-center justify-center">
                                    <span className="text-[10px] font-bold tracking-widest text-ghibli-charcoal/20 uppercase">Coming Soon</span>
                                </div>
                                <div className="px-2 pb-2">
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-ghibli-wood/30 uppercase block mb-2">Gallery Slot</span>
                                    <h4 className="font-bold text-ghibli-charcoal/40 text-xl font-serif">Piece {i + 1}</h4>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal - STUDIO STYLE */}
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
                            <div className="w-full md:w-[55%] bg-ghibli-paper/30 relative flex items-center justify-center p-8 md:p-12 hidden md:flex">
                                <div className="relative w-full h-full shadow-2xl rounded-lg overflow-hidden max-h-[600px]">
                                    {(!selectedArt.image_url || selectedArt.image_url.trim() === '') ? (
                                        <div className="w-full h-full bg-white flex items-center justify-center">
                                            <span className="text-6xl opacity-20">✨</span>
                                        </div>
                                    ) : (
                                        <img src={selectedArt.image_url} alt={selectedArt.title} className="w-full h-full object-cover" />
                                    )}
                                </div>
                            </div>

                            {/* Mobile Image (Smaller) */}
                            <div className="w-full h-64 md:hidden bg-ghibli-paper/30 relative flex items-center justify-center overflow-hidden">
                                {(!selectedArt.image_url || selectedArt.image_url.trim() === '') ? (
                                    <div className="w-full h-full bg-white flex items-center justify-center">
                                        <span className="text-4xl opacity-20">✨</span>
                                    </div>
                                ) : (
                                    <img src={selectedArt.image_url} alt={selectedArt.title} className="w-full h-full object-cover" />
                                )}
                            </div>

                            {/* Details Section */}
                            <div className="w-full md:w-[45%] p-8 md:p-12 flex flex-col justify-center bg-white relative overflow-y-auto">
                                <span className="text-ghibli-wood font-bold tracking-[0.25em] uppercase text-[10px] mb-4">
                                    {category?.toUpperCase() || 'COLLECTION'}
                                </span>

                                <h3 className="text-3xl md:text-5xl font-bold font-serif text-ghibli-charcoal mb-4">
                                    {selectedArt.title}
                                </h3>

                                <div className="w-12 h-2 mb-8 text-ghibli-gold/40">
                                    <svg viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="4">
                                        <path d="M0 10 Q25 20 50 10 T100 10" />
                                    </svg>
                                </div>

                                <div className="prose prose-sm text-ghibli-charcoal/70 leading-loose mb-10 font-sans">
                                    <p>{selectedArt.description || "A unique handmade piece, crafted with attention to detail and a love for the small things. This artwork fits perfectly in cozy corners or as a thoughtful gift."}</p>
                                </div>

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
        </div>
    );
};

export default FullGallery;
