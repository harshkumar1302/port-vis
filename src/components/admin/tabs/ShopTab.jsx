import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { FALLBACK_CATEGORIES as DEFAULT_CATEGORIES } from '../../../constants/categories';
import { artMatchesCategory, isShopListing } from '../../../lib/categoryUtils';
import { useArtworkUpload } from '../../../hooks/useArtworkUpload';
import AdminUploadForm from '../AdminUploadForm';
import AdminSubnav from '../AdminSubnav';
import CompactShopRow from '../CompactShopRow';
import CategoryManagerPanel from '../CategoryManagerPanel';

const PAGE_SIZE = 18;
const VIEWS = [
  { id: 'upload', label: 'Add product' },
  { id: 'browse', label: 'Browse' },
  { id: 'categories', label: 'Categories' },
];

const ShopTab = ({ session }) => {
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
    if (!error) setItems((data || []).filter(isShopListing));
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
    mode: 'shop',
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
      list = list.filter((a) => a.is_featured);
    } else if (filter === 'bestseller') {
      list = list.filter((a) => a.is_bestseller);
    } else if (filter === 'outofstock') {
      list = list.filter((a) => a.stock === 0);
    } else if (filter !== 'all') {
      const catDef = categoryDefinitions.find((c) => c.label === filter || c.id === filter);
      if (catDef) list = list.filter((a) => artMatchesCategory(a, catDef.id, categoryDefinitions));
    }
    return list;
  }, [items, search, filter, categoryDefinitions]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  const handleDelete = async (art) => {
    if (!window.confirm(`Delete "${art.title || 'this product'}"?`)) return;
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

  const inStock = items.filter((a) => a.stock !== 0).length;

  return (
    <div className="admin-module-shell animate-in fade-in duration-300">
      <AdminSubnav
        views={VIEWS}
        active={view}
        onChange={setView}
        countLabel={`${items.length} products · ${inStock} in stock`}
      />

      {view === 'upload' && (
        <AdminUploadForm
          mode="shop"
          upload={upload}
          categoryDefinitions={categoryDefinitions}
          onCancel={upload.resetForm}
        />
      )}

      {view === 'browse' && (
        <div className="admin-browse-panel card-ghibli p-4 sm:p-6 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="admin-stat-chip">
              <strong>{items.length}</strong>
              <span>Products</span>
            </div>
            <div className="admin-stat-chip">
              <strong>{items.filter((a) => a.is_featured).length}</strong>
              <span>Featured</span>
            </div>
            <div className="admin-stat-chip">
              <strong>{items.filter((a) => a.stock === 0).length}</strong>
              <span>Out of stock</span>
            </div>
            <div className="admin-stat-chip">
              <strong>{items.filter((a) => a.is_new).length}</strong>
              <span>New launches</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="flex-1 p-2.5 rounded-xl border border-ghibli-wood/10 bg-white/50 text-sm font-medium"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2.5 rounded-xl border border-ghibli-wood/10 bg-white/50 text-sm font-bold text-ghibli-wood cursor-pointer sm:min-w-[11rem]"
            >
              <option value="all">All products</option>
              <option value="featured">Featured</option>
              <option value="bestseller">Bestsellers</option>
              <option value="outofstock">Out of stock</option>
              {categoryDefinitions.map((cat) => (
                <option key={cat.id} value={cat.label}>{cat.label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="text-center py-12 text-ghibli-charcoal/50 text-sm">Loading…</p>
          ) : paged.length === 0 ? (
            <p className="text-center py-12 text-ghibli-charcoal/50 text-sm">No products yet. Add one under Add product.</p>
          ) : (
            <div className="admin-compact-list">
              {paged.map((art) => (
                <CompactShopRow key={art.id} art={art} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          )}

          {filtered.length > PAGE_SIZE && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-ghibli-wood/10">
              <span className="text-xs text-ghibli-charcoal/50">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex gap-2">
                <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="admin-page-btn">
                  Prev
                </button>
                <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="admin-page-btn">
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

export default ShopTab;
