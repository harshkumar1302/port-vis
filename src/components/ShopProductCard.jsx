import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatPriceShop, getDiscountPct } from '../lib/artwork';
import ArtworkImage from './ArtworkImage';
import { getShopPiecePath } from '../lib/pieceUrls';

const ShopProductCard = ({ art, priority = false }) => {
  const { toggleWishlist, isInWishlist, addToCart } = useStore();
  const price = formatPriceShop(art.price);
  const original = formatPriceShop(art.original_price);
  const discount = getDiscountPct(art);
  const isOutOfStock = art.stock === 0;
  const inWishlist = isInWishlist(art.id);
  const detailPath = getShopPiecePath(art);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(art);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(art);
  };

  return (
    <article className="group flex flex-col h-full">
      <Link to={detailPath} state={{ art }} className="block relative aspect-square overflow-hidden bg-[#f3f1ee] mb-4">
        <ArtworkImage
          src={art.image_url}
          alt={art.title}
          size="card"
          priority={priority}
          objectFit="object-cover"
          imgClassName="transition-transform duration-500 group-hover:scale-[1.02]"
        />

        {discount && (
          <span className="absolute bottom-3 left-3 z-10 px-3 py-1 rounded-full bg-[#8b2942] text-white text-[11px] font-bold tracking-wide">
            {discount}% OFF
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          className={`absolute top-3 right-3 z-10 min-w-[40px] min-h-[40px] w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border flex items-center justify-center hover:scale-110 transition-all active:scale-95 ${inWishlist ? 'border-red-500/40 text-red-500' : 'border-white/60 text-ghibli-charcoal/50'}`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={inWishlist}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={inWishlist ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </Link>

      <div className="flex flex-col flex-grow">
        <Link
          to={detailPath}
          state={{ art }}
          className="font-bold text-[15px] sm:text-base text-ghibli-charcoal leading-snug line-clamp-2 mb-2 group-hover:underline underline-offset-2"
        >
          {art.title}
        </Link>

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-4 text-[15px]">
          {price ? (
            <>
              {original && discount && (
                <span className="text-ghibli-charcoal/45 line-through">{original}</span>
              )}
              <span className="font-bold text-ghibli-charcoal">{price}</span>
            </>
          ) : (
            <span className="text-ghibli-charcoal/50 italic text-sm">Enquire for price</span>
          )}
        </div>

        <div className="mt-auto">
          {isOutOfStock ? (
            <button
              type="button"
              disabled
              className="w-full py-3 px-4 border border-ghibli-charcoal/20 rounded-md text-sm font-medium text-ghibli-charcoal/40 bg-[#f3f1ee] cursor-not-allowed"
            >
              Out of stock
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full py-3 px-4 border border-ghibli-charcoal rounded-md text-sm font-bold text-ghibli-charcoal bg-transparent hover:bg-ghibli-wood hover:text-white hover:border-ghibli-wood transition-colors duration-200"
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default ShopProductCard;
