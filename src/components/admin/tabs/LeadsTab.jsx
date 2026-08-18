import { useState, useEffect, useCallback } from 'react';
import ConfirmDialog from '../ConfirmDialog';

const SOURCES = [
  { id: 'all', label: 'All Inquiries' },
  { id: 'chatbot', label: 'Mithi Chatbot' },
  { id: 'contact', label: 'Contact Form' },
  { id: 'cart', label: 'Cart Checkout' },
  { id: 'newsletter', label: 'Newsletter' },
];

const parseChatbotContact = (contactInfo) => {
  if (!contactInfo) return { phone: '', email: '' };
  try {
    const parsed = JSON.parse(contactInfo);
    if (parsed && typeof parsed === 'object') {
      return {
        phone: parsed.phone || '',
        email: parsed.email || '',
      };
    }
  } catch {
    /* legacy plain-text format */
  }
  if (contactInfo.includes('@')) {
    return { phone: '', email: contactInfo.trim() };
  }
  const digits = contactInfo.replace(/\D/g, '');
  return { phone: digits.length === 10 ? digits : contactInfo.trim(), email: '' };
};

const parseCartContact = (contactInfo) => {
  if (!contactInfo) return { email: '', phone: '', address: '' };
  try {
    const parsed = JSON.parse(contactInfo);
    if (parsed && typeof parsed === 'object') {
      return {
        email: parsed.email || '',
        phone: parsed.phone || '',
        address: parsed.address || '',
      };
    }
  } catch {
    /* legacy plain-text format */
  }
  const email = contactInfo.match(/Email:\s*([^|]+)/)?.[1]?.trim() || '';
  const phone = contactInfo.match(/Phone:\s*([^|]+)/)?.[1]?.trim() || '';
  const address = contactInfo.match(/Address:\s*(.+)/)?.[1]?.trim() || contactInfo;
  return { email, phone, address };
};

const formatCartItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) return '—';
  return items
    .map((line) => `${line.title}${line.quantity > 1 ? ` ×${line.quantity}` : ''}`)
    .join(', ');
};

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
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMissingTables([]);

    try {
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
    let cancelled = false;
    (async () => {
      try {
        const results = await Promise.all([
          fetchResource('leads'),
          fetchResource('contact'),
          fetchResource('cart'),
          fetchResource('newsletter'),
        ]);
        if (cancelled) return;

        const missing = results.map((r) => r.missing).filter(Boolean);
        setMissingTables(missing);

        const merged = results.flatMap((r) => r.items).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setItems(merged);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const markAsRead = async (item) => {
    if (item.source === 'newsletter') return;
    const resource = item.source === 'chatbot' ? 'leads' : item.source;

    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id && i.source === item.source ? { ...i, status: 'read' } : i
      )
    );

    try {
      const res = await fetch(`/api/manage-content?resource=${resource}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: item.id, status: 'read' }),
      });
      if (!res.ok) throw new Error('Failed to update');
    } catch {
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id && i.source === item.source ? { ...i, status: 'new' } : i
        )
      );
      alert('Failed to update status');
    }
  };

  const deleteInquiry = async (item) => {
    const resource = item.source === 'chatbot' ? 'leads' : item.source;
    const previous = items;

    setItems((prev) => prev.filter((i) => !(i.id === item.id && i.source === item.source)));

    try {
      const res = await fetch(`/api/manage-content?resource=${resource}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: item.id }),
      });
      if (!res.ok) throw new Error('Failed to delete');
    } catch {
      setItems(previous);
      alert('Failed to delete inquiry');
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    await deleteInquiry(pendingDelete);
    setDeleting(false);
    setPendingDelete(null);
  };

  const filtered = filter === 'all'
    ? items
    : items.filter((i) => i.source === filter);

  const sourceLabel = (source) => SOURCES.find((s) => s.id === source)?.label || source;

  if (loading) return <div className="text-center py-10 font-bold text-ghibli-charcoal/50 animate-pulse uppercase tracking-widest">Loading inquiries...</div>;
  if (error) return <div className="text-center py-10 text-red-500 font-bold">Error: {error}</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Panel */}
      <div className="card-ghibli p-6 sm:p-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-ghibli-navy mb-1">Inquiries & Leads</h2>
          <p className="text-sm font-semibold text-ghibli-charcoal/60">Manage chatbot conversations, contact messages, cart drop-offs, and newsletter signups.</p>
        </div>
        <button type="button" onClick={loadAll} className="w-10 h-10 shrink-0 bg-white hover:bg-ghibli-cream text-ghibli-wood rounded-full flex items-center justify-center border border-ghibli-wood/10 shadow-sm transition-all" title="Refresh">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
      </div>

      {missingTables.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-900 font-medium">
          <strong>Database Sync Required:</strong> Run <code className="text-xs font-mono bg-white/60 px-1.5 py-0.5 rounded border border-amber-500/10">migrations/2026_08_new_apis.sql</code> in Supabase to enable full functionality.
        </div>
      )}

      {/* Filter Navigation */}
      <div className="flex flex-wrap gap-2">
        {SOURCES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setFilter(s.id)}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all ${
              filter === s.id 
                ? 'bg-ghibli-wood text-white shadow-md' 
                : 'bg-white/60 text-ghibli-charcoal/50 hover:bg-white hover:text-ghibli-charcoal border border-ghibli-wood/10 shadow-sm'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {filter === 'cart' && filtered.length === 0 && (
        <div className="text-center bg-white/40 backdrop-blur-md rounded-3xl p-10 border border-white/30">
          <p className="text-sm font-bold text-ghibli-charcoal/40 uppercase tracking-widest">No cart orders yet.</p>
        </div>
      )}

      {/* Cart orders table */}
      {filter === 'cart' && filtered.length > 0 && (
        <div className="overflow-x-auto rounded-[1.5rem] border border-white/30 bg-white/50 backdrop-blur-xl shadow-sm">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="border-b border-ghibli-wood/10 bg-white/70">
                <th className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-widest text-ghibli-charcoal/50">Date</th>
                <th className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-widest text-ghibli-charcoal/50">Name</th>
                <th className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-widest text-ghibli-charcoal/50">Email</th>
                <th className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-widest text-ghibli-charcoal/50">Phone</th>
                <th className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-widest text-ghibli-charcoal/50">Address</th>
                <th className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-widest text-ghibli-charcoal/50">Items</th>
                <th className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-widest text-ghibli-charcoal/50">Total</th>
                <th className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-widest text-ghibli-charcoal/50">Status</th>
                <th className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-widest text-ghibli-charcoal/50">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const contact = parseCartContact(item.contact_info);
                return (
                  <tr key={item.id} className="border-b border-ghibli-wood/5 hover:bg-white/60 transition-colors">
                    <td className="px-4 py-3 align-top whitespace-nowrap text-xs font-semibold text-ghibli-charcoal/60">
                      {new Date(item.created_at).toLocaleDateString()}<br />
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 align-top font-bold text-ghibli-charcoal">{item.name || '—'}</td>
                    <td className="px-4 py-3 align-top text-ghibli-charcoal/80">{contact.email || '—'}</td>
                    <td className="px-4 py-3 align-top text-ghibli-charcoal/80 whitespace-nowrap">{contact.phone || '—'}</td>
                    <td className="px-4 py-3 align-top text-ghibli-charcoal/80 max-w-[220px]">{contact.address || '—'}</td>
                    <td className="px-4 py-3 align-top text-ghibli-charcoal/80 max-w-[240px]">{formatCartItems(item.items)}</td>
                    <td className="px-4 py-3 align-top font-bold text-ghibli-wood whitespace-nowrap">
                      {item.total != null ? `₹${Number(item.total).toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md ${
                        item.status === 'new'
                          ? 'bg-amber-400/20 text-amber-700'
                          : 'bg-ghibli-wood/10 text-ghibli-charcoal/50'
                      }`}>
                        {item.status === 'new' ? 'New' : 'Read'}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col gap-2">
                        {item.status === 'new' && (
                          <button
                            type="button"
                            onClick={() => markAsRead(item)}
                            className="text-[10px] font-extrabold uppercase tracking-widest text-ghibli-wood hover:text-ghibli-navy transition-colors text-left"
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setPendingDelete(item)}
                          className="text-[10px] font-extrabold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors text-left"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Inquiries List */}
      <div className={`space-y-4 ${filter === 'cart' ? 'hidden' : ''}`}>
        {filtered.length === 0 ? (
          <div className="text-center bg-white/40 backdrop-blur-md rounded-3xl p-10 border border-white/30">
            <p className="text-sm font-bold text-ghibli-charcoal/40 uppercase tracking-widest">No inquiries match this filter.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div key={`${item.source}-${item.id}`} className={`relative group bg-white/40 backdrop-blur-xl border ${item.status === 'new' ? 'border-amber-400/30 shadow-md' : 'border-white/20 shadow-sm hover:shadow-md'} rounded-[1.5rem] p-6 transition-all`}>
              
              {/* Unread Indicator */}
              {item.status === 'new' && (
                 <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-10 bg-amber-400 rounded-r-lg shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-lg bg-ghibli-wood/10 text-ghibli-wood border border-ghibli-wood/5">
                      {sourceLabel(item.source)}
                    </span>
                    {item.status === 'new' && (
                      <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-lg bg-amber-400/20 text-amber-700 border border-amber-400/20">
                        Unread
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-ghibli-charcoal">
                    {item.name || item.email || 'Anonymous Visitor'}
                  </h3>
                  {item.source === 'chatbot' ? (() => {
                    const { phone, email } = parseChatbotContact(item.contact_info);
                    return (
                      <div className="flex flex-col gap-1 mt-1">
                        {phone && (
                          <a href={`tel:+91${phone}`} className="text-sm font-semibold text-ghibli-wood hover:text-ghibli-navy transition-colors inline-flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                            +91 {phone}
                          </a>
                        )}
                        {email && (
                          <a href={`mailto:${email}`} className="text-sm font-semibold text-ghibli-wood hover:text-ghibli-navy transition-colors inline-flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                            {email}
                          </a>
                        )}
                      </div>
                    );
                  })() : (item.email || item.contact_info) && (
                    <a href={`mailto:${item.email || item.contact_info}`} className="text-sm font-semibold text-ghibli-wood hover:text-ghibli-navy transition-colors inline-flex items-center gap-1.5 mt-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      {item.email || item.contact_info}
                    </a>
                  )}
                  {item.subject && <p className="text-sm font-bold text-ghibli-charcoal/70 mt-2 bg-white/50 inline-block px-3 py-1 rounded-md border border-white/60">Subject: {item.subject}</p>}
                </div>
                
                <div className="text-xs font-bold text-ghibli-charcoal/40 uppercase tracking-wider text-right shrink-0 flex flex-col gap-1">
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  <span>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Message Content */}
              {item.message && (
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/60 shadow-inner text-sm font-medium text-ghibli-charcoal leading-relaxed whitespace-pre-wrap">
                  {item.message}
                </div>
              )}

              {/* Cart Items */}
              {item.items && Array.isArray(item.items) && (
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/60 shadow-inner text-sm mt-3 space-y-2">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-ghibli-charcoal/50 mb-3 border-b border-ghibli-wood/10 pb-2">Cart Contents</h4>
                  {item.items.map((line, idx) => (
                    <div key={idx} className="flex justify-between items-center gap-4">
                      <span className="font-semibold text-ghibli-charcoal flex-1">{line.title}</span>
                      {line.quantity > 1 && <span className="text-ghibli-charcoal/50 font-bold bg-ghibli-wood/10 px-2 py-0.5 rounded-md text-[10px]">Qty: {line.quantity}</span>}
                      {line.price != null && <span className="font-bold text-ghibli-wood min-w-[70px] text-right">₹{(line.price * line.quantity).toLocaleString()}</span>}
                    </div>
                  ))}
                  {item.total != null && (
                    <div className="pt-3 mt-3 border-t border-ghibli-wood/10 flex justify-between items-center">
                      <span className="font-extrabold text-ghibli-charcoal uppercase tracking-wider text-xs">Total Estimated</span>
                      <span className="font-extrabold text-lg text-ghibli-navy">₹{item.total.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Bar */}
              <div className="mt-5 flex justify-end gap-2">
                {item.source !== 'newsletter' && item.status === 'new' && (
                  <button
                    type="button"
                    onClick={() => markAsRead(item)}
                    className="px-5 py-2 text-[0.65rem] font-extrabold uppercase tracking-widest text-ghibli-wood bg-white hover:bg-ghibli-cream border border-ghibli-wood/20 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    Mark as Read
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPendingDelete(item)}
                  className="px-5 py-2 text-[0.65rem] font-extrabold uppercase tracking-widest text-red-600 bg-white hover:bg-red-50 border border-red-200 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete inquiry?"
        message="This inquiry will be permanently removed. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setPendingDelete(null)}
        loading={deleting}
      />
    </div>
  );
};

export default LeadsTab;
