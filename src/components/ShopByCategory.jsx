import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FALLBACK_CATEGORIES } from '../constants/categories';
import { getProductsUrl } from '../lib/categoryUtils';
import { fetchSiteSetting } from '../lib/fetchSettings';
import ArtworkImage from './ArtworkImage';
import { useInView } from '../hooks/useInView';

// Fallbacks if no product image is found in a category
const CATEGORY_ASSETS = {
  mandala: { fallbackColor: 'from-[#E8B4B8] to-[#D88A92]' },
  miniature: { fallbackColor: 'from-[#FACD60] to-[#E5B540]' },
  gift: { fallbackColor: 'from-[#A0704F] to-[#805030]' },
  diy: { fallbackColor: 'from-ghibli-navy to-ghibli-charcoal' },
};

const CATEGORY_ICONS = {
  mandala: '🌀',
  miniature: '🏡',
  gift: '🎁',
  diy: '✂️',
};

const ShopByCategory = () => {
  const [sectionRef, inView] = useInView('320px');
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [categoryImages, setCategoryImages] = useState({});
  const [imagesFetched, setImagesFetched] = useState(false);

  useEffect(() => {
    if (!inView) return;

    fetchSiteSetting('category_definitions', null).then((value) => {
      if (value?.length) setCategories(value);
    });

    const fetchCategoryImages = async () => {
      try {
        const { data, error } = await supabase
          .from('artworks')
          .select('category, image_url')
          .not('image_url', 'is', null)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const imgMap = {};
        if (data) {
          data.forEach(art => {
             const c = art.category?.toLowerCase() || '';
             // Grab the newest image for every category present in the db
             if (c && !imgMap[c]) {
               imgMap[c] = art.image_url;
             }
             
             // Also keep backwards compatibility for fallback categories
             if (c.includes('mandala') && !imgMap['mandala']) imgMap['mandala'] = art.image_url;
             if (c.includes('miniature') && !imgMap['miniature']) imgMap['miniature'] = art.image_url;
             if (c.includes('gift') && !imgMap['gift']) imgMap['gift'] = art.image_url;
             if (c.includes('diy') && !imgMap['diy']) imgMap['diy'] = art.image_url;
          });
          setCategoryImages(imgMap);
        }
      } catch (err) {
        console.error('Error fetching category thumbnails:', err);
      } finally {
        setImagesFetched(true);
      }
    };

    fetchCategoryImages();
  }, [inView]);

  return (
    <section ref={sectionRef} id="shop" className="defer-section relative py-20 md:py-24 scroll-mt-28 bg-ghibli-cream/20 border-b border-ghibli-wood/5">
      <div className="page-container max-w-[1400px]">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-ghibli-wood/70 text-[10px] font-bold tracking-[0.2em] uppercase mb-3 block">
            Find Your Perfect Piece
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-ghibli-charcoal font-serif tracking-tight flex flex-col items-center">
            Shop by Category
            <div className="h-0.5 w-16 bg-ghibli-wood/40 mt-6 rounded-full" />
          </h2>
        </div>

        {/* Scrollable Container for Cards */}
        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 snap-x snap-mandatory scrollbar-hide overscroll-x-contain -mx-6 px-6 md:mx-0 md:px-0">
          {!imagesFetched
            ? categories.map((cat) => (
                <div
                  key={cat.id}
                  className="snap-start shrink-0 w-[280px] md:w-[320px] lg:w-[calc(25%-1.125rem)] aspect-[4/3] rounded-3xl bg-ghibli-wood/10 animate-pulse"
                />
              ))
            : categories.map((cat) => {
            const asset = CATEGORY_ASSETS[cat.id] || CATEGORY_ASSETS.gift;
            // Use dynamically fetched product image (prefer exact match on label, fall back to id keywords)
            const displayImage = categoryImages[cat.label.toLowerCase()] || categoryImages[cat.id];

            return (
              <div
                key={cat.id}
                className="snap-start shrink-0 w-[280px] md:w-[320px] lg:w-[calc(25%-1.125rem)]"
              >
                <Link
                  to={getProductsUrl(cat.id)}
                  className="group relative block aspect-[4/3] rounded-3xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-500 bg-ghibli-paper"
                >
                  {/* Background Image or Placeholder */}
                  <div className="absolute inset-0 bg-ghibli-paper">
                    {displayImage ? (
                      <ArtworkImage
                        src={displayImage}
                        alt={cat.label}
                        size="category"
                        imgClassName="transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : null}
                    
                    {/* Placeholder gradient fallback (shows if no image, or if image fails to load via CSS sibling logic) */}
                    <div className={`absolute inset-0 ${displayImage ? 'hidden' : 'flex'} items-center justify-center bg-gradient-to-br ${asset.fallbackColor} transition-transform duration-700 ease-in-out group-hover:scale-105`}>
                       <span className="text-6xl drop-shadow-md pb-6">{CATEGORY_ICONS[cat.id]}</span>
                    </div>
                  </div>
                  
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ghibli-charcoal/90 via-ghibli-charcoal/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                  
                  {/* Text Content */}
                  <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col">
                    <h3 className="font-serif text-2xl font-bold text-white mb-1 drop-shadow-sm">
                      {cat.label}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 font-sans text-sm font-bold text-[#E8B4B8] group-hover:text-[#D88A92] transition-colors">
                      Shop Now
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1.5">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* View All Products Button */}
        <div className="mt-6 flex justify-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-transparent border border-ghibli-charcoal/20 text-ghibli-charcoal font-bold text-sm hover:bg-white hover:border-ghibli-charcoal/30 hover:shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span>View All Products</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ShopByCategory;
