import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../lib/artwork';
import ArtworkImage from '../components/ArtworkImage';

const ShopProductDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  
  const [product, setProduct] = useState(state?.product || null);
  const [loading, setLoading] = useState(!state?.product);
  const { addToCart } = useStore();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!product) {
      const fetchProduct = async () => {
        try {
          const { data, error } = await supabase.from('shop_products').select('*');
          if (error) throw error;
          
          const found = data.find(p => 
            p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') === slug
          );
          
          if (found && found.is_active) {
            setProduct(found);
          } else {
            navigate('/shop');
          }
        } catch (err) {
          console.error(err);
          navigate('/shop');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [product, slug, navigate]);

  if (loading) {
    return (
      <div className="pt-8 pb-24 min-h-screen bg-ghibli-cream flex items-center justify-center">
        <p className="text-ghibli-charcoal/40 text-sm font-bold tracking-widest uppercase">Loading…</p>
      </div>
    );
  }
  if (!product) return null;

  const isSale = product.original_price && product.original_price > product.price;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    
    // Add type tag to distinguish it in the cart if needed, though they share the same interface
    addToCart({ ...product, type: 'shop' });
    
    // Optional: open a side cart or navigate
    // navigate('/cart');
    // Let's just alert for now, or the navbar cart icon will update automatically.
    alert('Added to cart!');
  };

  return (
    <div className="pt-8 pb-24 min-h-screen bg-ghibli-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-20">
          
          {/* Left: Product Image */}
          <div className="w-full lg:w-[55%]">
            <div className="sticky top-32">
              <div className="relative aspect-square md:aspect-[4/5] bg-ghibli-paper/30 rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-sm group">
                <ArtworkImage
                  src={product.image_url}
                  alt={product.title}
                  size="detail"
                  priority
                  imgClassName="transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Badges */}
                {isSale && (
                  <span className="absolute top-6 left-6 px-4 py-2 rounded-full bg-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                    Sale
                  </span>
                )}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center">
                    <span className="px-8 py-4 bg-white/90 text-ghibli-charcoal font-bold tracking-[0.2em] uppercase rounded-full shadow-xl">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-[45%] flex flex-col py-4 lg:py-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ghibli-wood/70 mb-4 block">Product Card</span>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-ghibli-navy font-serif tracking-tighter mb-4 sm:mb-6 leading-[1.1]">
              {product.title}
            </h1>
            
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-3xl font-mono font-bold text-ghibli-navy">
                {formatPrice(product.price)}
              </span>
              {isSale && (
                <span className="text-xl font-mono text-ghibli-charcoal/40 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>

            <div className="prose prose-lg prose-p:text-ghibli-charcoal/70 prose-p:leading-relaxed mb-12">
              <p>
                {product.description || "A beautiful, carefully curated item available exclusively from our shop. Perfect for your collection."}
              </p>
            </div>

            <div className="flex flex-col gap-6 mb-12">
              <button 
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-4 sm:py-5 rounded-full font-bold tracking-[0.1em] uppercase text-xs sm:text-sm shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group min-h-[48px] ${
                  isOutOfStock 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none hover:translate-y-0' 
                    : 'bg-ghibli-navy text-white hover:shadow-ghibli-navy/30'
                }`}
              >
                {!isOutOfStock && <div className="absolute inset-0 bg-ghibli-wood translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>}
                
                <span className="relative z-10 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </span>
              </button>

              {product.stock !== null && product.stock > 0 && product.stock <= 5 && (
                <p className="text-center text-xs font-bold text-red-500 uppercase tracking-widest">
                  Hurry! Only {product.stock} items left in stock.
                </p>
              )}
            </div>

            {/* Trust Signals */}
            <div className="border-t border-ghibli-wood/10 pt-8 sm:pt-10 grid grid-cols-2 gap-4 sm:gap-8">
              <div className="flex flex-col gap-2">
                <div className="text-2xl mb-1 opacity-70">✨</div>
                <h4 className="font-bold text-sm text-ghibli-navy">Premium Quality</h4>
                <p className="text-xs text-ghibli-charcoal/60 leading-relaxed">Carefully sourced and curated for our collectors.</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-2xl mb-1 opacity-70">📦</div>
                <h4 className="font-bold text-sm text-ghibli-navy">Secure Shipping</h4>
                <p className="text-xs text-ghibli-charcoal/60 leading-relaxed">Packaged with care to ensure safe delivery.</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProductDetail;
