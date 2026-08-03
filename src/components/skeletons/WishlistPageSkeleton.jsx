import ProductCardSkeleton from '../ProductCardSkeleton';

const WishlistPageSkeleton = ({ count = 8 }) => {
  const slots = Math.min(Math.max(count, 4), 8);

  return (
    <div className="min-h-screen bg-ghibli-cream pb-24 animate-pulse">
      <div className="page-container max-w-[1400px] pt-8 pb-10 md:pb-12">
        <div className="h-3 w-40 bg-ghibli-wood/10 rounded-full mb-4" />
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="h-12 w-48 bg-ghibli-wood/10 rounded-xl" />
          <div className="h-4 w-28 bg-ghibli-wood/10 rounded-full" />
        </div>
        <div className="h-0.5 w-16 bg-ghibli-wood/10 mt-6 rounded-full" />
      </div>

      <div className="page-container max-w-[1400px]">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 gap-y-8">
          {Array.from({ length: slots }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPageSkeleton;
