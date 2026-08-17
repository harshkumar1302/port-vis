import ProductCardSkeleton from '../ProductCardSkeleton';

const GalleryPageSkeleton = () => (
  <div className="min-h-screen bg-[#FDFBF7] animate-pulse">
    <div className="pt-28 sm:pt-40 pb-16 flex flex-col items-center px-6">
      <div className="h-8 w-48 bg-ghibli-wood/10 rounded-full mb-6" />
      <div className="h-12 sm:h-16 w-72 sm:w-96 bg-ghibli-wood/10 rounded-xl mb-4" />
      <div className="h-5 w-full max-w-md bg-ghibli-wood/10 rounded-full" />
    </div>

    <div className="border-t border-ghibli-wood/10 pt-12 px-5 md:px-10 max-w-[1600px] mx-auto">
      <div className="h-4 w-32 bg-ghibli-wood/10 rounded-full mb-8" />
      <div className="flex gap-4 overflow-hidden pb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="shrink-0 w-[240px] sm:w-[280px]">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>

      {Array.from({ length: 2 }).map((_, section) => (
        <div key={section} className="mb-16">
          <div className="h-4 w-40 bg-ghibli-wood/10 rounded-full mb-6" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[200px] sm:w-[240px]">
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default GalleryPageSkeleton;
