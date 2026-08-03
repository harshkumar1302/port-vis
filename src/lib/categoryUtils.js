import { FALLBACK_CATEGORIES } from '../constants/categories';
import { getSubCategory } from './artwork';

/** Common typos / old slugs → canonical id */
const SLUG_ALIASES = {
  gits: 'gift',
  gifts: 'gift',
  mandalas: 'mandala',
  miniatures: 'miniature',
};

export const normalizeCategoryRef = (ref) => {
  if (!ref || ref === 'All') return 'All';
  const lower = ref.trim().toLowerCase();
  return SLUG_ALIASES[lower] || ref.trim();
};

export const findCategory = (ref, categories = FALLBACK_CATEGORIES) => {
  if (!ref || ref === 'All') return null;
  const normalized = normalizeCategoryRef(ref);
  const lower = normalized.toLowerCase();
  return categories.find(
    (c) =>
      c.id?.toLowerCase() === lower ||
      c.label?.toLowerCase() === lower ||
      c.label?.toLowerCase().includes(lower)
  ) || null;
};

/** Always returns the display label used in artworks.category */
export const resolveCategoryLabel = (ref, categories = FALLBACK_CATEGORIES) => {
  if (!ref || ref === 'All') return 'All';
  const cat = findCategory(ref, categories);
  return cat?.label || ref;
};

export const getCategoryId = (ref, categories = FALLBACK_CATEGORIES) => {
  const cat = findCategory(ref, categories);
  return cat?.id || normalizeCategoryRef(ref).toLowerCase();
};

export const getProductsUrl = (categoryRef, subCategory = null) => {
  if (!categoryRef || categoryRef === 'All') return '/shop';
  const id = typeof categoryRef === 'object' ? categoryRef.id : getCategoryId(categoryRef);
  const params = new URLSearchParams({ category: id });
  if (subCategory) params.set('sub', subCategory);
  return `/shop?${params.toString()}`;
};

/** @deprecated alias — use getProductsUrl */
export const getShopUrl = getProductsUrl;

export const getGalleryCategoryUrl = (categoryRef) => {
  if (!categoryRef || categoryRef === 'All') return '/gallery';
  const id = typeof categoryRef === 'object' ? categoryRef.id : getCategoryId(categoryRef);
  return `/gallery/${encodeURIComponent(id)}`;
};

export const titleToSlug = (title, fallbackId = '') => {
  const raw = title || fallbackId || 'piece';
  const slug = String(raw)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return slug || String(fallbackId || 'piece');
};

/** Legacy uploads used category "Featured" — infer shop category from metadata */
const legacyFeaturedHaystack = (art) =>
  [
    art.sub_category,
    getSubCategory(art),
    art.description,
    art.title,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

/** Does an artwork belong to a category (by id, label, or partial match)? */
export const artMatchesCategory = (art, categoryRef, categories = FALLBACK_CATEGORIES) => {
  if (!categoryRef || categoryRef === 'All') return true;
  const cat = findCategory(categoryRef, categories);
  const artCat = (art.category || '').trim().toLowerCase();
  if (!artCat) return false;

  if (cat) {
    const labelLower = cat.label?.trim().toLowerCase() || '';
    const idLower = cat.id?.trim().toLowerCase() || '';

    // Old admin flow saved everything as category "Featured"
    if (artCat === 'featured') {
      const haystack = legacyFeaturedHaystack(art);
      return (
        haystack.includes(idLower) ||
        haystack.includes(labelLower) ||
        (cat.subCategories || []).some((sub) =>
          haystack.includes(sub.toLowerCase())
        )
      );
    }

    return (
      artCat === labelLower ||
      artCat === idLower ||
      labelLower.includes(artCat) ||
      artCat.includes(labelLower) ||
      artCat.includes(idLower)
    );
  }

  const refLower = normalizeCategoryRef(categoryRef).toLowerCase();
  if (artCat === 'featured') {
    return legacyFeaturedHaystack(art).includes(refLower);
  }
  return artCat === refLower || artCat.includes(refLower) || refLower.includes(artCat);
};

export const artMatchesSubCategory = (art, subCategory) => {
  if (!subCategory) return true;
  const artDesc = art.description || '';
  const artSub = art.sub_category || '';
  return (
    artSub === subCategory ||
    artDesc.includes(`[SubCategory: ${subCategory}]`) ||
    artDesc.toLowerCase().includes(subCategory.toLowerCase()) ||
    (art.tags || []).includes(subCategory)
  );
};

/** Shop listings on /shop — only hide upcoming studio previews */
export const isProductListing = (art) => {
  const cat = (art.category || '').trim().toLowerCase();
  return cat !== 'upcoming';
};

export const groupArtworksByCategory = (artworks, categories = FALLBACK_CATEGORIES) => {
  const groups = categories.map((cat) => ({
    category: cat,
    items: artworks.filter(
      (a) => artMatchesCategory(a, cat.id, categories) && isProductListing(a)
    ),
  }));
  const uncategorized = artworks.filter(
    (a) =>
      isProductListing(a) &&
      !categories.some((c) => artMatchesCategory(a, c.id, categories))
  );
  if (uncategorized.length) groups.push({ category: { id: 'other', label: 'Other' }, items: uncategorized });
  return groups.filter((g) => g.items.length > 0);
};
