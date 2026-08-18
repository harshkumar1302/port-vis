/** Single homepage banner */
export const DEFAULT_HERO_BANNER = {
  src: '/hero-banner.jpg',
  srcSet: '/hero-banner.jpg 3072w, /hero-banner@2x.jpg 6144w',
  mobileSrc: '/hero-banner-mobile.jpg',
  mobileSrcSet: '/hero-banner-mobile.jpg 1500w, /hero-banner-mobile@2x.jpg 2250w',
  alt: 'Made with heart, for moments that matter — Visheshkala handcrafted art and gifts',
};

/** Desktop banner (2078 × 649) */
export const HERO_BANNER_WIDTH = 2078;
export const HERO_BANNER_HEIGHT = 649;
export const HERO_BANNER_ASPECT = `${HERO_BANNER_WIDTH} / ${HERO_BANNER_HEIGHT}`;

/** Mobile banner (750 × 499 display, served up to 2250w) */
export const HERO_BANNER_MOBILE_WIDTH = 750;
export const HERO_BANNER_MOBILE_HEIGHT = 499;
export const HERO_BANNER_MOBILE_ASPECT = `${HERO_BANNER_MOBILE_WIDTH} / ${HERO_BANNER_MOBILE_HEIGHT}`;
