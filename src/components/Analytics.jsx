import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

/** Loads GA4 when VITE_GA_MEASUREMENT_ID is set in Vercel env. */
const Analytics = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (!GA_ID) return;

    if (!window.__gaLoaded) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', GA_ID, { send_page_view: false });

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);
      window.__gaLoaded = true;
    }
  }, []);

  useEffect(() => {
    if (!GA_ID || typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_path: pathname + search,
      page_title: document.title,
    });
  }, [pathname, search]);

  return null;
};

export default Analytics;
