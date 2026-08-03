import { useMemo } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import usePageSEO from '../hooks/usePageSEO';
import {
  PAGE_SEO,
  CATEGORY_SEO,
  GALLERY_CATEGORY_SEO,
  NOINDEX_PATHS,
  SITE_NAME,
  buildFaqJsonLd,
} from '../lib/seo';

function isKnownRoute(pathname) {
  const exact = ['/', '/shop', '/gallery', '/about', '/contact', '/products', '/404'];
  if (exact.includes(pathname)) return true;
  if (NOINDEX_PATHS.includes(pathname)) return true;
  if (/^\/shop\/[^/]+$/.test(pathname)) return true;
  if (/^\/gallery\/[^/]+$/.test(pathname)) return true;
  if (/^\/product\/[^/]+$/.test(pathname)) return true;
  return false;
}

function resolveRouteSEO(pathname, galleryCategory, shopCategory) {
  const isNoindex = NOINDEX_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (isNoindex) {
    return {
      title: SITE_NAME,
      description: PAGE_SEO.home.description,
      path: pathname,
      noindex: true,
    };
  }

  if (pathname.startsWith('/shop/') && pathname !== '/shop') {
    return null;
  }

  if (pathname === '/shop') {
    const catSeo = shopCategory && CATEGORY_SEO[shopCategory];
    return {
      title: catSeo ? `${catSeo.title} | ${SITE_NAME}` : PAGE_SEO.shop.title,
      description: catSeo?.description || PAGE_SEO.shop.description,
      path: shopCategory ? `/shop?category=${shopCategory}` : '/shop',
      keywords: catSeo?.keywords,
    };
  }

  if (pathname.startsWith('/gallery/') && galleryCategory) {
    const label = GALLERY_CATEGORY_SEO[galleryCategory] || `${galleryCategory} Gallery`;
    return {
      title: `${label} | ${SITE_NAME}`,
      description: `Browse ${galleryCategory} handmade art in the Visheshkala gallery by Vishakha Garg — mandalas, miniatures, gifts and more.`,
      path: `/gallery/${galleryCategory}`,
    };
  }

  if (pathname === '/gallery') return PAGE_SEO.gallery;
  if (pathname === '/about') return PAGE_SEO.about;
  if (pathname === '/contact') return { ...PAGE_SEO.contact, jsonLd: buildFaqJsonLd() };
  if (pathname === '/404') return PAGE_SEO.notFound;

  if (!isKnownRoute(pathname)) return PAGE_SEO.notFound;

  return { ...PAGE_SEO.home, path: pathname === '/' ? '/' : pathname };
}

/** Applies route-aware SEO meta for the whole SPA */
const RouteSEO = () => {
  const { pathname } = useLocation();
  const { category: galleryCategory } = useParams();
  const [searchParams] = useSearchParams();
  const shopCategory = searchParams.get('category');

  const seo = useMemo(
    () => resolveRouteSEO(pathname, galleryCategory, shopCategory),
    [pathname, galleryCategory, shopCategory]
  );

  usePageSEO({
    enabled: seo !== null,
    ...(seo ?? PAGE_SEO.home),
  });

  return null;
};

export default RouteSEO;
