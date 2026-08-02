import { Navigate, useParams } from 'react-router-dom';
import { normalizeCategoryRef } from '../lib/categoryUtils';

/** Old /gallery/mandala URLs → /products?category=mandala */
const GalleryRedirect = () => {
  const { categoryId } = useParams();
  const id = normalizeCategoryRef(categoryId || '');
  return <Navigate to={`/products?category=${encodeURIComponent(id)}`} replace />;
};

export default GalleryRedirect;
