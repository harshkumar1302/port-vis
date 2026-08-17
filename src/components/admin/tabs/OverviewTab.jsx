import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { isGalleryListing, isShopListing } from '../../../lib/categoryUtils';

// --- Premium SVG Icons ---
const IconImage = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
    <circle cx="9" cy="9" r="2"/>
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
  </svg>
);

const IconBag = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
    <path d="M3 6h18"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const IconStar = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconCalendar = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
    <line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/>
    <line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);

const IconMessage = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const IconSettings = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const OverviewTab = ({ onNavigate }) => {
  const [stats, setStats] = useState({ gallery: 0, shop: 0, featured: 0, upcoming: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
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
    { label: 'Add gallery piece', desc: 'Portfolio for /gallery', tab: 'gallery', hint: 'Upload view', icon: IconImage },
    { label: 'Add shop product', desc: 'List something for sale', tab: 'shop', hint: 'Add product', icon: IconBag },
    { label: 'View inquiries', desc: 'Contact, cart, chatbot', tab: 'leads', icon: IconMessage },
    { label: 'Site settings', desc: 'Announcement bar, WhatsApp', tab: 'site', hint: 'Manage', icon: IconSettings },
  ];

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      
      {/* Premium Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        
        {/* Gallery Stat */}
        <div className="relative overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60 rounded-[1.25rem] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] group hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-300">
            <IconImage className="w-16 h-16 text-pink-700" />
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <span className="text-pink-700/80 text-[0.65rem] font-extrabold tracking-widest uppercase">Gallery Pieces</span>
            <strong className="text-3xl font-serif text-pink-900 tracking-tight">{loading ? '—' : stats.gallery}</strong>
          </div>
        </div>

        {/* Shop Stat */}
        <div className="relative overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60 rounded-[1.25rem] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] group hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-300">
            <IconBag className="w-16 h-16 text-orange-700" />
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <span className="text-orange-700/80 text-[0.65rem] font-extrabold tracking-widest uppercase">Shop Products</span>
            <strong className="text-3xl font-serif text-orange-900 tracking-tight">{loading ? '—' : stats.shop}</strong>
          </div>
        </div>

        {/* Featured Stat */}
        <div className="relative overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60 rounded-[1.25rem] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] group hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-300">
            <IconStar className="w-16 h-16 text-emerald-700" />
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <span className="text-emerald-700/80 text-[0.65rem] font-extrabold tracking-widest uppercase">Featured</span>
            <strong className="text-3xl font-serif text-emerald-900 tracking-tight">{loading ? '—' : stats.featured}</strong>
          </div>
        </div>

        {/* Upcoming Stat */}
        <div className="relative overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60 rounded-[1.25rem] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] group hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-300">
            <IconCalendar className="w-16 h-16 text-indigo-700" />
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <span className="text-indigo-700/80 text-[0.65rem] font-extrabold tracking-widest uppercase">Upcoming</span>
            <strong className="text-3xl font-serif text-indigo-900 tracking-tight">{loading ? '—' : stats.upcoming}</strong>
          </div>
        </div>

      </div>

      {/* Actionable Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
        {shortcuts.map((s, idx) => {
          const Icon = s.icon;
          return (
            <button
              key={s.tab + idx}
              type="button"
              onClick={() => onNavigate(s.tab)}
              className="group relative flex items-center justify-between p-5 bg-white/60 hover:bg-white backdrop-blur-md border border-white/40 hover:border-ghibli-gold/30 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-ghibli-paper/50 text-ghibli-wood group-hover:bg-ghibli-gold/10 group-hover:text-ghibli-gold transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-ghibli-charcoal font-bold text-[0.95rem] mb-0.5 group-hover:text-ghibli-wood transition-colors">{s.label}</h3>
                  <p className="text-ghibli-charcoal/50 text-[0.75rem] font-medium">{s.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                {s.hint && <span className="text-[0.65rem] font-bold tracking-widest uppercase text-ghibli-gold">{s.hint}</span>}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-ghibli-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      {/* Information Banner */}
      <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-ghibli-gold/10 to-transparent border border-ghibli-gold/20 rounded-2xl">
        <div className="mt-0.5 w-8 h-8 rounded-full bg-white/50 flex items-center justify-center shrink-0">
          <span className="text-lg">✨</span>
        </div>
        <p className="text-[0.85rem] text-ghibli-charcoal/70 leading-relaxed font-medium">
          <strong className="text-ghibli-charcoal font-bold">Gallery</strong> and <strong className="text-ghibli-charcoal font-bold">Shop</strong> are conceptually separate sections.
          Use <span className="px-1.5 py-0.5 rounded bg-white/60 text-ghibli-charcoal font-mono text-[0.7rem] shadow-sm">/gallery</span> for portfolio pieces not directly for sale, and <span className="px-1.5 py-0.5 rounded bg-white/60 text-ghibli-charcoal font-mono text-[0.7rem] shadow-sm">/shop</span> for products with prices.
          Both tabs share the same Add &rarr; Browse &rarr; Categories workflow.
        </p>
      </div>

    </div>
  );
};

export default OverviewTab;
