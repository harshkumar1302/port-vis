import { useState, useEffect, useCallback } from 'react';
import { fetchSiteSetting } from '../lib/fetchSettings';

export const ANNOUNCEMENT_UPDATE_EVENT = 'announcement-bar-updated';
const CACHE_KEY = 'visheshkala_announcement_cache';
const DEFAULT = { enabled: true, items: [] };

const readCache = () => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAnnouncementBar = () => {
  const [settings, setSettings] = useState(() => readCache() || DEFAULT);

  const reload = useCallback(async () => {
    const value = await fetchSiteSetting('announcement_bar', DEFAULT);
    const next = value || DEFAULT;
    setSettings(next);
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota errors */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = () => {
      if (!cancelled) reload();
    };

    const idleId =
      typeof requestIdleCallback === 'function'
        ? requestIdleCallback(run, { timeout: 4000 })
        : window.setTimeout(run, 1500);

    const onUpdate = () => reload();
    window.addEventListener(ANNOUNCEMENT_UPDATE_EVENT, onUpdate);

    return () => {
      cancelled = true;
      if (typeof cancelIdleCallback === 'function') cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
      window.removeEventListener(ANNOUNCEMENT_UPDATE_EVENT, onUpdate);
    };
  }, [reload]);

  const isVisible =
    settings.enabled !== false && (settings.items?.length ?? 0) > 0;

  return { enabled: settings.enabled !== false, items: settings.items || [], isVisible, reload };
};

export default useAnnouncementBar;
