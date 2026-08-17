import { useState, useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { getProductsUrl } from '../../lib/categoryUtils';

const CategoryManagerPanel = ({ categoryDefinitions, setCategoryDefinitions, onCategoriesSaved }) => {
  const [priorities, setPriorities] = useState({});
  const [newLabel, setNewLabel] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings?id=category_priorities', { credentials: 'include' })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d?.value && setPriorities(d.value))
      .catch(console.error);
  }, []);

  const saveDefinitions = async (defs) => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: 'category_definitions', value: defs }),
      });
      if (!res.ok) throw new Error('Save failed');
      onCategoriesSaved?.();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const savePriorities = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: 'category_priorities', value: priorities }),
      });
      if (!res.ok) throw new Error('Save failed');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addCategory = () => {
    if (!newLabel.trim()) return;
    const id = newLabel.toLowerCase().replace(/\s+/g, '-');
    if (categoryDefinitions.some((c) => c.id === id)) {
      alert('Category already exists');
      return;
    }
    const updated = [...categoryDefinitions, { id, label: newLabel.trim(), subCategories: [] }];
    setCategoryDefinitions(updated);
    saveDefinitions(updated);
    setNewLabel('');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="card-ghibli p-6 bg-white/40 border border-white/20 rounded-[2rem] space-y-4">
        <h2 className="text-xl font-bold text-ghibli-navy">Gallery categories</h2>
        <p className="text-xs text-ghibli-charcoal/60">Used on /gallery and /shop for grouping. Shop and gallery uploads both pick from these.</p>

        <div className="flex gap-2">
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="New category name"
            className="flex-1 p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 font-bold text-sm"
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
          />
          <button type="button" onClick={addCategory} className="px-4 py-2 bg-ghibli-wood text-ghibli-cream rounded-xl text-sm font-bold">
            Add
          </button>
        </div>

        <div className="space-y-3">
          {categoryDefinitions.map((cat, index) => (
            <div key={cat.id} className="p-4 rounded-xl bg-white/30 border border-ghibli-wood/10">
              <div className="flex items-center gap-2 mb-2">
                <input
                  value={cat.label}
                  onChange={(e) => {
                    const updated = [...categoryDefinitions];
                    updated[index] = { ...updated[index], label: e.target.value };
                    setCategoryDefinitions(updated);
                  }}
                  onBlur={() => saveDefinitions(categoryDefinitions)}
                  className="flex-1 bg-transparent font-bold text-ghibli-navy border-none focus:ring-0 p-0"
                />
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => {
                    const updated = arrayMove(categoryDefinitions, index, index - 1);
                    setCategoryDefinitions(updated);
                    saveDefinitions(updated);
                  }}
                  className="admin-icon-btn text-xs"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={index === categoryDefinitions.length - 1}
                  onClick={() => {
                    const updated = arrayMove(categoryDefinitions, index, index + 1);
                    setCategoryDefinitions(updated);
                    saveDefinitions(updated);
                  }}
                  className="admin-icon-btn text-xs"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!window.confirm(`Delete "${cat.label}"?`)) return;
                    const updated = categoryDefinitions.filter((_, i) => i !== index);
                    setCategoryDefinitions(updated);
                    saveDefinitions(updated);
                  }}
                  className="admin-icon-btn admin-icon-btn-danger text-xs"
                >
                  ✕
                </button>
              </div>
              <p className="text-[10px] text-ghibli-charcoal/40 mb-2">
                <a href={getProductsUrl(cat.id)} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  View on shop →
                </a>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(cat.subCategories || []).map((sub, si) => (
                  <span key={sub} className="admin-badge text-[9px]">
                    {sub}
                    <button
                      type="button"
                      className="ml-1 text-red-400"
                      onClick={() => {
                        const updated = [...categoryDefinitions];
                        updated[index].subCategories = updated[index].subCategories.filter((_, i) => i !== si);
                        setCategoryDefinitions(updated);
                        saveDefinitions(updated);
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {saved && <p className="text-xs text-green-600 font-bold">Saved ✓</p>}
      </div>

      <div className="card-ghibli p-6 bg-white/40 border border-white/20 rounded-[2rem] space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-ghibli-navy">Sub-category priorities</h2>
          <button
            type="button"
            onClick={savePriorities}
            disabled={saving}
            className="px-4 py-2 bg-ghibli-wood text-ghibli-cream rounded-xl text-sm font-bold disabled:opacity-50"
          >
            Save priorities
          </button>
        </div>
        <p className="text-xs text-ghibli-charcoal/60">Which sub-category shows first on the public gallery page.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categoryDefinitions.map((cat) => (
            <div key={cat.id}>
              <label className="text-[10px] font-bold uppercase tracking-wider text-ghibli-charcoal/50">{cat.label}</label>
              <select
                value={priorities[cat.label] || ''}
                onChange={(e) => setPriorities({ ...priorities, [cat.label]: e.target.value })}
                className="w-full mt-1 p-2 rounded-lg border border-ghibli-wood/10 bg-white/50 text-sm font-bold"
              >
                <option value="">Newest first</option>
                {cat.subCategories?.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagerPanel;
