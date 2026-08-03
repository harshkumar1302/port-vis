import { useEffect, useMemo } from 'react';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import { collectImageUrls, preloadImagesBackground } from '../lib/preloadImages';

export const PRODUCT_GRID_CLASS =
  'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6';

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
  empty = null,
}) => {
  const urls = useMemo(() => collectImageUrls(items, 'image_url', 'card'), [items]);

  useEffect(() => {
    if (!dataLoading && urls.length > 0) {
      preloadImagesBackground(urls.slice(0, 4));
    }
  }, [urls, dataLoading]);

  if (dataLoading) {
    const count = Math.min(skeletonCount, 8);
    return (
      <div className={className}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex flex-col h-full">
             <ProductCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return empty;
  }

  return (
    <div className={className}>
      {items.map((art, i) => (
        <div key={art.id} className="flex flex-col h-full">
           <ProductCard art={art} priority={i < 2} />
        </div>
      ))}
    </div>
  );
};

export default ProductCardGrid;
