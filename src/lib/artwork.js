/** Backward-compatible artwork helpers */

export const isFeatured = (art) =>
  art?.is_featured === true ||
  art?.description?.includes('[FEATURED]') ||
  art?.title?.includes('[FEATURED]') ||
  art?.category?.toLowerCase() === 'featured';

export const isBestseller = (art) =>
  art?.is_bestseller === true || art?.description?.includes('[BESTSELLER]');

export const isNewLaunch = (art) =>
  art?.is_new === true || art?.description?.includes('[NEW]');

export const getSubCategory = (art) => {
  if (art?.sub_category) return art.sub_category;
  const match = art?.description?.match(/\[SubCategory:\s*(.*?)\]/);
  return match?.[1] || null;
};

export const getDiscountPct = (art) => {
  const price = Number(art?.price);
  const original = Number(art?.original_price);
  if (!price || !original || original <= price) return null;
  return Math.round(((original - price) / original) * 100);
};

export const formatPrice = (amount) => {
  if (amount == null || amount === '') return null;
  const num = Number(amount);
  if (Number.isNaN(num)) return null;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

/** Afzaai-style: Rs. 799.00 */
export const formatPriceShop = (amount) => {
  if (amount == null || amount === '') return null;
  const num = Number(amount);
  if (Number.isNaN(num)) return null;
  return `Rs. ${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getBadges = (art) => {
  const badges = [];
  const discount = getDiscountPct(art);
  if (discount) badges.push({ type: 'discount', label: `-${discount}%` });
  if (art?.is_bestseller || isBestseller(art)) badges.push({ type: 'bestseller', label: 'Bestseller' });
  if (art?.is_new || isNewLaunch(art)) badges.push({ type: 'new', label: 'New' });
  if (isFeatured(art)) badges.push({ type: 'featured', label: 'Featured' });
  badges.push({ type: 'handmade', label: 'Handmade with Love' });
  return badges;
};

export const isMarketplaceItem = (art) =>
  isFeatured(art) || isBestseller(art) || isNewLaunch(art);

export const buildDescriptionWithMeta = (desc, subCategory, featured, bestseller = false, isNew = false) => {
  let clean = (desc || '')
    .replace(/\[SubCategory:\s*.*?\]/g, '')
    .replace(/\[FEATURED\]/g, '')
    .replace(/\[BESTSELLER\]/g, '')
    .replace(/\[NEW\]/g, '')
    .trim();
  if (subCategory) clean = `[SubCategory: ${subCategory}] ${clean}`.trim();
  if (featured) clean = `[FEATURED] ${clean}`.trim();
  if (bestseller) clean = `[BESTSELLER] ${clean}`.trim();
  if (isNew) clean = `[NEW] ${clean}`.trim();
  return clean;
};

export const stripMetaFromDescription = (desc) =>
  (desc || '')
    .replace(/\[SubCategory:\s*.*?\]/g, '')
    .replace(/\[FEATURED\]/g, '')
    .replace(/\[BESTSELLER\]/g, '')
    .replace(/\[NEW\]/g, '')
    .trim();
