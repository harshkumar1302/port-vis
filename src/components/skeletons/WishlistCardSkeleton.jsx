const WishlistCardSkeleton = () => (
  <div className="flex flex-col h-full bg-white/60 rounded-[1.75rem] border border-ghibli-wood/10 overflow-hidden animate-pulse">
    <div className="aspect-[4/5] bg-ghibli-wood/10" />
    <div className="p-5 sm:p-6 space-y-4">
      <div className="h-3 w-24 bg-ghibli-wood/10 rounded-full" />
      <div className="h-6 w-full bg-ghibli-wood/10 rounded-lg" />
      <div className="h-6 w-2/3 bg-ghibli-wood/10 rounded-lg" />
      <div className="h-5 w-20 bg-ghibli-wood/10 rounded-md mt-2" />
      <div className="h-12 w-full bg-ghibli-wood/10 rounded-full mt-4" />
      <div className="h-3 w-24 bg-ghibli-wood/10 rounded-full mx-auto" />
    </div>
  </div>
);

export default WishlistCardSkeleton;
