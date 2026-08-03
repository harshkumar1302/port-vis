import { useEffect, useMemo, useRef, useState } from 'react';
import { isImageLoaded } from '../lib/imageCache';
import { usePreloadedImages, ABOVE_FOLD } from './usePreloadedImages';

/**
 * Flipkart-style gate: preload images first, brief skeleton, then reveal.
 */
export function usePageReady(
  urls,
  { enabled = true, minDuration = 320, limit, preloadRest = true } = {}
) {
  const batch = useMemo(() => {
    const slice = limit ? urls.slice(0, limit) : urls;
    return slice;
  }, [urls, limit]);

  const imagesReady = usePreloadedImages(urls, {
    enabled,
    limit: limit ?? undefined,
    preloadRest,
  });

  const [revealed, setRevealed] = useState(() => !enabled || batch.length === 0);
  const startedAt = useRef(Date.now());

  const allCached = useMemo(
    () => batch.length > 0 && batch.every((url) => isImageLoaded(url)),
    [batch]
  );

  useEffect(() => {
    if (!enabled || batch.length === 0) {
      setRevealed(true);
      return;
    }

    if (!imagesReady) {
      setRevealed(false);
      startedAt.current = Date.now();
      return;
    }

    const wait = allCached ? 0 : minDuration;
    const elapsed = Date.now() - startedAt.current;
    const remaining = Math.max(0, wait - elapsed);

    const timer = window.setTimeout(() => setRevealed(true), remaining);
    return () => window.clearTimeout(timer);
  }, [imagesReady, enabled, batch.length, minDuration, allCached]);

  const loading = enabled && batch.length > 0 && !revealed;

  return { ready: revealed, loading, imagesReady };
}

export { ABOVE_FOLD };
export default usePageReady;
