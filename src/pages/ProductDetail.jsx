import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useStore } from '../context/StoreContext';
import { formatPrice, getDiscountPct } from '../lib/artwork';
import useSiteSetting from '../hooks/useSiteSettings';
import { buildWhatsAppUrl, DEFAULT_CHANNELS } from '../lib/enquire';
import { getShopPiecePath } from '../lib/pieceUrls';
import ArtworkImage from '../components/ArtworkImage';
import WhatsAppButton from '../components/WhatsAppButton';
import { titleToSlug, isShopListing } from '../lib/categoryUtils';
import usePageSEO from '../hooks/usePageSEO';
import {
  buildProductTitle,
  buildProductDescription,
  buildProductJsonLd,
  DEFAULT_OG_IMAGE,
  PAGE_SEO,
  buildCanonical,
} from '../lib/seo';

const ProductDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [art, setArt] = useState(state?.art || state?.product || null);
  const [loading, setLoading] = useState(!state?.art && !state?.product);
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const { value: channels } = useSiteSetting('contact_channels', DEFAULT_CHANNELS);
  const piecePath = art ? getShopPiecePath(art) : `/shop/${slug}`;

  const waUrl = useMemo(() => {
    if (!art) return null;
    return buildWhatsAppUrl(art, channels, {
      source: 'product',
      slug,
      pageUrl: buildCanonical(piecePath),
    });
  }, [art, channels, slug, piecePath]);

  usePageSEO({
    enabled: Boolean(art),
    title: art ? buildProductTitle(art.title) : PAGE_SEO.shop.title,
    description: art ? buildProductDescription(art) : PAGE_SEO.shop.description,
    path: piecePath,
    image: art?.image_url || DEFAULT_OG_IMAGE,
    jsonLd: art ? buildProductJsonLd({ ...art, slug: titleToSlug(art.title, art.id) }) : null,
    type: 'product',
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!art) {
      const fetchItem = async () => {
        try {
          const { data: artworks, error: artError } = await supabase.from('artworks').select('*');
          if (artError) throw artError;

          const match = (item) => titleToSlug(item.title, item.id) === slug;
          const found = (artworks || []).filter(isShopListing).find(match);

          if (found) setArt(found);
          else navigate('/shop');
        } catch (err) {
          console.error(err);
          navigate('/shop');
        } finally {
          setLoading(false);
        }
      };
      fetchItem();
    }
  }, [art, slug, navigate]);

  if (loading) {
    return (
      <div className="pt-8 pb-24 min-h-screen bg-ghibli-cream/40 flex items-center justify-center">
        <p className="text-ghibli-charcoal/40 text-sm font-bold tracking-widest uppercase">Loading…</p>
      </div>
    );
  }
  if (!art) return null;

  const discount = getDiscountPct(art);
  const price = formatPrice(art.price);
  const original = formatPrice(art.original_price);
  const isWishlisted = isInWishlist(art.id);
  const isOutOfStock = art.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(art);
  };

  return (
    <div className="pt-6 sm:pt-8 pb-20 sm:pb-24 min-h-screen bg-ghibli-cream/40">
      <div className="page-container max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-20">
          <div className="w-full lg:w-1/2">
            <div className="lg:sticky sticky-below-header-padded">
              <div className="relative aspect-[4/5] bg-ghibli-paper/30 rounded-3xl overflow-hidden shadow-sm">
                <ArtworkImage src={art.image_url} alt={art.title} size="detail" priority />
                {discount && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                    -{discount}%
                  </span>
                )}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                    <span className="px-6 py-3 bg-white/95 text-ghibli-charcoal font-bold tracking-widest uppercase text-xs rounded-full shadow-lg">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-ghibli-wood/70 mb-2">
              Shop · {art.category || 'Collection'}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ghibli-charcoal font-serif tracking-tight mb-4 leading-tight">
              {art.title}
            </h1>

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
              {art.description ||
                'A beautiful handmade piece, crafted with care and intention. Perfect for your home or as a thoughtful gift.'}
            </p>

            <div className="flex flex-col gap-4 mb-10">
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 text-center py-4 rounded-xl font-bold tracking-widest uppercase text-xs sm:text-sm shadow-soft transition-all flex items-center justify-center gap-2 min-h-[48px] ${
                    isOutOfStock
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gold-gradient text-white hover:shadow-luxe hover:-translate-y-0.5'
                  }`}
                >
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => toggleWishlist(art)}
                  className={`min-w-[48px] min-h-[48px] w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${
                    isWishlisted
                      ? 'bg-red-50 border-red-500 text-red-500'
                      : 'bg-white border-ghibli-wood/20 text-ghibli-wood hover:border-ghibli-wood'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </button>
              </div>
              <WhatsAppButton
                href={waUrl}
                className="w-full text-center py-4 rounded-xl bg-[#25D366] text-white font-bold tracking-widest uppercase text-xs sm:text-sm shadow-sm hover:shadow-md transition-all min-h-[48px]"
              >
                Enquire on WhatsApp
              </WhatsAppButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
