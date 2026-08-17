import { useState, useEffect } from 'react';
import { ANNOUNCEMENT_UPDATE_EVENT } from '../../../hooks/useAnnouncementBar';
import { HERO_BANNER_UPDATE_EVENT } from '../../../hooks/useHeroBanner';
import { DEFAULT_HERO_BANNER } from '../../../constants/heroBanners';
import { fetchSiteSetting } from '../../../lib/fetchSettings';
import { supabase } from '../../../lib/supabaseClient';
import ImageDropzone from '../ImageDropzone';

const SiteTab = () => {
  const [announcement, setAnnouncement] = useState({ enabled: true, items: [] });
  const [contact, setContact] = useState({ instagram_url: '', whatsapp_number: '', whatsapp_message_template: '' });
  const [stats, setStats] = useState({ handmade_pct: 100, happy_homes: 500, rating: 5 });
  const [heroBanner, setHeroBanner] = useState(DEFAULT_HERO_BANNER);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchSiteSetting('announcement_bar', { enabled: true, items: [] }),
      fetchSiteSetting('contact_channels', { instagram_url: '', whatsapp_number: '', whatsapp_message_template: '' }),
      fetchSiteSetting('hero_stats', { handmade_pct: 100, happy_homes: 500, rating: 5 }),
      fetchSiteSetting('hero_banner', DEFAULT_HERO_BANNER),
    ]).then(([ann, con, st, banner]) => {
      if (ann) setAnnouncement({ ...ann, items: ann.items || [] });
      if (con) setContact(con);
      if (st) setStats(st);
      if (banner) setHeroBanner(banner);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const saveSetting = async (id, value) => {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id, value }),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
  };

  const uploadBannerFile = async (file) => {
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `hero-banners/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('artworks').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('artworks').getPublicUrl(filePath);
    return publicUrl;
  };

  const handleBannerFile = (file) => {
    if (bannerPreview.startsWith('blob:')) URL.revokeObjectURL(bannerPreview);
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const clearBannerFile = () => {
    if (bannerPreview.startsWith('blob:')) URL.revokeObjectURL(bannerPreview);
    setBannerFile(null);
    setBannerPreview('');
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      let bannerToSave = { ...heroBanner };
      if (bannerFile) {
        bannerToSave = { ...bannerToSave, src: await uploadBannerFile(bannerFile) };
        setHeroBanner(bannerToSave);
        clearBannerFile();
      }

      await saveSetting('announcement_bar', announcement);
      await saveSetting('contact_channels', contact);
      await saveSetting('hero_stats', stats);
      await saveSetting('hero_banner', bannerToSave);
      window.dispatchEvent(new Event(ANNOUNCEMENT_UPDATE_EVENT));
      window.dispatchEvent(new Event(HERO_BANNER_UPDATE_EVENT));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateAnnouncementItem = (index, field, value) => {
    const items = [...(announcement.items || [])];
    items[index] = { ...items[index], [field]: value };
    setAnnouncement({ ...announcement, items });
  };

  const addAnnouncementItem = () => {
    setAnnouncement({
      ...announcement,
      items: [...(announcement.items || []), { icon: '✨', text: '' }],
    });
  };

  const removeAnnouncementItem = (index) => {
    const items = (announcement.items || []).filter((_, i) => i !== index);
    setAnnouncement({ ...announcement, items });
  };

  if (loading) return <div className="text-center py-10 font-bold text-ghibli-charcoal/50 animate-pulse uppercase tracking-widest">Loading configuration...</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="card-ghibli p-6 sm:p-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-ghibli-navy mb-1">Site Settings</h2>
          <p className="text-sm font-semibold text-ghibli-charcoal/60">Manage homepage banner, announcements, contact channels, and hero statistics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Announcement Bar Settings */}
        <div className="card-ghibli p-6 sm:p-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-ghibli-charcoal">Announcement Bar</h3>
            <label className="flex items-center gap-3 cursor-pointer group">
              <span className="text-xs font-bold text-ghibli-charcoal/70 uppercase tracking-widest group-hover:text-ghibli-charcoal transition-colors">Enabled</span>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${announcement.enabled !== false ? 'bg-ghibli-wood' : 'bg-ghibli-wood/20'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${announcement.enabled !== false ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
              <input type="checkbox" checked={announcement.enabled !== false} onChange={e => setAnnouncement({ ...announcement, enabled: e.target.checked })} className="sr-only" />
            </label>
          </div>
          
          <div className={`space-y-4 transition-all duration-500 ${announcement.enabled === false ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
            {(announcement.items || []).length === 0 ? (
               <div className="text-center py-6 border border-dashed border-ghibli-wood/20 rounded-xl bg-white/30">
                 <p className="text-sm font-semibold text-ghibli-charcoal/50 mb-3">No announcements added.</p>
                 <button onClick={addAnnouncementItem} className="px-4 py-2 bg-ghibli-wood/10 hover:bg-ghibli-wood/20 text-ghibli-wood rounded-lg font-bold text-xs uppercase tracking-widest transition-colors">+ Add Item</button>
               </div>
            ) : (
              <div className="space-y-3">
                {(announcement.items || []).map((item, i) => (
                  <div key={i} className="flex gap-3 items-center bg-white/50 p-2 rounded-xl border border-white/60 shadow-sm relative group">
                    <input 
                      value={item.icon} 
                      onChange={e => updateAnnouncementItem(i, 'icon', e.target.value)} 
                      className="w-12 h-10 rounded-lg border border-ghibli-wood/10 bg-white text-center focus:border-ghibli-wood/40 outline-none transition-colors shrink-0 text-lg" 
                      placeholder="✨" 
                    />
                    <input 
                      value={item.text} 
                      onChange={e => updateAnnouncementItem(i, 'text', e.target.value)} 
                      className="flex-1 h-10 px-4 rounded-lg border border-ghibli-wood/10 bg-white focus:border-ghibli-wood/40 outline-none transition-colors text-sm font-medium text-ghibli-charcoal" 
                      placeholder="e.g. Free Shipping on orders over ₹999" 
                    />
                    <button 
                      onClick={() => removeAnnouncementItem(i)} 
                      className="w-10 h-10 flex items-center justify-center text-ghibli-charcoal/30 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                      title="Remove Item"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
                <div className="pt-2">
                   <button onClick={addAnnouncementItem} className="flex items-center gap-2 text-xs font-bold text-ghibli-wood hover:text-ghibli-navy transition-colors px-2 py-1">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                     Add Another Announcement
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Homepage Banner */}
        <div className="card-ghibli p-6 sm:p-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-ghibli-charcoal mb-1">Homepage Banner</h3>
            <p className="text-xs font-semibold text-ghibli-charcoal/50">
              Upload a wide banner for the home page. Best size: 2078×640 px (PNG or JPG).
            </p>
          </div>

          <ImageDropzone
            previewUrl={bannerPreview || heroBanner.src || ''}
            onFile={handleBannerFile}
            onClear={bannerPreview ? clearBannerFile : null}
            aspectRatio="aspect-[2078/640]"
          />

          {bannerFile && (
            <p className="text-xs font-semibold text-ghibli-wood">
              New banner selected — click Save All Settings to upload and publish.
            </p>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-ghibli-charcoal/70">
              Or paste image URL
            </label>
            <input
              value={heroBanner.src || ''}
              onChange={(e) => setHeroBanner({ ...heroBanner, src: e.target.value })}
              className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/80 focus:border-ghibli-wood/40 outline-none text-sm font-semibold"
              placeholder="/hero-banner.png or https://..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-ghibli-charcoal/70">Alt text</label>
            <input
              value={heroBanner.alt || ''}
              onChange={(e) => setHeroBanner({ ...heroBanner, alt: e.target.value })}
              className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/80 focus:border-ghibli-wood/40 outline-none text-sm font-semibold"
              placeholder="Describe the banner for accessibility"
            />
          </div>
        </div>

        {/* Contact Channels */}
        <div className="card-ghibli p-6 sm:p-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-ghibli-charcoal mb-1">Contact Channels</h3>
            <p className="text-xs font-semibold text-ghibli-charcoal/50">Used across the site (footer, contact page, cart).</p>
          </div>
          
          <div className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-ghibli-charcoal/70">Instagram URL</label>
              <input 
                value={contact.instagram_url || ''} 
                onChange={e => setContact({ ...contact, instagram_url: e.target.value })} 
                className="w-full p-4 rounded-xl border border-ghibli-wood/10 bg-white/60 focus:bg-white focus:border-ghibli-wood/40 transition-colors outline-none text-sm font-semibold" 
                placeholder="https://instagram.com/visheshkala"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-ghibli-charcoal/70">WhatsApp Number</label>
              <input 
                value={contact.whatsapp_number || ''} 
                onChange={e => setContact({ ...contact, whatsapp_number: e.target.value })} 
                className="w-full p-4 rounded-xl border border-ghibli-wood/10 bg-white/60 focus:bg-white focus:border-ghibli-wood/40 transition-colors outline-none text-sm font-semibold" 
                placeholder="e.g. 919876543210" 
              />
              <p className="text-xs text-ghibli-charcoal/50 font-medium">Include country code without the + (e.g. 91 for India).</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-ghibli-charcoal/70 flex items-center gap-2">
                WhatsApp Message Template 
                <span className="bg-ghibli-wood/10 text-ghibli-wood px-1.5 py-0.5 rounded uppercase tracking-wider text-[9px]">{`{title}`}</span>
              </label>
              <textarea 
                value={contact.whatsapp_message_template || ''} 
                onChange={e => setContact({ ...contact, whatsapp_message_template: e.target.value })} 
                className="w-full p-4 rounded-xl border border-ghibli-wood/10 bg-white/60 focus:bg-white focus:border-ghibli-wood/40 transition-colors outline-none text-sm font-semibold h-24 resize-none" 
                placeholder="Hi! I am interested in {title}. Could you share more details?"
              />
            </div>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="card-ghibli p-6 sm:p-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-ghibli-charcoal mb-1">Hero Statistics</h3>
            <p className="text-xs font-semibold text-ghibli-charcoal/50">Display stats on the home page hero section.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2 bg-white/40 p-4 rounded-2xl border border-white/60 shadow-sm">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-ghibli-charcoal/70">Handmade %</label>
              <div className="flex items-center gap-2">
                <input type="number" value={stats.handmade_pct ?? 100} onChange={e => setStats({ ...stats, handmade_pct: Number(e.target.value) })} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/80 focus:border-ghibli-wood/40 outline-none font-bold text-lg text-center" />
                <span className="font-bold text-ghibli-charcoal/40 text-lg">%</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 bg-white/40 p-4 rounded-2xl border border-white/60 shadow-sm">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-ghibli-charcoal/70">Happy Homes</label>
              <div className="flex items-center gap-2">
                <input type="number" value={stats.happy_homes ?? 500} onChange={e => setStats({ ...stats, happy_homes: Number(e.target.value) })} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/80 focus:border-ghibli-wood/40 outline-none font-bold text-lg text-center" />
                <span className="font-bold text-ghibli-charcoal/40 text-lg">+</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 bg-white/40 p-4 rounded-2xl border border-white/60 shadow-sm">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-ghibli-charcoal/70">Rating (1-5)</label>
              <div className="flex items-center gap-2">
                <input type="number" min="1" max="5" step="0.1" value={stats.rating ?? 5} onChange={e => setStats({ ...stats, rating: Number(e.target.value) })} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/80 focus:border-ghibli-wood/40 outline-none font-bold text-lg text-center" />
                <span className="font-bold text-[#fbbc04] text-lg">★</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 sm:left-64 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-ghibli-wood/10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40 flex justify-end items-center gap-4 px-8">
        {success && (
          <span className="text-sm font-bold text-green-600 flex items-center gap-2 animate-fade-in">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            Settings saved successfully!
          </span>
        )}
        <button 
          onClick={handleSave} 
          disabled={saving} 
          className={`px-8 py-3.5 rounded-xl font-extrabold text-[0.75rem] uppercase tracking-widest transition-all shadow-md hover:shadow-lg flex items-center gap-2 ${
            success ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-ghibli-wood text-white hover:bg-ghibli-navy shadow-ghibli-wood/20'
          }`}
        >
          {saving ? (
            <>
              <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Saving...
            </>
          ) : success ? (
            <>Saved ✨</>
          ) : (
            'Save All Settings'
          )}
        </button>
      </div>
    </div>
  );
};

export default SiteTab;
