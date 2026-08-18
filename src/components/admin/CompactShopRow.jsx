import { formatPriceShop, getSubCategory, isFeatured, isBestseller, isNewLaunch } from '../../lib/artwork';

const CompactShopRow = ({ art, onEdit, onDelete }) => {
  if (!art) return null;

  const sub = getSubCategory(art) || art.sub_category;
  const outOfStock = art.stock === 0;

  return (
    <div className="admin-compact-row group">
      <div className="admin-compact-row-thumb">
        {art.image_url ? (
          <img src={art.image_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-lg opacity-30">🛍</span>
        )}
      </div>

      <div className="admin-compact-row-body min-w-0">
        <p className="admin-compact-row-title truncate">{art.title || 'Untitled'}</p>
        <p className="admin-compact-row-meta truncate">
          {[art.category, sub].filter(Boolean).join(' · ')}
          {art.price != null && art.price !== '' && (
            <span className="text-ghibli-wood"> · {formatPriceShop(art.price)}</span>
          )}
        </p>
      </div>

      <div className="admin-compact-row-badges hidden sm:flex">
        {isFeatured(art) && <span className="admin-badge admin-badge-gold">Featured</span>}
        {isBestseller(art) && <span className="admin-badge">Bestseller</span>}
        {isNewLaunch(art) && <span className="admin-badge admin-badge-blue">New</span>}
        {outOfStock && <span className="admin-badge">Out of stock</span>}
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

export default CompactShopRow;
