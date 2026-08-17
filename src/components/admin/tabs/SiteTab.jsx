import { useState, useEffect } from 'react';
import { ANNOUNCEMENT_UPDATE_EVENT } from '../../../hooks/useAnnouncementBar';
import { fetchSiteSetting } from '../../../lib/fetchSettings';

const SiteTab = () => {
  const [announcement, setAnnouncement] = useState({ enabled: true, items: [] });
  const [contact, setContact] = useState({ instagram_url: '', whatsapp_number: '', whatsapp_message_template: '' });
  const [stats, setStats] = useState({ handmade_pct: 100, happy_homes: 500, rating: 5 });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchSiteSetting('announcement_bar', { enabled: true, items: [] }),
      fetchSiteSetting('contact_channels', { instagram_url: '', whatsapp_number: '', whatsapp_message_template: '' }),
      fetchSiteSetting('hero_stats', { handmade_pct: 100, happy_homes: 500, rating: 5 }),
    ]).then(([ann, con, st]) => {
      if (ann) setAnnouncement(ann);
      if (con) setContact(con);
      if (st) setStats(st);
    }).catch(console.error);
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

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await saveSetting('announcement_bar', announcement);
      await saveSetting('contact_channels', contact);
      await saveSetting('hero_stats', stats);
      window.dispatchEvent(new Event(ANNOUNCEMENT_UPDATE_EVENT));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateAnnouncementItem = (index, field, value) => {
    const items = [...announcement.items];
    items[index] = { ...items[index], [field]: value };
    setAnnouncement({ ...announcement, items });
  };

  const addAnnouncementItem = () => {
    setAnnouncement({
      ...announcement,
      items: [...(announcement.items || []), { icon: '✨', text: 'New announcement' }],
    });
  };

  const removeAnnouncementItem = (index) => {
    const items = announcement.items.filter((_, i) => i !== index);
    setAnnouncement({ ...announcement, items });
  };

  return (
    <div className="space-y-8">
      <div className="card-ghibli p-6 sm:p-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem] space-y-6">
        <h2 className="text-2xl font-bold text-ghibli-navy">Announcement Bar</h2>
        <label className="flex items-center gap-2 text-sm font-bold text-ghibli-charcoal/70">
          <input type="checkbox" checked={announcement.enabled !== false} onChange={e => setAnnouncement({ ...announcement, enabled: e.target.checked })} />
          Show announcement bar
        </label>
        {(announcement.items || []).map((item, i) => (
          <div key={i} className="flex gap-3 items-center">
            <input value={item.icon} onChange={e => updateAnnouncementItem(i, 'icon', e.target.value)} className="w-16 p-2 rounded-lg border border-ghibli-wood/10 text-center" placeholder="🎁" />
            <input value={item.text} onChange={e => updateAnnouncementItem(i, 'text', e.target.value)} className="flex-1 p-3 rounded-xl border border-ghibli-wood/10 bg-white/50" />
            <button onClick={() => removeAnnouncementItem(i)} className="text-red-500 font-bold px-2">✕</button>
          </div>
        ))}
        <button onClick={addAnnouncementItem} className="text-sm font-bold text-ghibli-wood">+ Add announcement</button>
        <p className="text-xs text-ghibli-charcoal/50">Click <strong>Save Site Settings</strong> below — changes won&apos;t appear on the live site until saved.</p>
      </div>

      <div className="card-ghibli p-6 sm:p-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem] space-y-4">
        <h2 className="text-2xl font-bold text-ghibli-navy">Contact Channels</h2>
        <div>
          <label className="block text-sm font-bold mb-1 text-ghibli-charcoal/70">Instagram URL</label>
          <input value={contact.instagram_url || ''} onChange={e => setContact({ ...contact, instagram_url: e.target.value })} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1 text-ghibli-charcoal/70">WhatsApp Number (with country code)</label>
          <input value={contact.whatsapp_number || ''} onChange={e => setContact({ ...contact, whatsapp_number: e.target.value })} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50" placeholder="" />
          <p className="text-xs text-ghibli-charcoal/50 mt-1">Powers WhatsApp buttons, cart checkout, and contact page when set. Include country code (e.g. 91…).</p>
        </div>
        <div>
          <label className="block text-sm font-bold mb-1 text-ghibli-charcoal/70">WhatsApp Message Template (use {'{title}'})</label>
          <textarea value={contact.whatsapp_message_template || ''} onChange={e => setContact({ ...contact, whatsapp_message_template: e.target.value })} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 h-20" />
        </div>
      </div>

      <div className="card-ghibli p-6 sm:p-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem] space-y-4">
        <h2 className="text-2xl font-bold text-ghibli-navy">Stats (Why Visheshkala)</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1 text-ghibli-charcoal/70">Handmade %</label>
            <input type="number" value={stats.handmade_pct ?? 100} onChange={e => setStats({ ...stats, handmade_pct: Number(e.target.value) })} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 text-ghibli-charcoal/70">Happy Homes</label>
            <input type="number" value={stats.happy_homes ?? 500} onChange={e => setStats({ ...stats, happy_homes: Number(e.target.value) })} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 text-ghibli-charcoal/70">Rating</label>
            <input type="number" min="1" max="5" value={stats.rating ?? 5} onChange={e => setStats({ ...stats, rating: Number(e.target.value) })} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50" />
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${success ? 'bg-green-500 text-white' : 'bg-ghibli-wood text-ghibli-cream hover:bg-[#A0704F]'}`}>
        {saving ? 'Saving...' : success ? '✨ Saved!' : 'Save Site Settings'}
      </button>
    </div>
  );
};

export default SiteTab;
