/** Shared shimmer block for layout-matched skeletons */
const SkeletonBone = ({ className = '', rounded = 'rounded' }) => (
  <div
    className={`bg-[#ebe8e4]/80 animate-pulse ${rounded} ${className}`}
    aria-hidden
  />
);

export const GalleryBone = ({ className = '', rounded = 'rounded' }) => (
  <div
    className={`bg-ghibli-wood/10 animate-pulse ${rounded} ${className}`}
    aria-hidden
  />
);

export default SkeletonBone;
