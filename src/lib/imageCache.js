import { getOriginalImageUrl } from './imageUrl';

const loaded = new Set();

export function markImageLoaded(url) {
  const key = getOriginalImageUrl(url);
  if (key) loaded.add(key);
}

export function isImageLoaded(url) {
  const key = getOriginalImageUrl(url);
  return key ? loaded.has(key) : false;
}

export function clearImageCache() {
  loaded.clear();
}
