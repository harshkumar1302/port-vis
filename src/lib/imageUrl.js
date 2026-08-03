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

/**
 * Always serve the original Supabase public URL.
 * Supabase /render/image/ transforms produce broken, blurry crops on this project —
 * originals are slower but look correct.
 */
export function optimizeImageUrl(url) {
  return getOriginalImageUrl(url);
}

export function isSupabaseStorageUrl(url) {
  if (!url) return false;
  return SUPABASE_OBJECT.test(url) || SUPABASE_RENDER.test(url);
}

// Kept for API compatibility — sizes are unused while transforms are off.
export const IMAGE_SIZES = {
  thumb: { width: 200, quality: 70 },
  card: { width: 480, quality: 75 },
  category: { width: 640, quality: 75 },
  detail: { width: 960, quality: 80 },
};
