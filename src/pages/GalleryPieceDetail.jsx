import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useStore } from '../context/StoreContext';
import { getSubCategory, stripMetaFromDescription } from '../lib/artwork';
import useSiteSetting from '../hooks/useSiteSettings';
import { buildWhatsAppUrl, DEFAULT_CHANNELS } from '../lib/enquire';
import { getGalleryPiecePath } from '../lib/pieceUrls';
import ArtworkImage from '../components/ArtworkImage';
import WhatsAppButton from '../components/WhatsAppButton';
import { titleToSlug, isGalleryListing } from '../lib/categoryUtils';
import usePageSEO from '../hooks/usePageSEO';
import {
  buildProductTitle,
  buildProductDescription,
  DEFAULT_OG_IMAGE,
  PAGE_SEO,
  buildCanonical,
} from '../lib/seo';

const GalleryPieceDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [art, setArt] = useState(state?.art || null);
  const [loading, setLoading] = useState(!state?.art);
  const { toggleWishlist, isInWishlist } = useStore();
  const { value: channels } = useSiteSetting('contact_channels', DEFAULT_CHANNELS);
  const piecePath = art ? getGalleryPiecePath(art) : `/gallery/piece/${slug}`;

  const waUrl = useMemo(() => {
    if (!art) return null;
    return buildWhatsAppUrl(art, channels, {
      source: 'gallery-piece',
      slug,
      pageUrl: buildCanonical(piecePath),
    });
  }, [art, channels, slug, piecePath]);

  usePageSEO({
    enabled: Boolean(art),
    title: art ? buildProductTitle(art.title) : PAGE_SEO.gallery.title,
    description: art ? buildProductDescription(art) : PAGE_SEO.gallery.description,
    path: piecePath,
    image: art?.image_url || DEFAULT_OG_IMAGE,
    jsonLd: art
      ? {
          '@context': 'https://schema.org',
          '@type': 'VisualArtwork',
          name: art.title,
          url: buildCanonical(piecePath),
          image: art.image_url,
          artMedium: art.category,
          creator: { '@type': 'Person', name: 'Vishakha Garg' },
        }
      : null,
    type: 'article',
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!art) {
      const fetchItem = async () => {
        try {
          const { data: artworks, error } = await supabase.from('artworks').select('*');
          if (error) throw error;

          const match = (item) => titleToSlug(item.title, item.id) === slug;
          const found = (artworks || []).filter(isGalleryListing).find(match);

          if (found) setArt(found);
          else navigate('/gallery');
        } catch (err) {
          console.error(err);
          navigate('/gallery');
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

  const isWishlisted = isInWishlist(art.id);
  const subCategory = getSubCategory(art);
  const description = stripMetaFromDescription(art.description);

  return (
    <div className="pt-6 sm:pt-8 pb-20 sm:pb-24 min-h-screen bg-ghibli-cream/40">
      <div className="page-container max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-20">
          <div className="w-full lg:w-1/2">
            <div className="lg:sticky sticky-below-header-padded">
              <div className="relative aspect-[4/5] bg-ghibli-paper/30 rounded-3xl overflow-hidden shadow-sm">
                <ArtworkImage src={art.image_url} alt={art.title} size="detail" priority />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-ghibli-wood/70 mb-2">
              Gallery · {art.category || 'Collection'}
              {subCategory ? ` · ${subCategory}` : ''}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ghibli-charcoal font-serif tracking-tight mb-4 leading-tight">
              {art.title}
            </h1>

            <p className="text-base text-ghibli-charcoal/60 mb-8 leading-relaxed">
              A handmade portfolio piece from Visheshkala studio — enquire for availability, custom sizing, or commissioning something similar.
            </p>

            {description && (
              <p className="text-lg text-ghibli-charcoal/70 leading-relaxed mb-10">
                {description}
              </p>
            )}

            <div className="flex flex-col gap-4 mb-8">
              <WhatsAppButton
                href={waUrl}
                className="w-full text-center py-4 rounded-xl bg-[#25D366] text-white font-bold tracking-widest uppercase text-xs sm:text-sm shadow-sm hover:shadow-md transition-all min-h-[48px]"
              >
                Enquire About Piece
              </WhatsAppButton>
              <button
                type="button"
                onClick={() => toggleWishlist(art)}
                className={`w-full py-4 rounded-xl border-2 flex items-center justify-center gap-2 font-bold tracking-widest uppercase text-xs sm:text-sm transition-all min-h-[48px] ${
                  isWishlisted
                    ? 'bg-red-50 border-red-500 text-red-500'
                    : 'bg-white border-ghibli-wood/20 text-ghibli-wood hover:border-ghibli-wood'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                {isWishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
              </button>
            </div>

            <p className="text-[11px] text-ghibli-charcoal/40 break-all">
              {buildCanonical(piecePath)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPieceDetail;
