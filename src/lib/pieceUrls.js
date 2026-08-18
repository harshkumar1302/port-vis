import { SITE_URL } from './seo';
import { titleToSlug, isShopListing } from './categoryUtils';

export const getShopPiecePath = (art) => {
  if (!art) return '/shop';
  return `/shop/${titleToSlug(art.title, art.id)}`;
};

export const getGalleryPiecePath = (art) => {
  if (!art) return '/gallery';
  return `/gallery/piece/${titleToSlug(art.title, art.id)}`;
};

/** Unique public URL for any artwork row */
export const getPiecePath = (art) =>
  isShopListing(art) ? getShopPiecePath(art) : getGalleryPiecePath(art);

export const getAbsolutePieceUrl = (art) => {
  if (!art?.title && !art?.id) return null;
  return `${SITE_URL}${getPiecePath(art)}`;
};

export default {
  getShopPiecePath,
  getGalleryPiecePath,
  getPiecePath,
  getAbsolutePieceUrl,
};
