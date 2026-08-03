import { optimizeImageUrl, getOriginalImageUrl } from './imageUrl';
import { isImageLoaded, markImageLoaded } from './imageCache';

/** Pull optimized image URLs from records (small WebP for fast loads). */
export function collectImageUrls(items, key = 'image_url', size = 'card') {
  if (!items?.length) return [];
  return items.map((item) => optimizeImageUrl(item?.[key], size)).filter(Boolean);
}

/**
 * Preload images into the browser cache. Non-blocking, skips already cached.
 */
export function preloadImages(urls, { concurrency = 6, timeoutMs = 8000 } = {}) {
  const unique = [...new Set(urls.filter(Boolean))];
  const pending = unique.filter((url) => !isImageLoaded(url));

  if (!pending.length) {
    return Promise.resolve({ loaded: unique.length, failed: 0, total: unique.length });
  }

  return new Promise((resolve) => {
    let loaded = unique.length - pending.length;
    let failed = 0;
    let index = 0;
    let inFlight = 0;
    const total = unique.length;

    const finishOne = (ok) => {
      inFlight--;
      if (ok) loaded++;
      else failed++;
      pump();
    };

    const pump = () => {
      while (inFlight < concurrency && index < pending.length) {
        const url = pending[index++];
        inFlight++;

        const img = new Image();
        let settled = false;

        const settle = (ok) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          if (ok) markImageLoaded(url);
          finishOne(ok);
        };

        const timer = setTimeout(() => settle(false), timeoutMs);

        img.onload = () => settle(true);
        img.onerror = () => settle(false);
        img.src = url;
      }

      if (loaded + failed >= total) {
        resolve({ loaded, failed, total });
      }
    };

    pump();
  });
}

/** Fire-and-forget preload — never blocks the UI. */
export function preloadImagesBackground(urls, options) {
  preloadImages(urls, options).catch(() => {});
}

export { getOriginalImageUrl };
