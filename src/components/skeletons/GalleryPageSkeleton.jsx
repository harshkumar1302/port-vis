import { FALLBACK_CATEGORIES } from '../../constants/categories';
import { GalleryBone } from './SkeletonBone';
import { GalleryFeaturedCardSkeleton, GalleryCategoryCardSkeleton } from './GalleryCardSkeletons';

/** Mirrors ArtGallery.jsx — hero, featured row, category carousels */
const GalleryPageSkeleton = () => (
  <section className="relative bg-ghibli-cream text-ghibli-charcoal min-h-screen pb-20 sm:pb-32 overflow-hidden">
    {/* Hero — matches ArtGallery hero block */}
    <div className="relative w-full pt-28 sm:pt-40 pb-16 sm:pb-24 md:pb-32 flex flex-col items-center text-center px-4 sm:px-6 md:px-12">
      <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center">
        <GalleryBone className="h-8 w-52 rounded-full mb-6 sm:mb-8" />
        <GalleryBone className="h-10 sm:h-14 md:h-16 w-64 sm:w-80 md:w-[28rem] mb-4 sm:mb-6" rounded="rounded-xl" />
        <GalleryBone className="h-5 w-full max-w-md mb-2" rounded="rounded-full" />
        <GalleryBone className="h-5 w-4/5 max-w-sm" rounded="rounded-full" />
      </div>
    </div>

    <div className="w-full relative border-t border-ghibli-wood/10 pt-20">
      {/* Featured row header */}
      <div className="px-4 sm:px-5 md:px-10 lg:px-14 flex items-center justify-between mb-6 sm:mb-8 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4">
          <GalleryBone className="w-8 sm:w-12 h-[2px]" rounded="rounded-none" />
          <GalleryBone className="h-3 w-24" rounded="rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <GalleryBone className="w-12 h-12 rounded-full" />
          <GalleryBone className="w-12 h-12 rounded-full" />
        </div>
      </div>

      {/* Featured carousel strip — same padding as Swiper */}
      <div className="flex gap-4 sm:gap-6 md:gap-8 overflow-hidden py-12 pl-5 md:pl-10 lg:pl-14 max-w-[1600px] mx-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <GalleryFeaturedCardSkeleton key={i} />
        ))}
      </div>

      {/* Category sections */}
      <div className="space-y-24 w-full pb-20 max-w-[1600px] mx-auto mt-8">
        {FALLBACK_CATEGORIES.map((cat) => (
          <div key={cat.id}>
            <div className="px-5 md:px-10 lg:px-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 border-b border-ghibli-wood/10 pb-4">
              <div className="space-y-2">
                <GalleryBone className="h-9 md:h-10 w-48 md:w-56" rounded="rounded-lg" />
                <GalleryBone className="h-3 w-36" rounded="rounded-full" />
              </div>
              <GalleryBone className="h-10 w-36 rounded-full self-start sm:self-auto" />
            </div>
            <div className="flex gap-6 md:gap-8 overflow-hidden py-12 -my-12 pl-5 md:pl-10 lg:pl-14">
              {Array.from({ length: 4 }).map((_, i) => (
                <GalleryCategoryCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default GalleryPageSkeleton;
