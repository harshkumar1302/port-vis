import { useState, useEffect } from 'react';

const LeadsTab = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch('/api/manage-leads', { credentials: 'include' });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                if (data.code === 'TABLE_MISSING') {
                    setLeads([]);
                    setError('Leads table not set up yet. Run migrations/2026_08_chatbot_leads.sql in Supabase SQL Editor.');
                    return;
                }
                throw new Error(data.error || 'Failed to fetch leads');
            }
            const data = await res.json();
            setLeads(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const markAsRead = async (id) => {
        try {
            const res = await fetch('/api/manage-leads', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id, status: 'read' }),
            });
            if (!res.ok) throw new Error('Failed to update status');
            fetchLeads();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="text-center py-10 text-ghibli-wood animate-pulse">Loading leads...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-ghibli-wood/10">
                <div>
                    <h2 className="text-2xl font-bold text-ghibli-wood">Inquiries & Leads</h2>
                    <p className="text-sm text-ghibli-charcoal/70">Notes sent through Mithi on the site</p>
                </div>
                <button onClick={fetchLeads} className="p-2 bg-ghibli-cream rounded-full hover:bg-ghibli-wood/10 transition-colors" title="Refresh">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-ghibli-wood/10 overflow-hidden">
                {leads.length === 0 ? (
                    <div className="p-10 text-center text-ghibli-charcoal/50">No leads found.</div>
                ) : (
                    <div className="divide-y divide-ghibli-wood/10">
                        {leads.map(lead => (
                            <div key={lead.id} className={`p-6 transition-colors ${lead.status === 'new' ? 'bg-amber-50/50' : 'bg-white'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-ghibli-charcoal flex items-center gap-2">
                                            {lead.name}
                                            {lead.status === 'new' && <span className="bg-amber-500 text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">New</span>}
                                        </h3>
                                        <a href={`mailto:${lead.contact_info}`} className="text-sm text-ghibli-wood hover:underline">{lead.contact_info}</a>
                                    </div>
                                    <div className="text-xs text-ghibli-charcoal/50 text-right">
                                        <div>{new Date(lead.created_at).toLocaleDateString()}</div>
                                        <div>{new Date(lead.created_at).toLocaleTimeString()}</div>
                                    </div>
                                </div>
                                <div className="bg-ghibli-cream/50 p-4 rounded-xl text-sm text-ghibli-charcoal mt-3 whitespace-pre-wrap">
                                    {lead.message}
                                </div>
                                {lead.status === 'new' && (
                                    <div className="mt-4 flex justify-end">
                                        <button 
                                            onClick={() => markAsRead(lead.id)}
                                            className="text-xs font-bold text-ghibli-wood hover:text-ghibli-navy bg-white border border-ghibli-wood/20 px-3 py-1.5 rounded-lg shadow-sm active:scale-95 transition-all"
                                        >
                                            Mark as Read
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
