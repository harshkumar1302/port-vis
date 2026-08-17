import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { FALLBACK_CATEGORIES as DEFAULT_CATEGORIES } from '../../../constants/categories';
import { isShopListing } from '../../../lib/categoryUtils';
import { formatPriceShop } from '../../../lib/artwork';
import { useArtworkUpload } from '../../../hooks/useArtworkUpload';

const ShopTab = ({ session }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryDefinitions, setCategoryDefinitions] = useState(DEFAULT_CATEGORIES);

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
    loadCategories();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .order('created_at', { ascending: false });
      if (!error) setItems((data || []).filter(isShopListing));
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const upload = useArtworkUpload({ session, mode: 'shop', onSuccess: loadItems });

  const withPrice = items.filter((a) => a.price != null && a.price !== '');
  const withoutPrice = items.filter((a) => a.price == null || a.price === '');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 animate-in fade-in duration-500">
      <div className="lg:col-span-1">
        <div className="card-ghibli p-6 sm:p-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem] lg:sticky lg:top-32">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-ghibli-navy">
              {upload.editingId ? 'Edit shop item' : 'Add to shop'}
            </h2>
            {upload.editingId && (
              <button
                type="button"
                onClick={upload.resetForm}
                className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          <p className="text-xs text-ghibli-charcoal/60 mb-6 leading-relaxed">
            Upload products for <strong>/shop</strong> only — separate from gallery portfolio pieces. Price is required.
          </p>

          <form onSubmit={upload.handleUpload} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Title</label>
              <input
                type="text"
                value={upload.title}
                onChange={(e) => upload.setTitle(e.target.value)}
                className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Category</label>
                <select
                  value={upload.category}
                  onChange={(e) => upload.setCategory(e.target.value)}
                  className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold cursor-pointer"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categoryDefinitions.map((cat) => (
                    <option key={cat.id} value={cat.label}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Sub-category</label>
                <select
                  value={upload.subCategory}
                  onChange={(e) => upload.setSubCategory(e.target.value)}
                  className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold cursor-pointer"
                >
                  <option value="">None</option>
                  {(() => {
                    const catDef = categoryDefinitions.find(
                      (c) =>
                        c.label?.trim().toLowerCase() === upload.category?.trim().toLowerCase() ||
                        c.id?.trim().toLowerCase() === upload.category?.trim().toLowerCase()
                    );
                    return catDef?.subCategories?.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ));
                  })()}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Description</label>
              <textarea
                value={upload.desc}
                onChange={(e) => upload.setDesc(e.target.value)}
                className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood h-24"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Price (₹) *</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={upload.price}
                  onChange={(e) => upload.setPrice(e.target.value)}
                  className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold"
                  placeholder="799"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Original (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={upload.originalPrice}
                  onChange={(e) => upload.setOriginalPrice(e.target.value)}
                  className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold"
                  placeholder="999"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Stock (blank = unlimited)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={upload.stock}
                onChange={(e) => upload.setStock(e.target.value)}
                className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold"
                placeholder="∞"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm font-bold text-ghibli-charcoal/70">
                <input
                  type="checkbox"
                  checked={upload.isFeatured}
                  onChange={(e) => upload.setIsFeatured(e.target.checked)}
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm font-bold text-ghibli-charcoal/70">
                <input
                  type="checkbox"
                  checked={upload.isBestseller}
                  onChange={(e) => upload.setIsBestseller(e.target.checked)}
                />
                Bestseller
              </label>
              <label className="flex items-center gap-2 text-sm font-bold text-ghibli-charcoal/70">
                <input
                  type="checkbox"
                  checked={upload.isNew}
                  onChange={(e) => upload.setIsNew(e.target.checked)}
                />
                New launch
              </label>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70 text-left">
                Image {upload.editingId && '(optional if unchanged)'}
              </label>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={upload.handleFileChange}
                  className="hidden"
                  id="shop-file-upload"
                  required={!upload.editingId}
                />
                <label
                  htmlFor="shop-file-upload"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-ghibli-wood/20 rounded-2xl bg-white/30 hover:bg-white/50 transition-all cursor-pointer overflow-hidden"
                >
                  {upload.previewUrl ? (
                    <img src={upload.previewUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-6">
                      <span className="text-3xl block mb-2 opacity-50">📸</span>
                      <span className="text-[10px] font-bold text-ghibli-wood/60 uppercase tracking-widest">Select file</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={upload.uploading}
              className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 ${
                upload.success ? 'bg-green-500 text-white' : 'bg-ghibli-wood text-ghibli-cream hover:bg-[#A0704F]'
              }`}
            >
              {upload.uploading
                ? 'Processing…'
                : upload.success
                  ? '✨ Done!'
                  : upload.editingId
                    ? '✨ Update shop item'
                    : '✨ Add to shop'}
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-ghibli p-5 bg-white/40 border border-white/20 rounded-2xl">
            <div className="text-3xl font-black text-ghibli-navy">{items.length}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-ghibli-charcoal/50 mt-1">On shop page</div>
          </div>
          <div className="card-ghibli p-5 bg-white/40 border border-white/20 rounded-2xl">
            <div className="text-3xl font-black text-ghibli-wood">{withPrice.length}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-ghibli-charcoal/50 mt-1">With price</div>
          </div>
          <div className="card-ghibli p-5 bg-white/40 border border-white/20 rounded-2xl">
            <div className="text-3xl font-black text-amber-600">{withoutPrice.length}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-ghibli-charcoal/50 mt-1">Enquire only</div>
          </div>
        </div>

        <div className="card-ghibli p-6 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem]">
          <h3 className="text-lg font-bold text-ghibli-navy mb-6">Shop listings</h3>

          {loading ? (
            <div className="text-center py-16 text-ghibli-charcoal/50">Loading…</div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-ghibli-charcoal/50">No shop items yet. Add one using the form.</div>
          ) : (
            <div className="space-y-3">
              {items.map((art) => {
                const outOfStock = art.stock === 0;
                return (
                  <div
                    key={art.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-white/30 border border-ghibli-wood/10"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#f3f1ee] shrink-0">
                      {art.image_url ? (
                        <img src={art.image_url} alt="" className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-ghibli-charcoal truncate">{art.title}</h4>
                      <p className="text-xs text-ghibli-charcoal/50 mt-0.5">
                        {art.category}
                        {art.sub_category ? ` · ${art.sub_category}` : ''}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {art.is_featured && (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-ghibli-gold/20 text-ghibli-wood">
                            Featured
                          </span>
                        )}
                        {art.is_bestseller && (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                            Bestseller
                          </span>
                        )}
                        {art.is_new && (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            New
                          </span>
                        )}
                        {outOfStock && (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                            Out of stock
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-ghibli-charcoal">
                        {art.price ? formatPriceShop(art.price) : 'Enquire'}
                      </div>
                      {art.stock != null && (
                        <div className="text-xs text-ghibli-charcoal/50">Stock: {art.stock}</div>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => upload.loadForEdit(art)}
                        className="px-4 py-2 text-xs font-bold text-ghibli-wood border border-ghibli-wood/20 rounded-lg hover:bg-ghibli-wood/10"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => upload.handleDelete(art.id)}
                        className="px-4 py-2 text-xs font-bold text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopTab;
