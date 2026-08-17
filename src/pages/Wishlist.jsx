import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import ProductCardGrid from '../components/ProductCardGrid';

const Wishlist = () => {
  const { wishlist } = useStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-ghibli-cream pb-24">
      <div className="page-container max-w-[1400px] pt-8 pb-10 md:pb-12">
        <p className="text-ghibli-wood/70 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
          Your Private Collection
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ghibli-charcoal font-serif tracking-tight">
            Wishlist
          </h1>
          {wishlist.length > 0 && (
            <p className="text-sm font-bold text-ghibli-charcoal/50 uppercase tracking-widest">
              {wishlist.length} {wishlist.length === 1 ? 'piece' : 'pieces'} saved
            </p>
          )}
        </div>
        <div className="h-0.5 w-16 bg-ghibli-wood/30 mt-6 rounded-full" />
      </div>

      <div className="page-container max-w-[1400px]">
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 md:py-28 text-center">
            <div className="w-20 h-20 rounded-full bg-ghibli-gold/15 flex items-center justify-center text-3xl mb-8">
              ✧
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-ghibli-charcoal mb-3">
              Nothing saved yet
            </h2>
            <p className="text-ghibli-charcoal/60 mb-10 max-w-md leading-relaxed">
              Tap the heart on any piece you love — it&apos;ll wait here until you&apos;re ready.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-ghibli-wood text-white font-bold text-sm hover:bg-ghibli-wood/90 transition-colors duration-200"
            >
              Browse Products
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        ) : (
          <ProductCardGrid items={wishlist} skeletonCount={wishlist.length} variant="wishlist" />
        )}
      </div>
    </div>
  );
};

export default Wishlist;
