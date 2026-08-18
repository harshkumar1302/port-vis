import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import WishlistCard from '../components/WishlistCard';
import ScrollRevealItem from '../components/ScrollRevealItem';
import { motion } from 'framer-motion';

const Wishlist = () => {
  const { wishlist } = useStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF8EC] pb-24 pt-32 sm:pt-48">
      {/* HEADER SECTION */}
      <div className="page-container max-w-[1600px] mb-12 sm:mb-16">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center pb-12 border-b border-ghibli-wood/10"
        >
          <span className="block text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-ghibli-wood mb-4">
            Curated For You
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-ghibli-charcoal font-serif tracking-tighter mb-6 leading-tight">
            Private Collection
          </h1>
          {wishlist.length > 0 && (
            <p className="text-ghibli-charcoal/40 text-sm font-bold tracking-[0.2em] uppercase">
              {wishlist.length} {wishlist.length === 1 ? 'Piece' : 'Pieces'} Saved
            </p>
          )}
        </motion.div>
      </div>

      <div className="page-container max-w-[1600px]">
        {wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col items-center justify-center py-20 md:py-32 text-center"
          >
            <div className="relative w-40 h-40 mb-12">
                <div className="absolute inset-0 bg-white rounded-full blur-[40px] opacity-60"></div>
                <div className="w-full h-full rounded-full border border-ghibli-wood/10 flex items-center justify-center relative z-10 bg-[#FBF8EC]/50 backdrop-blur-sm">
                    <span className="text-5xl opacity-20">✨</span>
                </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif font-black text-ghibli-charcoal mb-6 tracking-tight">
              The Vault is Empty
            </h2>
            <p className="text-ghibli-charcoal/50 mb-12 max-w-lg leading-relaxed font-light text-lg mx-auto">
              Wander through the grand exhibition. When a piece speaks to your soul, tap the heart to preserve it here.
            </p>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-ghibli-charcoal text-white font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-ghibli-wood transition-colors duration-500 shadow-[0_15px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(139,94,60,0.2)]"
            >
              Enter The Exhibition
            </Link>
          </motion.div>
        ) : (
          <div className="w-full">
            <div className="columns-2 lg:columns-3 xl:columns-4 gap-3 sm:gap-8 space-y-3 sm:space-y-8">
              {wishlist.map((art, i) => (
                <ScrollRevealItem
                  key={art.id}
                  index={i % 10}
                  className="break-inside-avoid"
                  amount={0.1}
                  delayStep={0.05}
                  duration={0.7}
                  y={30}
                >
                  <WishlistCard art={art} />
                </ScrollRevealItem>
              ))}
            </div>
            
            <div className="mt-20 md:mt-32 text-center">
                <Link
                to="/gallery"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-ghibli-charcoal font-bold text-[10px] tracking-[0.2em] uppercase border border-ghibli-wood/10 hover:border-ghibli-wood hover:bg-ghibli-cream transition-all duration-500 shadow-sm"
                >
                Discover More
                </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
