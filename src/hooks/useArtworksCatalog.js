import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export const ARTWORKS_CACHE_EVENT = 'artworks-cache-invalidate';

let cache = null;
let inflight = null;

/** Shared artworks fetch — one network round-trip per session. */
export async function fetchArtworksCatalog() {
  if (cache) return cache;
  if (inflight) return inflight;

  inflight = supabase
    .from('artworks')
    .select('*')
    .order('created_at', { ascending: false })
    .then(({ data, error }) => {
      if (error) throw error;
      cache = data || [];
      return cache;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function invalidateArtworksCache() {
  cache = null;
  inflight = null;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(ARTWORKS_CACHE_EVENT));
  }
}

export function useArtworksCatalog() {
  const [artworks, setArtworks] = useState(() => cache || []);
  const [loading, setLoading] = useState(() => !cache);

  const reload = useCallback(async () => {
    cache = null;
    inflight = null;
    setLoading(true);
    try {
      const rows = await fetchArtworksCatalog();
      setArtworks(rows);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchArtworksCatalog()
      .then((rows) => {
        if (!cancelled) setArtworks(rows);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    const onInvalidate = () => {
      if (!cancelled) reload();
    };
    window.addEventListener(ARTWORKS_CACHE_EVENT, onInvalidate);

    return () => {
      cancelled = true;
      window.removeEventListener(ARTWORKS_CACHE_EVENT, onInvalidate);
    };
  }, [reload]);

  return { artworks, loading, reload };
}
