import HeroBanner from './HeroBanner';
import { DEFAULT_HERO_BANNER } from '../constants/heroBanners';

const Hero = () => (
  <section id="home" className="hero-banner-section w-full">
    <div className="hero-banner-wrap">
      <HeroBanner
        src={DEFAULT_HERO_BANNER.src}
        srcSet={DEFAULT_HERO_BANNER.srcSet}
        mobileSrc={DEFAULT_HERO_BANNER.mobileSrc}
        mobileSrcSet={DEFAULT_HERO_BANNER.mobileSrcSet}
        alt={DEFAULT_HERO_BANNER.alt}
      />
    </div>
  </section>
);

export default Hero;
