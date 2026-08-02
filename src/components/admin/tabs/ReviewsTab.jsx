import { useState, useEffect } from 'react';

const ReviewsTab = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', message: '', rating: 5, verified: true, avatar_url: '' });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/manage-reviews');
      if (res.ok) setReviews(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...form } : form;
      const res = await fetch('/api/manage-reviews', {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setForm({ name: '', message: '', rating: 5, verified: true, avatar_url: '' });
      setEditingId(null);
      fetchReviews();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    await fetch('/api/manage-reviews', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id }),
    });
    fetchReviews();
  };

  const handleEdit = (review) => {
    setEditingId(review.id);
    setForm({ name: review.name, message: review.message, rating: review.rating, verified: review.verified, avatar_url: review.avatar_url || '' });
  };

  if (loading) return <div className="text-center py-10 text-ghibli-wood">Loading reviews...</div>;

  return (
    <div className="space-y-8">
      <div className="card-ghibli p-6 sm:p-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem]">
        <h2 className="text-2xl font-bold text-ghibli-navy mb-6">{editingId ? 'Edit Review' : 'Add Review'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Customer name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50" required />
          <input type="url" placeholder="Avatar Image URL (optional)" value={form.avatar_url} onChange={e => setForm({ ...form, avatar_url: e.target.value })} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50" />
          <textarea placeholder="Review message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 h-24" required />
          <div className="flex gap-4 items-center">
            <label className="text-sm font-bold text-ghibli-charcoal/70">Rating</label>
            <select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} className="p-2 rounded-lg border border-ghibli-wood/10">
              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} stars</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm font-bold text-ghibli-charcoal/70">
              <input type="checkbox" checked={form.verified} onChange={e => setForm({ ...form, verified: e.target.checked })} />
              Verified
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="px-6 py-3 bg-ghibli-wood text-white rounded-xl font-bold text-sm">
              {saving ? 'Saving...' : editingId ? 'Update' : 'Add Review'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', message: '', rating: 5, verified: true, avatar_url: '' }); }} className="px-6 py-3 bg-ghibli-paper text-ghibli-wood rounded-xl font-bold text-sm">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} className="card-ghibli p-5 bg-white/40 backdrop-blur-xl border border-white/20 rounded-2xl flex justify-between items-start gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-ghibli-wood/10 flex items-center justify-center font-bold text-ghibli-wood shrink-0 overflow-hidden">
                {r.avatar_url ? <img src={r.avatar_url} alt={r.name} className="w-full h-full object-cover"/> : r.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-ghibli-charcoal">{r.name} {'★'.repeat(r.rating)}</div>
                <p className="text-sm text-ghibli-charcoal/70 mt-1 italic">"{r.message}"</p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => handleEdit(r)} className="px-3 py-1 text-xs font-bold text-ghibli-wood bg-ghibli-wood/10 rounded-lg">Edit</button>
              <button onClick={() => handleDelete(r.id)} className="px-3 py-1 text-xs font-bold text-red-500 bg-red-500/10 rounded-lg">Delete</button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-center text-ghibli-charcoal/50 py-8">No reviews yet. Add your first testimonial above.</p>}
      </div>
    </div>
  );
};

export default ReviewsTab;
