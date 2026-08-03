import { useEffect, useMemo, useState } from 'react';
import { preloadImages, preloadImagesBackground } from '../lib/preloadImages';

const ABOVE_FOLD = 12;

/**
 * Waits until the first batch of images is in the browser cache before returning ready=true.
 * Re-runs when urls change (e.g. category filter on Products).
 */
export function usePreloadedImages(urls, { enabled = true, limit = ABOVE_FOLD, preloadRest = true } = {}) {
  const [ready, setReady] = useState(false);

  const batchKey = useMemo(() => {
    const slice = limit ? urls.slice(0, limit) : urls;
    return slice.join('\0');
  }, [urls, limit]);

  useEffect(() => {
    if (!enabled) {
      setReady(true);
      return;
    }

    const batch = limit ? urls.slice(0, limit) : urls;

    if (!batch.length) {
      setReady(true);
      return;
    }

    let cancelled = false;
    setReady(false);

    preloadImages(batch).then(() => {
      if (cancelled) return;
      setReady(true);
      if (preloadRest && urls.length > batch.length) {
        preloadImagesBackground(urls.slice(batch.length));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [batchKey, enabled, limit, preloadRest, urls]);

  return ready;
}

export { ABOVE_FOLD };
