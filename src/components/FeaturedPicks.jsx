import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { isFeatured } from '../lib/artwork';
import ProductCardGrid, { FEATURED_GRID_CLASS } from './ProductCardGrid';

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

        const featured = (data || []).filter((a) => isFeatured(a));
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
      <div className="page-container max-w-[1400px]">
        <div className="text-center mb-12">
          <span className="text-ghibli-wood/70 text-[10px] font-bold tracking-[0.2em] uppercase mb-3 block">
            New Launches & Trending
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-ghibli-charcoal font-serif tracking-tight flex flex-col items-center">
            Featured Picks
            <div className="h-0.5 w-16 bg-ghibli-wood/40 mt-6 rounded-full" />
          </h2>
        </div>

        <ProductCardGrid
          items={artworks}
          dataLoading={loading}
          className={FEATURED_GRID_CLASS}
          skeletonCount={8}
          empty={
            <div className="col-span-full text-center py-16 text-ghibli-charcoal/60">
              New pieces are on the way — check back soon.
            </div>
          }
        />

        <div className="mt-12 flex justify-center">
          <Link
            to="/shop"
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
