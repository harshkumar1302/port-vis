import { HERO_BANNER_WIDTH, HERO_BANNER_HEIGHT } from '../constants/heroBanners';

const HeroBanner = ({ src, alt }) => {
  if (!src) return null;

  return (
    <div className="hero-banner-frame relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-ghibli-wood/10 shadow-lg">
      <img
        src={src}
        alt={alt}
        width={HERO_BANNER_WIDTH}
        height={HERO_BANNER_HEIGHT}
        className="block h-auto w-full"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        draggable={false}
      />
    </div>
  );
};

export default HeroBanner;
