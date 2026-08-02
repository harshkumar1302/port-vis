import { useState, useEffect } from 'react';
import { fetchSiteSetting } from '../lib/fetchSettings';

const STORAGE_KEY = 'visheshkala_announcement_dismissed';

const AnnouncementBar = () => {
  const [items, setItems] = useState([]);
  const [enabled, setEnabled] = useState(true);
  const [dismissed, setDismissed] = useState(() =>
    typeof window !== 'undefined' && sessionStorage.getItem(STORAGE_KEY) === '1'
  );

  useEffect(() => {
    fetchSiteSetting('announcement_bar', null).then((value) => {
      if (value) {
        setEnabled(value.enabled !== false);
        setItems(value.items || []);
      }
    });
  }, []);

  if (dismissed || !enabled || items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <div className="fixed top-0 left-0 right-0 z-[110] bg-gold-gradient text-white text-[10px] font-bold tracking-[0.2em] uppercase overflow-hidden shadow-soft">
      <div className="flex items-center h-7">
        <div className="flex-1 overflow-hidden relative">
          <div className="flex animate-marquee whitespace-nowrap">
            {doubled.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2 px-8">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
