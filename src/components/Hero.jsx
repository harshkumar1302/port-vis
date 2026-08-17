import HeroBanner from './HeroBanner';
import useHeroBanner from '../hooks/useHeroBanner';
import { DEFAULT_HERO_BANNER } from '../constants/heroBanners';

const Hero = () => {
  const { banner, loading } = useHeroBanner();
  const display = loading ? DEFAULT_HERO_BANNER : banner;

  return (
    <section id="home" className="hero-banner-section w-full pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10">
      <div className="mx-auto w-full max-w-[2078px] px-4 sm:px-6 lg:px-8">
        <HeroBanner src={display.src} alt={display.alt} />
      </div>
    </section>
  );
};

export default Hero;
