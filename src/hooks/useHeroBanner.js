import { useState, useEffect, useCallback } from 'react';
import { fetchSiteSetting } from '../lib/fetchSettings';
import { DEFAULT_HERO_BANNER } from '../constants/heroBanners';

export const HERO_BANNER_UPDATE_EVENT = 'hero-banner-updated';

const normalizeBanner = (value) => {
  const src = value?.src?.trim();
  if (!src) return DEFAULT_HERO_BANNER;
  return {
    src,
    alt: value.alt?.trim() || DEFAULT_HERO_BANNER.alt,
  };
};

export default function useHeroBanner() {
  const [banner, setBanner] = useState(DEFAULT_HERO_BANNER);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const value = await fetchSiteSetting('hero_banner', DEFAULT_HERO_BANNER);
    setBanner(normalizeBanner(value));
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
    const onUpdate = () => reload();
    window.addEventListener(HERO_BANNER_UPDATE_EVENT, onUpdate);
    return () => window.removeEventListener(HERO_BANNER_UPDATE_EVENT, onUpdate);
  }, [reload]);

  return { banner, loading };
}
