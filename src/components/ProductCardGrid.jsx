import { useEffect, useMemo } from 'react';
import ProductCard from './ProductCard';
import ShopProductCard from './ShopProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import ShopProductCardSkeleton from './ShopProductCardSkeleton';
import { collectImageUrls, preloadImagesBackground } from '../lib/preloadImages';
import ScrollRevealItem from './ScrollRevealItem';

export const PRODUCT_GRID_CLASS =
  'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12';

export const SHOP_GRID_CLASS =
  'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12';

export const FEATURED_GRID_CLASS =
  'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 min-h-[400px]';

/**
 * Shows cards as soon as data is ready. Images load inside each card (small WebP).
 * Background-preloads the first few for snappier repeat views.
 */
const ProductCardGrid = ({
  items = [],
  dataLoading = false,
  skeletonCount = 8,
  className = PRODUCT_GRID_CLASS,
  variant = 'default',
  empty = null,
}) => {
  const urls = useMemo(() => collectImageUrls(items, 'image_url', 'card'), [items]);
  const Card = variant === 'shop' ? ShopProductCard : ProductCard;
  const Skeleton = variant === 'shop' ? ShopProductCardSkeleton : ProductCardSkeleton;
  const gridClass = variant === 'shop' ? (className === PRODUCT_GRID_CLASS ? SHOP_GRID_CLASS : className) : className;

  useEffect(() => {
    if (!dataLoading && urls.length > 0) {
      preloadImagesBackground(urls.slice(0, 4));
    }
  }, [urls, dataLoading]);

  if (dataLoading) {
    const count = Math.min(skeletonCount, 8);
    return (
      <div className={gridClass}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex flex-col h-full">
             <Skeleton />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return empty;
  }

  return (
    <div className={gridClass}>
      {items.map((art, i) => (
        <ScrollRevealItem
          key={art.id}
          index={i}
          className="flex flex-col h-full"
          amount={0.18}
          delayStep={0.06}
          duration={0.9}
          y={26}
          scale={0.986}
        >
          <Card art={art} priority={i < 4} />
        </ScrollRevealItem>
      ))}
    </div>
  );
};

export default ProductCardGrid;
