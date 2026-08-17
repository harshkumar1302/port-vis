import SkeletonBone from './skeletons/SkeletonBone';

/** Matches ShopProductCard layout: square image, title, price, CTA button */
const ShopProductCardSkeleton = () => (
  <article className="group flex flex-col h-full">
    <SkeletonBone className="aspect-square mb-4 w-full" rounded="rounded-none" />
    <div className="flex flex-col flex-grow">
      <SkeletonBone className="h-[18px] w-full mb-2" rounded="rounded-sm" />
      <SkeletonBone className="h-[18px] w-4/5 mb-2" rounded="rounded-sm" />
      <SkeletonBone className="h-[15px] w-1/3 mb-4" rounded="rounded-sm" />
      <div className="mt-auto">
        <SkeletonBone className="h-[46px] w-full" rounded="rounded-md" />
      </div>
    </div>
  </article>
);

export default ShopProductCardSkeleton;
