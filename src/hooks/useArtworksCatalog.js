import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const ARTWORK_COLUMNS =
  'id, title, description, category, image_url, price, original_price, stock, is_bestseller, is_new, is_featured, sub_category, sort_order, listing_type, created_at';

let cache = null;
let inflight = null;

/** Shared artworks fetch — one network round-trip per session. */
export async function fetchArtworksCatalog() {
  if (cache) return cache;
  if (inflight) return inflight;

  inflight = supabase
    .from('artworks')
    .select(ARTWORK_COLUMNS)
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
}

export function useArtworksCatalog() {
  const [artworks, setArtworks] = useState(() => cache || []);
  const [loading, setLoading] = useState(() => !cache);

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
    return () => {
      cancelled = true;
    };
  }, []);

  return { artworks, loading };
}
