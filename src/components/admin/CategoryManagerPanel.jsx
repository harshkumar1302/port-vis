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

  const inputClass = "flex-1 p-3 bg-white/50 border border-white/80 rounded-xl text-ghibli-charcoal placeholder-ghibli-charcoal/30 focus:outline-none focus:ring-2 focus:ring-ghibli-gold/40 focus:bg-white transition-all shadow-sm font-medium text-sm";
  const btnClass = "w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-ghibli-wood/10 text-ghibli-wood hover:bg-ghibli-wood hover:text-white hover:border-ghibli-wood transition-colors shadow-sm disabled:opacity-30 disabled:pointer-events-none";

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
      
      {/* Category Definitions Panel */}
      <div className="card-ghibli p-6 sm:p-8 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)] rounded-[2rem] space-y-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-ghibli-charcoal tracking-tight mb-1">Gallery Categories</h2>
          <p className="text-[0.7rem] font-medium text-ghibli-charcoal/60">Used on /gallery and /shop for grouping. Shop and gallery uploads both pick from these.</p>
        </div>

        <div className="flex gap-3">
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="New category name"
            className={inputClass}
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
          />
          <button 
            type="button" 
            onClick={addCategory} 
            className="px-6 py-3 bg-ghibli-wood text-ghibli-cream hover:bg-ghibli-navy rounded-xl text-sm font-bold shadow-sm transition-all duration-300"
          >
            Add
          </button>
        </div>

        <div className="space-y-4">
          {categoryDefinitions.map((cat, index) => (
            <div key={cat.id} className="p-5 rounded-2xl bg-white/60 border border-white/80 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <input
                  value={cat.label}
                  onChange={(e) => {
                    const updated = [...categoryDefinitions];
                    updated[index] = { ...updated[index], label: e.target.value };
                    setCategoryDefinitions(updated);
                  }}
                  onBlur={() => saveDefinitions(categoryDefinitions)}
                  className="flex-1 bg-transparent font-bold text-ghibli-charcoal border-none focus:outline-none focus:ring-0 p-0 text-base"
                />
                
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => {
                      const updated = arrayMove(categoryDefinitions, index, index - 1);
                      setCategoryDefinitions(updated);
                      saveDefinitions(updated);
                    }}
                    className={btnClass}
                    title="Move Up"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                  </button>
                  <button
                    type="button"
                    disabled={index === categoryDefinitions.length - 1}
                    onClick={() => {
                      const updated = arrayMove(categoryDefinitions, index, index + 1);
                      setCategoryDefinitions(updated);
                      saveDefinitions(updated);
                    }}
                    className={btnClass}
                    title="Move Down"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </button>
                  <div className="w-px h-6 bg-ghibli-charcoal/10 mx-1"></div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!window.confirm(`Delete "${cat.label}"?`)) return;
                      const updated = categoryDefinitions.filter((_, i) => i !== index);
                      setCategoryDefinitions(updated);
                      saveDefinitions(updated);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-red-100 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors shadow-sm"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <a href={getProductsUrl(cat.id)} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-ghibli-wood hover:text-ghibli-navy transition-colors inline-flex items-center gap-1">
                  View on shop <span>→</span>
                </a>
              </div>

              <div className="flex flex-wrap gap-2">
                {(cat.subCategories || []).map((sub, si) => (
                  <span key={sub} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white border border-ghibli-wood/10 text-ghibli-charcoal rounded-md shadow-sm">
                    {sub}
                    <button
                      type="button"
                      className="text-red-400 hover:text-red-600 transition-colors flex items-center justify-center"
                      onClick={() => {
                        const updated = [...categoryDefinitions];
                        updated[index].subCategories = updated[index].subCategories.filter((_, i) => i !== si);
                        setCategoryDefinitions(updated);
                        saveDefinitions(updated);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {saved && (
          <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            Saved successfully
          </div>
        )}
      </div>

      {/* Priorities Panel */}
      <div className="card-ghibli p-6 sm:p-8 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)] rounded-[2rem] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-ghibli-charcoal tracking-tight mb-1">Sub-category priorities</h2>
            <p className="text-[0.7rem] font-medium text-ghibli-charcoal/60">Which sub-category shows first on the public gallery page.</p>
          </div>
          <button
            type="button"
            onClick={savePriorities}
            disabled={saving}
            className={`shrink-0 px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all duration-300 ${
              saved
                ? 'bg-emerald-500 text-white border-transparent'
                : 'bg-white border border-ghibli-wood/20 text-ghibli-wood hover:bg-ghibli-wood hover:text-white disabled:opacity-50'
            }`}
          >
            {saved ? 'Saved ✓' : 'Save priorities'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 bg-white/30 p-5 rounded-2xl border border-white/60">
          {categoryDefinitions.map((cat) => (
            <div key={cat.id} className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-ghibli-charcoal/50 ml-1">{cat.label}</label>
              <select
                value={priorities[cat.label] || ''}
                onChange={(e) => setPriorities({ ...priorities, [cat.label]: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-white/80 bg-white/60 text-sm font-bold text-ghibli-charcoal focus:outline-none focus:ring-2 focus:ring-ghibli-gold/30 shadow-sm transition-all"
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
