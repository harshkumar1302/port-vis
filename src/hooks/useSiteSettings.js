import { useState, useEffect } from 'react';
import { fetchSiteSetting } from '../lib/fetchSettings';

export const useSiteSetting = (id, fallback = null) => {
  const [value, setValue] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const result = await fetchSiteSetting(id, fallback);
      if (!cancelled) setValue(result);
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  return { value, loading };
};

export default useSiteSetting;
