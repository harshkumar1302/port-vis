import { Navigate, useLocation, useParams } from 'react-router-dom';

/** /products → /shop (keeps ?category= etc.) */
export const ProductsRedirect = () => {
  const { search } = useLocation();
  return <Navigate to={`/shop${search}`} replace />;
};

/** /product/:slug → /shop/:slug */
export const ProductSlugRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/shop/${slug}`} replace />;
};
