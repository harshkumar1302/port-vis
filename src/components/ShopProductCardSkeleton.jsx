const ShopProductCardSkeleton = () => (
  <div className="flex flex-col h-full animate-pulse">
    <div className="aspect-square bg-[#ebe8e4] mb-4" />
    <div className="h-5 w-full bg-[#ebe8e4] rounded mb-2" />
    <div className="h-5 w-2/3 bg-[#ebe8e4] rounded mb-4" />
    <div className="h-11 w-full bg-[#ebe8e4] rounded-md mt-auto" />
  </div>
);

export default ShopProductCardSkeleton;
