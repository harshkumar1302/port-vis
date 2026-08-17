import { HERO_BANNER_WIDTH, HERO_BANNER_HEIGHT } from '../constants/heroBanners';

const HeroBanner = ({ src, mobileSrc, alt }) => {
  if (!src) return null;

  return (
    <div className="hero-banner-frame">
      <picture>
        {mobileSrc && (
          <source media="(max-width: 639px)" srcSet={mobileSrc} />
        )}
        <img
          src={src}
          alt={alt}
          width={HERO_BANNER_WIDTH}
          height={HERO_BANNER_HEIGHT}
          className="hero-banner-img"
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
