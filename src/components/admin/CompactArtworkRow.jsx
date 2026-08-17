import { getSubCategory } from '../../lib/artwork';

const CompactArtworkRow = ({ art, onEdit, onDelete }) => {
  if (!art) return null;

  const sub = getSubCategory(art) || art.sub_category;
  const isFeatured = art.is_featured || art.description?.includes('[FEATURED]');
  const isUpcoming = art.category === 'Upcoming';
  const catLabel = art.category?.toLowerCase() === 'featured' ? null : art.category;

  return (
    <div className="flex items-center gap-4 p-3 bg-white/60 hover:bg-white backdrop-blur-md border border-white/40 hover:border-ghibli-gold/30 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 group">
      <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-white/50 border border-white/80 flex items-center justify-center shadow-sm">
        {art.image_url ? (
          <img src={art.image_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-lg opacity-30">🖼</span>
        )}
        {isFeatured && !isUpcoming && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center border border-white shadow-sm" title="Featured">
            <span className="text-[9px] text-yellow-900 leading-none">★</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-ghibli-charcoal group-hover:text-ghibli-wood transition-colors truncate">
          {art.title || 'Untitled'}
        </p>
        <p className="text-[0.65rem] font-extrabold tracking-widest uppercase text-ghibli-charcoal/40 truncate mt-0.5">
          {[catLabel, sub].filter(Boolean).join(' · ') || 'Uncategorized'}
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-1.5">
        {isUpcoming && <span className="px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 rounded-md border border-blue-100">Upcoming</span>}
        {isFeatured && !isUpcoming && catLabel?.toLowerCase() !== 'featured' && (
          <span className="px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 rounded-md border border-amber-100">Featured</span>
        )}
      </div>

      <div className="flex items-center gap-1.5 ml-2">
        <button
          type="button"
          onClick={() => onEdit(art)}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-ghibli-wood/10 text-ghibli-wood hover:bg-ghibli-wood hover:text-white hover:border-ghibli-wood transition-colors shadow-sm"
          title="Edit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
        </button>
        <button
          type="button"
          onClick={() => onDelete(art)}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-red-100 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors shadow-sm"
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </button>
      </div>
    </div>
  );
};

export default CompactArtworkRow;
