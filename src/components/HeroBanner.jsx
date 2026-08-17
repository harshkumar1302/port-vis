import { HERO_BANNER_WIDTH, HERO_BANNER_HEIGHT } from '../constants/heroBanners';

const HeroBanner = ({ src, mobileSrc, alt }) => {
  if (!src) return null;

  return (
    <div className="hero-banner-frame relative w-full overflow-hidden rounded-none border-0 shadow-none sm:rounded-2xl sm:border sm:border-ghibli-wood/10 sm:shadow-lg lg:rounded-3xl">
      <picture>
        {mobileSrc && (
          <source media="(max-width: 639px)" srcSet={mobileSrc} />
        )}
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
      </picture>
    </div>
  );
};

export default HeroBanner;
