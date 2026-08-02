import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { isFeatured, isMarketplaceItem } from '../lib/artwork';
import ProductCard from './ProductCard';

const FeaturedPicks = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const { data, error } = await supabase
          .from('artworks')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;

        const featured = (data || []).filter(a => isFeatured(a));
        // Take exactly what is featured (up to 8) to give the user absolute control.
        // If they haven't featured anything yet, fall back to the newest 8 so the section isn't empty.
        setArtworks(featured.length > 0 ? featured.slice(0, 8) : (data || []).slice(0, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  return (
    <section id="featured" className="relative py-20 md:py-28 scroll-mt-28 overflow-hidden bg-ghibli-cream/20 border-b border-ghibli-wood/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8">
        
        {/* Header matching DecorMuse style */}
        <div className="text-center mb-12">
          <span className="text-ghibli-wood/70 text-[10px] font-bold tracking-[0.2em] uppercase mb-3 block">
            New Launches & Trending
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-ghibli-charcoal font-serif tracking-tight flex flex-col items-center">
            Featured Picks
            <div className="h-0.5 w-16 bg-ghibli-wood/40 mt-6 rounded-full" />
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <div key={n} className="aspect-square bg-ghibli-wood/10 rounded-[24px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 gap-y-8 sm:gap-y-10">
            {artworks.map((art) => (
              <ProductCard key={art.id} art={art} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-ghibli-paper/50 border border-ghibli-charcoal/10 text-ghibli-charcoal font-bold text-sm hover:bg-white hover:border-ghibli-charcoal/20 hover:shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span>View All</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedPicks;
