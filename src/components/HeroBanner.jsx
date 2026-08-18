import { HERO_BANNER_WIDTH, HERO_BANNER_HEIGHT } from '../constants/heroBanners';

const HeroBanner = ({ src, srcSet, mobileSrc, mobileSrcSet, alt }) => {
  if (!src) return null;

  return (
    <div className="hero-banner-frame">
      <picture>
        {mobileSrc && (
          <source
            media="(max-width: 639px)"
            srcSet={mobileSrcSet || mobileSrc}
            sizes="100vw"
          />
        )}
        <img
          src={src}
          srcSet={srcSet}
          sizes="(max-width: 639px) 100vw, min(100vw - 5rem, 2078px)"
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
