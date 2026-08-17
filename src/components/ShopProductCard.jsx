import { Link } from 'react-router-dom';
import { formatPriceShop, getDiscountPct } from '../lib/artwork';
import ArtworkImage from './ArtworkImage';
import { titleToSlug } from '../lib/categoryUtils';

const ShopProductCard = ({ art, priority = false }) => {
  const price = formatPriceShop(art.price);
  const original = formatPriceShop(art.original_price);
  const discount = getDiscountPct(art);
  const isOutOfStock = art.stock === 0;

  const slug = titleToSlug(art.title, art.id);
  const detailPath = `/shop/${slug}`;

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
            <Link
              to={detailPath}
              state={{ art }}
              className="block w-full py-3 px-4 border border-ghibli-charcoal rounded-md text-sm font-medium text-ghibli-charcoal bg-transparent group-hover:bg-[#ebe8e4] transition-colors duration-200 text-center"
            >
              Choose options
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default ShopProductCard;
