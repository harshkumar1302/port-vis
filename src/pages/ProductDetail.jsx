import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useStore } from '../context/StoreContext';
import { formatPrice, getDiscountPct } from '../lib/artwork';
import { buildWhatsAppUrl } from '../lib/enquire';
import useSiteSetting from '../hooks/useSiteSettings';

const ProductDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [art, setArt] = useState(state?.art || null);
  const [loading, setLoading] = useState(!state?.art);
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const { value: channels } = useSiteSetting('contact_channels', {});

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);

    if (!art) {
      // For MVP, if there's no state, we try to match by title slug.
      // Note: A real app should have a 'slug' column in the DB.
      const fetchArt = async () => {
        try {
          const { data, error } = await supabase.from('artworks').select('*');
          if (error) throw error;
          const found = data.find(a => 
            a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') === slug
          );
          if (found) setArt(found);
          else navigate('/products');
        } catch (err) {
          console.error(err);
          navigate('/products');
        } finally {
          setLoading(false);
        }
      };
      fetchArt();
    }
  }, [art, slug, navigate]);

  if (loading) return <div className="min-h-screen pt-32 pb-24 text-center">Loading...</div>;
  if (!art) return null;

  const discount = getDiscountPct(art);
  const price = formatPrice(art.price);
  const original = formatPrice(art.original_price);
  const isWishlisted = isInWishlist(art.id);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-ghibli-cream/40">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          
          {/* Left: Image Viewer */}
          <div className="w-full md:w-1/2">
            <div className="sticky top-32">
              <div className="relative aspect-[4/5] bg-ghibli-paper/30 rounded-3xl overflow-hidden shadow-sm">
                {art.image_url ? (
                  <img src={art.image_url} alt={art.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl opacity-30">🎨</div>
                )}
                {discount && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                    -{discount}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full md:w-1/2 flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-ghibli-wood/70 mb-2">{art.category}</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-ghibli-charcoal font-serif tracking-tight mb-4 leading-tight">
              {art.title}
            </h1>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-ghibli-gold text-lg">★★★★★</div>
              <span className="text-sm text-ghibli-charcoal/50">(12 reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-8">
              {price ? (
                <>
                  <span className="text-3xl font-extrabold text-ghibli-charcoal">{price}</span>
                  {original && discount && (
                    <span className="text-xl text-ghibli-charcoal/40 line-through">{original}</span>
                  )}
                </>
              ) : (
                <span className="text-xl text-ghibli-charcoal/50 italic">Enquire for price</span>
              )}
            </div>

            <p className="text-lg text-ghibli-charcoal/70 leading-relaxed mb-10">
              {art.description || "A beautiful handmade piece, crafted with care and intention. Perfect for your home or as a thoughtful gift."}
            </p>

            <div className="flex flex-col gap-4 mb-10">
              <div className="flex gap-4">
                <button 
                  onClick={() => addToCart(art)}
                  className="flex-1 text-center py-4 rounded-xl bg-gold-gradient text-white font-bold tracking-widest uppercase text-sm shadow-soft hover:shadow-luxe hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                  Add to Cart
                </button>
                <button 
                  onClick={() => toggleWishlist(art)}
                  className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${
                    isWishlisted 
                      ? 'bg-red-50 border-red-500 text-red-500' 
                      : 'bg-white border-ghibli-wood/20 text-ghibli-wood hover:border-ghibli-wood'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </button>
              </div>
              <a 
                href={buildWhatsAppUrl(art, channels)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-4 rounded-xl bg-[#25D366] text-white font-bold tracking-widest uppercase text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                Enquire on WhatsApp
              </a>
            </div>

            {/* Trust Signals */}
            <div className="border-t border-ghibli-wood/10 pt-8 grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">✨</div>
                <div>
                  <h4 className="font-bold text-sm text-ghibli-charcoal mb-0.5">100% Handmade</h4>
                  <p className="text-xs text-ghibli-charcoal/60">Crafted with care</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">🚚</div>
                <div>
                  <h4 className="font-bold text-sm text-ghibli-charcoal mb-0.5">Free Shipping</h4>
                  <p className="text-xs text-ghibli-charcoal/60">On orders over ₹799</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
