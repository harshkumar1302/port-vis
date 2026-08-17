import ShopProductCardSkeleton from '../ShopProductCardSkeleton';
import { SHOP_GRID_CLASS } from '../ProductCardGrid';
import SkeletonBone from './SkeletonBone';

/** Mirrors Products.jsx — header, filter bar, product grid */
const ShopPageSkeleton = ({ count = 8 }) => (
  <div className="pt-6 sm:pt-10 pb-20 sm:pb-24 min-h-screen bg-[#f8f7f5]">
    <div className="page-container max-w-[1400px]">
      <header className="mb-8 md:mb-10">
        <SkeletonBone className="h-9 sm:h-10 w-32 sm:w-40 mb-2" rounded="rounded-md" />
      </header>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 pb-6 border-b border-ghibli-charcoal/10">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <SkeletonBone className="h-4 w-12" rounded="rounded-sm" />
          <SkeletonBone className="h-10 w-24 min-h-[40px]" rounded="rounded-md" />
          <SkeletonBone className="h-10 w-28 min-h-[40px]" rounded="rounded-md" />
          <SkeletonBone className="h-10 w-32 min-h-[40px]" rounded="rounded-md" />
        </div>
        <div className="flex flex-wrap items-center gap-4 lg:gap-6">
          <SkeletonBone className="h-4 w-20" rounded="rounded-sm" />
          <SkeletonBone className="h-10 w-36 min-h-[40px]" rounded="rounded-md" />
        </div>
      </div>

      <div className={SHOP_GRID_CLASS}>
        {Array.from({ length: Math.min(count, 8) }).map((_, i) => (
          <ShopProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

export default ShopPageSkeleton;
