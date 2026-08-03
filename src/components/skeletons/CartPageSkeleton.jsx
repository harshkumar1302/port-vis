const CartPageSkeleton = ({ rows = 3 }) => (
  <div className="min-h-screen bg-ghibli-cream pb-24 animate-pulse">
    <div className="page-container max-w-[1400px] pt-8 pb-10">
      <div className="h-3 w-32 bg-ghibli-wood/10 rounded-full mb-4" />
      <div className="h-12 w-40 bg-ghibli-wood/10 rounded-xl mb-2" />
      <div className="h-0.5 w-16 bg-ghibli-wood/10 mt-4 rounded-full" />
    </div>

    <div className="max-w-6xl mx-auto px-6 md:px-12">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        <div className="w-full lg:w-[60%] flex flex-col gap-6">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4 md:gap-6 pb-6 border-b border-ghibli-wood/10">
              <div className="w-28 md:w-32 aspect-square bg-ghibli-wood/10 rounded-xl shrink-0" />
              <div className="flex-1 space-y-3 pt-2">
                <div className="h-6 w-2/3 bg-ghibli-wood/10 rounded-full" />
                <div className="h-4 w-24 bg-ghibli-wood/10 rounded-full" />
                <div className="flex gap-4 pt-4">
                  <div className="h-8 w-24 bg-ghibli-wood/10 rounded-full" />
                  <div className="h-4 w-16 bg-ghibli-wood/10 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-[40%]">
          <div className="sticky top-24 bg-ghibli-wood/10 rounded-2xl p-8 space-y-6 min-h-[320px]">
            <div className="h-6 w-40 bg-white/30 rounded-full" />
            <div className="space-y-4">
              <div className="h-4 w-full bg-white/20 rounded-full" />
              <div className="h-4 w-full bg-white/20 rounded-full" />
              <div className="h-8 w-2/3 bg-white/30 rounded-full mt-4" />
            </div>
            <div className="h-12 w-full bg-white/25 rounded-full mt-8" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CartPageSkeleton;
