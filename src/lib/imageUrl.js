const SUPABASE_OBJECT = /\/storage\/v1\/object\/public\//;
const SUPABASE_RENDER = /\/storage\/v1\/render\/image\/public\//;

/** Strip transform params and return the canonical public object URL. */
export function getOriginalImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  if (SUPABASE_RENDER.test(trimmed)) {
    return trimmed
      .replace('/storage/v1/render/image/public/', '/storage/v1/object/public/')
      .replace(/\?.*$/, '');
  }

  return trimmed.split('?')[0];
}

export function isSupabaseStorageUrl(url) {
  if (!url) return false;
  return SUPABASE_OBJECT.test(url) || SUPABASE_RENDER.test(url);
}

export const IMAGE_SIZES = {
  thumb: { width: 200, quality: 70 },
  card: { width: 480, quality: 75 },
  category: { width: 640, quality: 75 },
  detail: { width: 960, quality: 80 },
};

/**
 * Serve resized Supabase images via the render API to cut payload size.
 * Non-Supabase URLs pass through unchanged.
 */
export function optimizeImageUrl(url, size = 'card') {
  const original = getOriginalImageUrl(url);
  if (!original) return '';

  if (!isSupabaseStorageUrl(original)) return original;

  const { width, quality } = IMAGE_SIZES[size] || IMAGE_SIZES.card;
  const renderUrl = original.replace(
    '/storage/v1/object/public/',
    '/storage/v1/render/image/public/'
  );

  return `${renderUrl}?width=${width}&quality=${quality}&resize=contain`;
}
