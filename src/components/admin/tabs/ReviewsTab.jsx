import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import ImageDropzone from '../ImageDropzone';

const ReviewsTab = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({ 
    name: '', 
    time_ago: '',
    message: '', 
    rating: 5, 
    verified: true, 
    avatar_url: '',
    review_image_url: ''
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  
  const [reviewImageFile, setReviewImageFile] = useState(null);
  const [reviewImagePreview, setReviewImagePreview] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/manage-reviews', { credentials: 'include' });
        if (!cancelled && res.ok) setReviews(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/manage-reviews', { credentials: 'include' });
      if (res.ok) setReviews(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setForm({ name: '', time_ago: '', message: '', rating: 5, verified: true, avatar_url: '', review_image_url: '' });
    setAvatarFile(null);
    setAvatarPreview('');
    setReviewImageFile(null);
    setReviewImagePreview('');
    setEditingId(null);
  };

  const uploadFile = async (file, pathPrefix) => {
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `${pathPrefix}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('artworks').upload(filePath, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('artworks').getPublicUrl(filePath);
    return publicUrl;
  };

  const handleAvatarFile = (file) => {
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };
  
  const handleReviewImageFile = (file) => {
    setReviewImageFile(file);
    setReviewImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let avatarUrl = form.avatar_url;
      if (avatarFile) {
        avatarUrl = await uploadFile(avatarFile, 'review-avatars');
      }
      
      let reviewImgUrl = form.review_image_url;
      if (reviewImageFile) {
        reviewImgUrl = await uploadFile(reviewImageFile, 'review-images');
      }

      const method = editingId ? 'PUT' : 'POST';
      const body = { 
        ...(editingId ? { id: editingId } : {}), 
        ...form, 
        avatar_url: avatarUrl || null,
        review_image_url: reviewImgUrl || null 
      };
      
      const res = await fetch('/api/manage-reviews', {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      resetForm();
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
    setForm({
      name: review.name,
      time_ago: review.time_ago || '',
      message: review.message,
      rating: review.rating,
      verified: review.verified,
      avatar_url: review.avatar_url || '',
      review_image_url: review.review_image_url || ''
    });
    setAvatarFile(null);
    setAvatarPreview(review.avatar_url || '');
    setReviewImageFile(null);
    setReviewImagePreview(review.review_image_url || '');
  };

  if (loading) return <div className="text-center py-10 font-bold text-ghibli-charcoal/50 animate-pulse uppercase tracking-widest">Loading reviews...</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Upload/Edit Form */}
      <div className="card-ghibli p-6 sm:p-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-sm">
        <h2 className="text-2xl font-bold text-ghibli-navy mb-6">{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-8 items-start">
            
            {/* Avatar Column */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-ghibli-charcoal/70 uppercase tracking-widest">Avatar</label>
              <ImageDropzone
                previewUrl={avatarPreview}
                onFile={handleAvatarFile}
                onClear={() => {
                  setAvatarFile(null);
                  setAvatarPreview('');
                  setForm({ ...form, avatar_url: '' });
                }}
                aspectRatio="aspect-square !rounded-full"
                editing={!!editingId}
              />
            </div>

            {/* Form Fields Column */}
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-ghibli-charcoal/70 uppercase tracking-widest">Reviewer Name <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g. Aswathy" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-ghibli-wood/10 bg-white/60 focus:bg-white focus:border-ghibli-wood/40 focus:ring-4 focus:ring-ghibli-wood/5 transition-all text-sm font-semibold outline-none" required />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-ghibli-charcoal/70 uppercase tracking-widest">Time Ago</label>
                  <input type="text" placeholder="e.g. 2 months ago" value={form.time_ago} onChange={e => setForm({ ...form, time_ago: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-ghibli-wood/10 bg-white/60 focus:bg-white focus:border-ghibli-wood/40 focus:ring-4 focus:ring-ghibli-wood/5 transition-all text-sm font-semibold outline-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-ghibli-charcoal/70 uppercase tracking-widest">Review Text <span className="text-red-500">*</span></label>
                <textarea placeholder="Super quality 🙃 I'm really excited..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-ghibli-wood/10 bg-white/60 focus:bg-white focus:border-ghibli-wood/40 focus:ring-4 focus:ring-ghibli-wood/5 transition-all text-sm font-medium outline-none h-28 resize-y" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start border-t border-ghibli-wood/10 pt-5">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-ghibli-charcoal/70 uppercase tracking-widest">Rating</label>
                    <select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-ghibli-wood/10 bg-white/60 focus:bg-white outline-none font-bold text-sm cursor-pointer">
                      {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                    </select>
                  </div>
                  
                  <label className="flex items-center gap-3 cursor-pointer group w-fit">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${form.verified ? 'bg-[#1d4ed8] border-[#1d4ed8]' : 'bg-white/60 border-ghibli-wood/20 group-hover:border-ghibli-wood/50'}`}>
                      {form.verified && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <input type="checkbox" checked={form.verified} onChange={e => setForm({ ...form, verified: e.target.checked })} className="sr-only" />
                    <span className="text-xs font-bold text-ghibli-charcoal/70 uppercase tracking-widest group-hover:text-ghibli-charcoal transition-colors">Verified Buyer Badge</span>
                  </label>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-ghibli-charcoal/70 uppercase tracking-widest">Attached Review Image</label>
                  <ImageDropzone
                    previewUrl={reviewImagePreview}
                    onFile={handleReviewImageFile}
                    onClear={() => {
                      setReviewImageFile(null);
                      setReviewImagePreview('');
                      setForm({ ...form, review_image_url: '' });
                    }}
                    aspectRatio="aspect-square"
                    editing={!!editingId}
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="flex gap-3 justify-end border-t border-ghibli-wood/10 pt-6">
            {editingId && (
              <button type="button" onClick={resetForm} className="px-6 py-3 bg-white/50 hover:bg-white text-ghibli-charcoal/70 rounded-xl font-extrabold text-[0.7rem] uppercase tracking-widest shadow-sm transition-all border border-ghibli-wood/10">
                Cancel
              </button>
            )}
            <button type="submit" disabled={saving} className="px-8 py-3 bg-ghibli-wood hover:bg-ghibli-navy text-white rounded-xl font-extrabold text-[0.7rem] uppercase tracking-widest shadow-md hover:shadow-lg transition-all disabled:opacity-50">
              {saving ? 'Saving...' : editingId ? 'Update Testimonial' : 'Add Testimonial'}
            </button>
          </div>
        </form>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} className="group relative bg-white/40 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-5 shadow-sm hover:shadow-md hover:bg-white/60 transition-all flex flex-col sm:flex-row gap-5">
            {/* Review Header (Name, Avatar, Rating) */}
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-full bg-[#f3f1ee] flex items-center justify-center font-bold text-ghibli-charcoal text-lg shrink-0 overflow-hidden ring-2 ring-white shadow-sm">
                {r.avatar_url ? <img src={r.avatar_url} alt={r.name} className="w-full h-full object-cover"/> : r.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-ghibli-charcoal text-[15px]">{r.name}</span>
                {r.time_ago && <span className="text-xs text-ghibli-charcoal/50 font-semibold mb-1">{r.time_ago}</span>}
                <div className="flex gap-[2px] mb-2">
                   {Array.from({length: 5}).map((_, i) => (
                     <svg key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-[#fbbc05]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                   ))}
                   {r.verified && (
                     <svg className="w-4 h-4 ml-1 text-[#1d4ed8]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                   )}
                </div>
                <p className="text-sm text-ghibli-charcoal/80 font-medium leading-relaxed max-w-prose">{r.message}</p>
              </div>
            </div>
            
            {/* Review Attached Image */}
            {r.review_image_url && (
              <div className="shrink-0">
                <img src={r.review_image_url} alt="Review attachment" className="w-20 h-20 rounded-xl object-cover border border-white/40 shadow-sm" />
              </div>
            )}

            {/* Actions */}
            <div className="flex sm:flex-col gap-2 justify-end sm:justify-start shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-white/60 sm:pl-5">
              <button onClick={() => handleEdit(r)} className="px-4 py-2 text-[0.65rem] font-extrabold uppercase tracking-widest text-ghibli-wood bg-white hover:bg-ghibli-cream border border-ghibli-wood/10 rounded-lg transition-colors">Edit</button>
              <button onClick={() => handleDelete(r.id)} className="px-4 py-2 text-[0.65rem] font-extrabold uppercase tracking-widest text-red-500 bg-white hover:bg-red-50 border border-red-500/10 rounded-lg transition-colors">Delete</button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="text-center bg-white/40 backdrop-blur-md rounded-3xl p-10 border border-white/30">
            <p className="text-sm font-bold text-ghibli-charcoal/40 uppercase tracking-widest">No reviews yet. Add your first testimonial above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsTab;
