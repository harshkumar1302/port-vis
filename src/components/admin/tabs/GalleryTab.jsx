import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { FALLBACK_CATEGORIES as DEFAULT_CATEGORIES } from '../../../constants/categories';
import { artMatchesCategory, isGalleryListing } from '../../../lib/categoryUtils';
import { useArtworkUpload } from '../../../hooks/useArtworkUpload';
import CompactArtworkRow from '../CompactArtworkRow';
import CategoryManagerPanel from '../CategoryManagerPanel';

const PAGE_SIZE = 18;
const VIEWS = [
  { id: 'upload', label: 'Upload' },
  { id: 'browse', label: 'Browse' },
  { id: 'categories', label: 'Categories' },
];

const GalleryTab = ({ session }) => {
  const [view, setView] = useState('upload');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryDefinitions, setCategoryDefinitions] = useState(DEFAULT_CATEGORIES);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  const loadItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setItems((data || []).filter(isGalleryListing));
    setLoading(false);
  };

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/settings?id=category_definitions', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.value?.length) setCategoryDefinitions(data.value);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadItems();
    loadCategories();
  }, []);

  const upload = useArtworkUpload({
    session,
    mode: 'gallery',
    onSuccess: () => {
      loadItems();
      setView('browse');
    },
  });

  const filtered = useMemo(() => {
    let list = items;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.category?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q)
      );
    }
    if (filter === 'featured') {
      list = list.filter((a) => a.is_featured || a.description?.includes('[FEATURED]'));
    } else if (filter === 'upcoming') {
      list = list.filter((a) => a.category === 'Upcoming');
    } else if (filter !== 'all') {
      const catDef = categoryDefinitions.find((c) => c.label === filter || c.id === filter);
      if (catDef) {
        list = list.filter((a) => artMatchesCategory(a, catDef.id, categoryDefinitions) && a.category !== 'Upcoming');
      }
    }
    return list;
  }, [items, search, filter, categoryDefinitions]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  const handleDelete = async (art) => {
    if (!window.confirm(`Delete "${art.title || 'this piece'}"?`)) return;
    try {
      if (art.image_url?.includes('storage/v1/object/public/artworks/')) {
        const fileName = art.image_url.split('/').pop();
        await supabase.storage.from('artworks').remove([fileName]);
      }
      const res = await fetch('/api/manage-art', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: art.id }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Delete failed');
      if (upload.editingId === art.id) upload.resetForm();
      loadItems();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (art) => {
    upload.loadForEdit(art);
    setView('upload');
  };

  const subCategory =
    upload.subCategory || upload.subCategoryOverrideRef?.current || '';

  return (
    <div className="admin-gallery-shell animate-in fade-in duration-300">
      <div className="admin-subnav">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setView(v.id)}
            className={view === v.id ? 'is-active' : ''}
          >
            {v.label}
          </button>
        ))}
        <span className="admin-subnav-count">{items.length} gallery pieces</span>
      </div>

      {view === 'upload' && (
        <div className="admin-gallery-upload max-w-xl">
          <div className="card-ghibli p-6 sm:p-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem]">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-ghibli-navy">
                {upload.editingId ? 'Edit gallery piece' : 'New gallery upload'}
              </h2>
              {upload.editingId && (
                <button type="button" onClick={upload.resetForm} className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                  Cancel
                </button>
              )}
            </div>

            <p className="text-xs text-ghibli-charcoal/60 mb-5">
              Portfolio work for <strong>/gallery</strong>. Shop products are uploaded in the <strong>Shop</strong> tab.
            </p>

            <div className="flex bg-ghibli-paper/20 p-1 rounded-xl mb-6">
              {['gallery', 'featured', 'upcoming'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => upload.setUploadType(mode)}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                    upload.uploadType === mode ? 'bg-white text-ghibli-wood shadow-sm' : 'text-ghibli-charcoal/40'
                  }`}
                >
                  {mode === 'gallery' ? 'Gallery' : mode === 'featured' ? 'Featured' : 'Upcoming'}
                </button>
              ))}
            </div>

            <form onSubmit={upload.handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1 text-ghibli-charcoal/70">Title</label>
                <input
                  type="text"
                  value={upload.title}
                  onChange={(e) => upload.setTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 text-ghibli-wood font-bold"
                />
              </div>

              {upload.uploadType !== 'upcoming' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold mb-1 text-ghibli-charcoal/70">Category</label>
                    <select
                      value={upload.category}
                      onChange={(e) => upload.setCategory(e.target.value)}
                      className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 text-ghibli-wood font-bold cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select</option>
                      {categoryDefinitions.map((cat) => (
                        <option key={cat.id} value={cat.label}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1 text-ghibli-charcoal/70">Sub-category</label>
                    <select
                      value={subCategory}
                      onChange={(e) => upload.setSubCategory(e.target.value)}
                      className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 text-ghibli-wood font-bold cursor-pointer"
                    >
                      <option value="">None</option>
                      {categoryDefinitions
                        .find(
                          (c) =>
                            c.label?.toLowerCase() === upload.category?.toLowerCase() ||
                            c.id?.toLowerCase() === upload.category?.toLowerCase()
                        )
                        ?.subCategories?.map((sub) => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold mb-1 text-ghibli-charcoal/70">Story</label>
                <textarea
                  value={upload.desc}
                  onChange={(e) => upload.setDesc(e.target.value)}
                  className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 text-ghibli-wood h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-ghibli-charcoal/70">
                  Image {upload.editingId && '(optional)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={upload.handleFileChange}
                  className="w-full text-sm"
                  required={!upload.editingId}
                />
                {upload.previewUrl && (
                  <img src={upload.previewUrl} alt="" className="mt-2 h-32 w-full object-cover rounded-xl" />
                )}
              </div>

              <button
                type="submit"
                disabled={upload.uploading}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  upload.success ? 'bg-green-500 text-white' : 'bg-ghibli-wood text-ghibli-cream hover:bg-[#A0704F]'
                } disabled:opacity-50`}
              >
                {upload.uploading ? 'Saving…' : upload.editingId ? 'Update piece' : 'Add to gallery'}
              </button>
            </form>
          </div>
        </div>
      )}

      {view === 'browse' && (
        <div className="admin-gallery-browse card-ghibli p-4 sm:p-6 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem]">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or category…"
              className="flex-1 p-2.5 rounded-xl border border-ghibli-wood/10 bg-white/50 text-sm font-medium"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2.5 rounded-xl border border-ghibli-wood/10 bg-white/50 text-sm font-bold text-ghibli-wood cursor-pointer sm:min-w-[11rem]"
            >
              <option value="all">All pieces</option>
              <option value="featured">Featured</option>
              <option value="upcoming">Upcoming</option>
              {categoryDefinitions.map((cat) => (
                <option key={cat.id} value={cat.label}>{cat.label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="text-center py-12 text-ghibli-charcoal/50 text-sm">Loading…</p>
          ) : paged.length === 0 ? (
            <p className="text-center py-12 text-ghibli-charcoal/50 text-sm">No pieces match. Upload one or change filters.</p>
          ) : (
            <div className="admin-compact-list">
              {paged.map((art) => (
                <CompactArtworkRow key={art.id} art={art} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          )}

          {filtered.length > PAGE_SIZE && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-ghibli-wood/10">
              <span className="text-xs text-ghibli-charcoal/50">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="admin-page-btn"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="admin-page-btn"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {view === 'categories' && (
        <CategoryManagerPanel
          categoryDefinitions={categoryDefinitions}
          setCategoryDefinitions={setCategoryDefinitions}
          onCategoriesSaved={loadCategories}
        />
      )}
    </div>
  );
};

export default GalleryTab;
