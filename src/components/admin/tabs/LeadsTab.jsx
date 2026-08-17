import { useState, useEffect, useCallback } from 'react';

const SOURCES = [
  { id: 'all', label: 'All' },
  { id: 'chatbot', label: 'Mithi chatbot' },
  { id: 'contact', label: 'Contact form' },
  { id: 'cart', label: 'Cart checkout' },
  { id: 'newsletter', label: 'Newsletter' },
];

const fetchResource = async (resource) => {
  const res = await fetch(`/api/manage-content?resource=${resource}`, { credentials: 'include' });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    if (data.code === 'TABLE_MISSING') return { items: [], missing: data.error };
    throw new Error(data.error || `Failed to load ${resource}`);
  }
  const data = await res.json();
  return {
    items: (data || []).map((row) => ({
      ...row,
      source: resource === 'leads' ? 'chatbot' : resource,
    })),
    missing: null,
  };
};

const LeadsTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [missingTables, setMissingTables] = useState([]);

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setMissingTables([]);

      const results = await Promise.all([
        fetchResource('leads'),
        fetchResource('contact'),
        fetchResource('cart'),
        fetchResource('newsletter'),
      ]);

      const missing = results.map((r) => r.missing).filter(Boolean);
      setMissingTables(missing);

      const merged = results.flatMap((r) => r.items).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setItems(merged);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const markAsRead = async (item) => {
    if (item.source === 'newsletter') return;
    const resource = item.source === 'chatbot' ? 'leads' : item.source;
    try {
      const res = await fetch(`/api/manage-content?resource=${resource}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: item.id, status: 'read' }),
      });
      if (!res.ok) throw new Error('Failed to update');
      loadAll();
    } catch {
      alert('Failed to update status');
    }
  };

  const filtered = filter === 'all'
    ? items
    : items.filter((i) => i.source === filter);

  const sourceLabel = (source) => SOURCES.find((s) => s.id === source)?.label || source;

  if (loading) return <div className="text-center py-10 text-ghibli-wood animate-pulse">Loading inquiries…</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-ghibli-wood/10">
        <div>
          <h2 className="text-2xl font-bold text-ghibli-wood">Inquiries & Leads</h2>
          <p className="text-sm text-ghibli-charcoal/70">Chatbot, contact form, cart orders, and newsletter signups</p>
        </div>
        <button type="button" onClick={loadAll} className="p-2 bg-ghibli-cream rounded-full hover:bg-ghibli-wood/10 transition-colors self-start" title="Refresh">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
      </div>

      {missingTables.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
          <strong>Some tables are missing.</strong> Run <code className="text-xs bg-white/80 px-1 rounded">migrations/2026_08_new_apis.sql</code> in Supabase for contact, cart, and newsletter data.
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {SOURCES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setFilter(s.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              filter === s.id ? 'bg-ghibli-wood text-white' : 'bg-white text-ghibli-charcoal/60 border border-ghibli-wood/10'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-ghibli-wood/10 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-ghibli-charcoal/50">No inquiries in this view.</div>
        ) : (
          <div className="divide-y divide-ghibli-wood/10">
            {filtered.map((item) => (
              <div key={`${item.source}-${item.id}`} className={`p-6 ${item.status === 'new' ? 'bg-amber-50/50' : 'bg-white'}`}>
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-ghibli-wood/10 text-ghibli-wood">
                        {sourceLabel(item.source)}
                      </span>
                      {item.status === 'new' && (
                        <span className="bg-amber-500 text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">New</span>
                      )}
                    </div>
                    <h3 className="font-bold text-ghibli-charcoal">
                      {item.name || item.email || 'Visitor'}
                    </h3>
                    {(item.email || item.contact_info) && (
                      <a href={`mailto:${item.email || item.contact_info}`} className="text-sm text-ghibli-wood hover:underline">
                        {item.email || item.contact_info}
                      </a>
                    )}
                    {item.subject && <p className="text-sm font-medium text-ghibli-charcoal/80 mt-1">{item.subject}</p>}
                  </div>
                  <div className="text-xs text-ghibli-charcoal/50 text-right shrink-0">
                    <div>{new Date(item.created_at).toLocaleDateString()}</div>
                    <div>{new Date(item.created_at).toLocaleTimeString()}</div>
                  </div>
                </div>

                {item.message && (
                  <div className="bg-ghibli-cream/50 p-4 rounded-xl text-sm text-ghibli-charcoal mt-3 whitespace-pre-wrap">
                    {item.message}
                  </div>
                )}

                {item.items && Array.isArray(item.items) && (
                  <div className="bg-ghibli-cream/50 p-4 rounded-xl text-sm mt-3 space-y-1">
                    {item.items.map((line, idx) => (
                      <div key={idx} className="flex justify-between gap-2">
                        <span>{line.title}{line.quantity > 1 ? ` ×${line.quantity}` : ''}</span>
                        {line.price != null && <span className="font-mono text-ghibli-wood">₹{line.price}</span>}
                      </div>
                    ))}
                    {item.total != null && (
                      <div className="pt-2 mt-2 border-t border-ghibli-wood/10 font-bold flex justify-between">
                        <span>Total</span>
                        <span>₹{item.total}</span>
                      </div>
                    )}
                  </div>
                )}

                {item.source !== 'newsletter' && item.status === 'new' && (
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => markAsRead(item)}
                      className="text-xs font-bold text-ghibli-wood hover:text-ghibli-navy bg-white border border-ghibli-wood/20 px-3 py-1.5 rounded-lg"
                    >
                      Mark as read
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsTab;
