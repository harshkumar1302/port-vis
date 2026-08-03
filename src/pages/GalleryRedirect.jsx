import { Navigate, useParams } from 'react-router-dom';
import { normalizeCategoryRef } from '../lib/categoryUtils';

/** Legacy /gallery/:id when used as product filter → category gallery view */
const GalleryRedirect = () => {
  const { categoryId } = useParams();
  const id = normalizeCategoryRef(categoryId || '');
  return <Navigate to={`/gallery/${encodeURIComponent(id)}`} replace />;
};

export default GalleryRedirect;
