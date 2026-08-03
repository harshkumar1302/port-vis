import ProductCardSkeleton from '../ProductCardSkeleton';
import { PRODUCT_GRID_CLASS } from '../ProductCardGrid';

const ShopPageSkeleton = ({ count = 8 }) => (
  <div className="min-h-screen bg-ghibli-cream pt-8 pb-24 animate-pulse">
    <div className="page-container max-w-[1400px] pt-4 pb-10">
      <div className="h-3 w-32 bg-ghibli-wood/10 rounded-full mb-4" />
      <div className="h-12 w-48 bg-ghibli-wood/10 rounded-xl mb-2" />
      <div className="h-0.5 w-16 bg-ghibli-wood/10 mt-4 rounded-full" />
    </div>
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
      <div className={PRODUCT_GRID_CLASS}>
        {Array.from({ length: Math.min(count, 8) }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

export default ShopPageSkeleton;
