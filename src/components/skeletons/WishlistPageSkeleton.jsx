import WishlistCardSkeleton from './WishlistCardSkeleton';

const WishlistPageSkeleton = ({ count = 6 }) => {
  const slots = Math.min(Math.max(count, 3), 6);

  return (
    <div className="min-h-screen bg-ghibli-cream pb-24 pt-24 md:pt-32 animate-pulse">
      <div className="page-container max-w-[1200px] mb-12">
        <div className="h-3 w-40 bg-ghibli-wood/10 rounded-full mb-4" />
        <div className="h-12 w-56 bg-ghibli-wood/10 rounded-xl mb-6" />
        <div className="h-px w-full bg-ghibli-wood/10" />
      </div>

      <div className="page-container max-w-[1200px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: slots }).map((_, i) => (
            <WishlistCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPageSkeleton;
