import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { isGalleryListing, isShopListing } from '../../../lib/categoryUtils';

const OverviewTab = ({ onNavigate }) => {
  const [stats, setStats] = useState({ gallery: 0, shop: 0, featured: 0, upcoming: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // Match Gallery/Shop tabs: select('*') so missing optional columns (e.g. listing_type) don't break the query
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Overview stats failed:', error);
        setLoading(false);
        return;
      }

      const rows = data || [];
      const gallery = rows.filter(isGalleryListing).length;
      const shop = rows.filter(isShopListing).length;
      const featured = rows.filter((a) => a.is_featured).length;
      const upcoming = rows.filter((a) => a.category === 'Upcoming').length;
      setStats({ gallery, shop, featured, upcoming });
      setLoading(false);
    };
    load();
  }, []);

  const shortcuts = [
    { label: 'Add gallery piece', desc: 'Portfolio for /gallery', tab: 'gallery', hint: 'Upload view' },
    { label: 'Add shop product', desc: 'List something for sale', tab: 'shop', hint: 'Add product' },
    { label: 'View inquiries', desc: 'Contact, cart, chatbot', tab: 'leads' },
    { label: 'Site settings', desc: 'Announcement bar, WhatsApp', tab: 'site' },
  ];

  return (
    <div className="admin-overview animate-in fade-in duration-300">
      <div className="admin-stat-grid">
        <div className="admin-stat-card admin-stat-card-pink">
          <strong>{loading ? '—' : stats.gallery}</strong>
          <span>Gallery pieces</span>
        </div>
        <div className="admin-stat-card admin-stat-card-orange">
          <strong>{loading ? '—' : stats.shop}</strong>
          <span>Shop products</span>
        </div>
        <div className="admin-stat-card admin-stat-card-green">
          <strong>{loading ? '—' : stats.featured}</strong>
          <span>Featured</span>
        </div>
        <div className="admin-stat-card admin-stat-card-purple">
          <strong>{loading ? '—' : stats.upcoming}</strong>
          <span>Upcoming</span>
        </div>
      </div>

      <div className="admin-shortcut-grid">
        {shortcuts.map((s) => (
          <button
            key={s.tab + s.label}
            type="button"
            onClick={() => onNavigate(s.tab)}
            className="admin-shortcut-card"
          >
            <span className="admin-shortcut-label">{s.label}</span>
            <span className="admin-shortcut-desc">{s.desc}</span>
            {s.hint && <span className="admin-shortcut-hint">{s.hint} →</span>}
          </button>
        ))}
      </div>

      <div className="admin-tip card-ghibli p-5 bg-white/40 border border-white/20 rounded-2xl">
        <p className="text-sm text-ghibli-charcoal/70 leading-relaxed">
          <strong className="text-ghibli-navy">Gallery</strong> and <strong className="text-ghibli-navy">Shop</strong> are separate.
          Use Gallery for portfolio work on <code className="text-xs">/gallery</code>.
          Use Shop for products with price on <code className="text-xs">/shop</code>.
          Both tabs have <em>Add → Browse → Categories</em>.
        </p>
      </div>
    </div>
  );
};

export default OverviewTab;
