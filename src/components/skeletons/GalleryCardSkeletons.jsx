import { GalleryBone } from './SkeletonBone';

/** Featured swiper slide — aspect 4/5, rounded-[32px], title gradient zone */
export const GalleryFeaturedCardSkeleton = () => (
  <div className="aspect-[4/5] rounded-[32px] overflow-hidden bg-white shadow-[0_15px_40px_rgba(0,0,0,0.06)] relative shrink-0 w-[72vw] sm:w-[280px] md:w-[300px] lg:w-[320px]">
    <GalleryBone className="absolute inset-0" rounded="rounded-none" />
    <div className="absolute bottom-0 left-0 right-0 p-8 pt-24 bg-gradient-to-t from-[#ebe8e4]/90 to-transparent">
      <GalleryBone className="h-6 w-3/4 mb-2" rounded="rounded-sm" />
      <GalleryBone className="h-3 w-1/3" rounded="rounded-full" />
    </div>
  </div>
);

/** Category embla slide — matches CategorySlider card */
export const GalleryCategoryCardSkeleton = () => (
  <div className="flex-[0_0_72vw] sm:flex-[0_0_280px] md:flex-[0_0_320px] flex flex-col shrink-0">
    <GalleryBone className="aspect-[4/5] rounded-[32px] mb-4 w-full shadow-[0_15px_40px_rgba(0,0,0,0.04)]" />
    <GalleryBone className="h-5 w-2/3 mx-2" rounded="rounded-sm" />
  </div>
);

/** FullGallery grid card — white frame, 4/5 image, category + title */
export const GalleryGridCardSkeleton = () => (
  <div className="bg-white rounded-2xl sm:rounded-[32px] p-2 sm:p-4 border border-ghibli-wood/5 shadow-[0_15px_40px_rgba(0,0,0,0.04)] h-full">
    <GalleryBone className="aspect-[4/5] rounded-xl sm:rounded-2xl w-full mb-3 sm:mb-6" />
    <div className="px-1 sm:px-2 pb-1 sm:pb-2 space-y-2">
      <GalleryBone className="h-2.5 w-1/4" rounded="rounded-full" />
      <GalleryBone className="h-5 sm:h-6 w-4/5" rounded="rounded-sm" />
    </div>
  </div>
);
