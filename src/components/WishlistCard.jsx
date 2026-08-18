import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import useSiteSetting from '../hooks/useSiteSettings';
import { formatPriceShop, getDiscountPct } from '../lib/artwork';
import {
  titleToSlug,
  isShopListing,
  isGalleryListing,
  getGalleryCategoryUrl,
} from '../lib/categoryUtils';
import { buildWhatsAppUrl, DEFAULT_CHANNELS } from '../lib/enquire';
import ArtworkImage from './ArtworkImage';
import WhatsAppButton from './WhatsAppButton';

const WishlistCard = ({ art }) => {
  const navigate = useNavigate();
  const { toggleWishlist, moveToCart } = useStore();
  const { value: channels } = useSiteSetting('contact_channels', DEFAULT_CHANNELS);

  const isShop = isShopListing(art);
  const isGallery = !isShop && isGalleryListing(art);
  const price = formatPriceShop(art.price);
  const discount = getDiscountPct(art);
  const isOutOfStock = art.stock === 0;
  const slug = titleToSlug(art.title, art.id);
  const detailPath = isShop ? `/shop/${slug}` : getGalleryCategoryUrl(art.category);
  const waUrl = buildWhatsAppUrl(art, channels, {
    source: isGallery ? 'wishlist-gallery' : 'wishlist-shop',
  });

  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRemoving(true);
    setTimeout(() => {
      toggleWishlist(art);
    }, 300);
  };

  const handleMoveToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    moveToCart(art);
    navigate('/cart');
  };

  return (
    <article className="group cursor-pointer flex flex-col items-center relative">
      <div
        className={`w-full bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 mb-4 border border-ghibli-wood/5 relative ${isRemoving ? 'opacity-50 scale-95' : ''}`}
      >
        <Link to={detailPath} state={isShop ? { art } : undefined} className="block">
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500 z-10 pointer-events-none" />
          <ArtworkImage
            src={art.image_url}
            alt={art.title}
            size="card"
            objectFit="object-cover"
            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-1000"
          />
        </Link>

        {(discount || isOutOfStock) && (
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
            {discount && (
              <span className="px-3 py-1.5 rounded-full bg-ghibli-wood text-white text-[9px] font-extrabold tracking-widest uppercase shadow-sm">
                {discount}% off
              </span>
            )}
            {isOutOfStock && (
              <span className="px-3 py-1.5 rounded-full bg-ghibli-charcoal/80 backdrop-blur-md text-white text-[9px] font-extrabold tracking-widest uppercase shadow-sm">
                Sold Out
              </span>
            )}
          </div>
        )}

        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            onClick={handleRemove}
            className={`w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm hover:scale-110 transition-all border border-ghibli-wood/10 ${isRemoving ? 'text-ghibli-charcoal/30' : 'text-red-500 hover:text-red-600'}`}
            aria-label="Remove from Wishlist"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isRemoving ? 'none' : 'currentColor'}
              stroke="currentColor"
              strokeWidth={isRemoving ? '2' : '0'}
              className="w-5 h-5 transition-all duration-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 z-20 flex opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform translate-y-2 md:group-hover:translate-y-0">
          {isGallery ? (
            <WhatsAppButton
              href={waUrl}
              className="w-full py-3 px-4 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase shadow-lg backdrop-blur-md transition-colors border border-white/20 bg-[#25D366] text-white hover:bg-[#1da851] hover:scale-[1.02] text-center"
            >
              Enquire About Piece
            </WhatsAppButton>
          ) : (
            <button
              type="button"
              onClick={handleMoveToCart}
              disabled={isOutOfStock}
              className={`w-full py-3 px-4 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase shadow-lg backdrop-blur-md transition-colors border border-white/20 ${
                isOutOfStock
                  ? 'bg-white/70 text-ghibli-charcoal/40 cursor-not-allowed'
                  : 'bg-ghibli-charcoal/90 text-white hover:bg-ghibli-charcoal hover:scale-[1.02]'
              }`}
            >
              {isOutOfStock ? 'Sold Out' : 'Move to Cart'}
            </button>
          )}
        </div>
      </div>

      <div className="text-center px-2 opacity-90 group-hover:opacity-100 transition-opacity w-full">
        <h3 className="font-serif text-lg sm:text-xl font-bold text-ghibli-charcoal mb-1 group-hover:text-ghibli-wood transition-colors truncate">
          {art.title}
        </h3>
        <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold">
          <span className="text-ghibli-charcoal/40">{art.category || 'Collection'}</span>
          {isShop && price && (
            <>
              <span className="w-1 h-1 rounded-full bg-ghibli-wood/30" />
              <span className="text-ghibli-charcoal">{price}</span>
            </>
          )}
          {isGallery && (
            <>
              <span className="w-1 h-1 rounded-full bg-ghibli-wood/30" />
              <span className="text-ghibli-wood/70">Gallery</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default WishlistCard;
