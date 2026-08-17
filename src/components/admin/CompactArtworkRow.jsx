import { getSubCategory } from '../../lib/artwork';

const CompactArtworkRow = ({ art, onEdit, onDelete }) => {
  if (!art) return null;

  const sub = getSubCategory(art) || art.sub_category;
  const isFeatured = art.is_featured || art.description?.includes('[FEATURED]');
  const isUpcoming = art.category === 'Upcoming';
  const catLabel = art.category?.toLowerCase() === 'featured' ? null : art.category;

  return (
    <div className="admin-compact-row group">
      <div className="admin-compact-row-thumb">
        {art.image_url ? (
          <img src={art.image_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-lg opacity-30">🖼</span>
        )}
        {isFeatured && !isUpcoming && (
          <span className="admin-compact-row-star" title="Featured">★</span>
        )}
      </div>

      <div className="admin-compact-row-body min-w-0">
        <p className="admin-compact-row-title truncate">{art.title || 'Untitled'}</p>
        <p className="admin-compact-row-meta truncate">
          {[catLabel, sub].filter(Boolean).join(' · ') || 'Uncategorized'}
        </p>
      </div>

      <div className="admin-compact-row-badges hidden sm:flex">
        {isUpcoming && <span className="admin-badge admin-badge-blue">Upcoming</span>}
        {isFeatured && !isUpcoming && catLabel?.toLowerCase() !== 'featured' && (
          <span className="admin-badge admin-badge-gold">Featured</span>
        )}
      </div>

      <div className="admin-compact-row-actions">
        <button type="button" onClick={() => onEdit(art)} className="admin-icon-btn" title="Edit">
          ✎
        </button>
        <button type="button" onClick={() => onDelete(art)} className="admin-icon-btn admin-icon-btn-danger" title="Delete">
          ✕
        </button>
      </div>
    </div>
  );
};

export default CompactArtworkRow;
