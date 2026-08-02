import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { getBadges, formatPrice, getDiscountPct } from '../lib/artwork';

const ProductCard = ({ art }) => {
  const { toggleWishlist, isInWishlist, addToCart } = useStore();
  
  const badges = getBadges(art);
  const price = formatPrice(art.price);
  const original = formatPrice(art.original_price);
  const discount = getDiscountPct(art);
  const isBestseller = badges.some(b => b.type === 'bestseller');
  
  // generate a slug from the title
  const slug = (art.title || 'piece')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || art.id;
  const inWishlist = isInWishlist(art.id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(art);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(art);
  };

  return (
    <div className="group bg-white rounded-[24px] overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 border border-ghibli-wood/5 flex flex-col h-full relative">
      <Link to={`/product/${slug}`} state={{ art }} className="relative aspect-square overflow-hidden bg-ghibli-paper block">
        {/* Image */}
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
        
        {/* Top Left: Discount Badge */}
        {discount && (
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1.5 rounded-full bg-red-500/90 text-white text-[11px] font-extrabold tracking-wide shadow-sm backdrop-blur-sm">
              -{discount}%
            </span>
          </div>
        )}

        {/* Top Right: Wishlist Heart & Bestseller */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
          {/* Heart Button */}
          <button 
            onClick={handleWishlist}
            className={`w-9 h-9 rounded-full bg-white/80 backdrop-blur-md shadow-sm border flex items-center justify-center hover:scale-110 hover:bg-white transition-all active:scale-95 ${inWishlist ? 'border-red-500/40 text-red-500' : 'border-white/40 text-ghibli-charcoal/50'}`}
            aria-label="Toggle Wishlist"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill={inWishlist ? "currentColor" : "none"} 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-4 h-4 transition-colors"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </button>
          
          {/* Bestseller Badge */}
          {isBestseller && (
            <span className="px-2.5 py-1 rounded-full bg-ghibli-gold/90 text-ghibli-charcoal text-[10px] font-bold tracking-wider shadow-sm backdrop-blur-sm">
              Bestseller
            </span>
          )}
        </div>

        {/* Bottom Left: Handmade with Love */}
        <div className="absolute bottom-4 left-4 z-10">
           <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-ghibli-moss text-[10px] font-bold tracking-wide shadow-sm">
             <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" className="opacity-80"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
             Handmade with Love
           </span>
        </div>
      </Link>

      <div className="p-4 sm:p-5 flex flex-col flex-grow bg-white/50 backdrop-blur-sm">
        <Link to={`/product/${slug}`} state={{ art }} className="block mb-3 flex-grow">
          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-ghibli-wood/70 mb-1 block">
            {art.category || 'Artwork'}
          </span>
          <h3 className="font-serif font-bold text-ghibli-charcoal text-[15px] sm:text-lg leading-snug line-clamp-2 hover:text-ghibli-wood transition-colors">
            {art.title}
          </h3>
          
          {/* Static Stars (Placeholder for reviews) */}
          <div className="flex gap-1 mt-2 text-[#FACD60]">
            {[...Array(5)].map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
            ))}
          </div>
        </Link>

        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col gap-0.5">
            {price ? (
              <>
                <span className="text-lg sm:text-xl font-extrabold text-ghibli-charcoal leading-none">{price}</span>
                {original && discount && (
                  <span className="text-[11px] sm:text-xs text-ghibli-charcoal/40 line-through">{original}</span>
                )}
              </>
            ) : (
              <span className="text-lg sm:text-xl font-extrabold text-ghibli-charcoal/30 leading-none">₹ ---</span>
            )}
          </div>

          {/* Bottom Right Cart Button */}
          <button 
            onClick={handleAddToCart}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-ghibli-wood flex items-center justify-center text-white shadow-md hover:bg-ghibli-wood/80 hover:scale-110 active:scale-95 transition-all"
            aria-label="Add to Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <path d="M3 6h18"></path>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
