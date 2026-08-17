import HeroBanner from './HeroBanner';
import { DEFAULT_HERO_BANNER } from '../constants/heroBanners';

const Hero = () => (
  <section id="home" className="hero-banner-section w-full pt-0 pb-4 sm:pt-6 sm:pb-8 md:pt-8 md:pb-10">
    <div className="mx-auto w-full max-w-[2078px] px-0 sm:px-6 lg:px-8">
      <HeroBanner
        src={DEFAULT_HERO_BANNER.src}
        mobileSrc={DEFAULT_HERO_BANNER.mobileSrc}
        alt={DEFAULT_HERO_BANNER.alt}
      />
    </div>
  </section>
);

export default Hero;
