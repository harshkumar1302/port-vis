import { GalleryBone } from './SkeletonBone';
import { GalleryGridCardSkeleton } from './GalleryCardSkeletons';

/** Mirrors FullGallery.jsx — back link, header, sub-category tabs, grid */
const FullGalleryPageSkeleton = ({ categoryLabel = 'Collection' }) => (
  <div className="min-h-screen bg-[#FDFBF7] text-ghibli-charcoal pt-24 sm:pt-32 pb-20 sm:pb-32">
    <div className="page-container max-w-[1400px]">
      <GalleryBone className="h-10 w-52 sm:w-64 rounded-full mb-10 sm:mb-16" />

      <div className="mb-10 sm:mb-16 space-y-4">
        <div className="flex items-center gap-4">
          <GalleryBone className="w-8 h-[1px]" rounded="rounded-none" />
          <GalleryBone className="h-3 w-36" rounded="rounded-full" />
        </div>
        <GalleryBone className="h-10 sm:h-14 md:h-16 w-2/3 max-w-lg" rounded="rounded-xl" />
        <GalleryBone className="h-5 w-full max-w-2xl" rounded="rounded-full" />
        <GalleryBone className="h-5 w-4/5 max-w-xl" rounded="rounded-full" />
      </div>

      {/* Sticky sub-category tabs */}
      <div className="-mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-10 md:px-10 py-4 sm:py-6 mb-10 sm:mb-16">
        <div className="flex overflow-x-auto gap-2 sm:gap-3 bg-white/70 border border-ghibli-wood/10 p-2 sm:p-3 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.06)]">
          {['All', 'Sub 1', 'Sub 2', 'Sub 3'].map((tab) => (
            <GalleryBone
              key={tab}
              className={`h-11 shrink-0 ${tab === 'All' ? 'w-16 bg-ghibli-wood/20' : 'w-24'}`}
              rounded="rounded-full"
            />
          ))}
        </div>
      </div>

      <p className="sr-only">Loading {categoryLabel} gallery</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 md:gap-8 min-h-[50vh]">
        {Array.from({ length: 8 }).map((_, i) => (
          <GalleryGridCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

export default FullGalleryPageSkeleton;
