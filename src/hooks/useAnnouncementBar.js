import { useState, useEffect, useCallback } from 'react';
import { fetchSiteSetting } from '../lib/fetchSettings';

export const ANNOUNCEMENT_UPDATE_EVENT = 'announcement-bar-updated';

const DEFAULT = { enabled: true, items: [] };

export const useAnnouncementBar = () => {
  const [settings, setSettings] = useState(DEFAULT);
  const [loaded, setLoaded] = useState(false);

  const reload = useCallback(async () => {
    const value = await fetchSiteSetting('announcement_bar', DEFAULT);
    setSettings(value || DEFAULT);
    setLoaded(true);
  }, []);

  useEffect(() => {
    reload();
    const onUpdate = () => reload();
    window.addEventListener(ANNOUNCEMENT_UPDATE_EVENT, onUpdate);
    return () => window.removeEventListener(ANNOUNCEMENT_UPDATE_EVENT, onUpdate);
  }, [reload]);

  const isVisible =
    loaded && settings.enabled !== false && (settings.items?.length ?? 0) > 0;

  return { enabled: settings.enabled !== false, items: settings.items || [], isVisible, reload };
};

export default useAnnouncementBar;
