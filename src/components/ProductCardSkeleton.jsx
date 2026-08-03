const ProductCardSkeleton = () => {
  return (
    <div className="group bg-white rounded-2xl sm:rounded-[32px] overflow-hidden shadow-soft flex flex-col h-full relative animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-square overflow-hidden bg-ghibli-wood/10 block w-full"></div>
      
      {/* Text Content Skeleton */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow bg-white/50 backdrop-blur-sm gap-3">
        {/* Category Label */}
        <div className="h-3 w-1/3 bg-ghibli-wood/10 rounded-full mb-1"></div>
        {/* Title */}
        <div className="h-5 w-3/4 bg-ghibli-wood/10 rounded-full"></div>
        {/* Stars */}
        <div className="flex gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-ghibli-wood/10"></div>
          ))}
        </div>
        
        <div className="flex items-end justify-between mt-auto pt-4">
          <div className="flex flex-col gap-1 w-1/3">
             {/* Price */}
             <div className="h-8 w-full bg-ghibli-wood/10 rounded-full"></div>
          </div>
          {/* Cart Button */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-ghibli-wood/10"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
