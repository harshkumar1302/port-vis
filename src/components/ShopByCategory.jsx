import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FALLBACK_CATEGORIES } from '../constants/categories';
import { getProductsUrl } from '../lib/categoryUtils';
import { fetchSiteSetting } from '../lib/fetchSettings';
import ArtworkImage from './ArtworkImage';

const CATEGORY_ASSETS = {
  mandala: { fallbackBg: 'bg-[#FCEBEB]', iconColor: 'text-[#D88A92]' },
  miniature: { fallbackBg: 'bg-[#FFF7DF]', iconColor: 'text-[#E5B540]' },
  gift: { fallbackBg: 'bg-[#F5EBE6]', iconColor: 'text-[#A0704F]' },
  diy: { fallbackBg: 'bg-[#F0F4F8]', iconColor: 'text-[#6C8EAB]' },
};

const CATEGORY_ICONS = {
  mandala: '🌀',
  miniature: '🏡',
  gift: '🎁',
  diy: '✂️',
};

const ShopByCategory = () => {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [categoryImages, setCategoryImages] = useState({});
  const [imagesFetched, setImagesFetched] = useState(false);

  useEffect(() => {
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
             if (c && !imgMap[c]) {
               imgMap[c] = art.image_url;
             }
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
  }, []);

  return (
    <section id="shop" className="relative py-20 md:py-28 scroll-mt-28 bg-[#f4f3f0] border-y border-ghibli-wood/5">
      <div className="page-container max-w-[1400px]">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-ghibli-wood/70 text-[10px] font-bold tracking-[0.2em] uppercase mb-3 block">
            Find Your Perfect Piece
          </span>
          <h2 className="text-3xl md:text-[2.75rem] font-bold text-ghibli-charcoal font-sans tracking-tight flex flex-col items-center">
            Shop by Category
            <div className="h-0.5 bg-ghibli-wood/40 mt-4 md:mt-6 rounded-full animate-line-expand" />
          </h2>
        </div>

        {/* 4-Column Grid Container */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {!imagesFetched
            ? categories.map((cat) => (
                <div
                  key={cat.id}
                  className="w-full aspect-square bg-ghibli-wood/10 animate-pulse rounded-none"
                />
              ))
            : categories.map((cat) => {
            const asset = CATEGORY_ASSETS[cat.id] || CATEGORY_ASSETS.gift;
            const displayImage = categoryImages[cat.label.toLowerCase()] || categoryImages[cat.id];

            return (
              <div key={cat.id} className="group flex flex-col gap-4">
                <Link
                  to={getProductsUrl(cat.id)}
                  className="block relative w-full aspect-square overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 rounded-none"
                >
                  <div className="absolute inset-0">
                    {displayImage ? (
                      <ArtworkImage
                        src={displayImage}
                        alt={cat.label}
                        size="category"
                        imgClassName="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${asset.fallbackBg} transition-transform duration-700 ease-out group-hover:scale-110`}>
                        <span className={`text-6xl drop-shadow-sm pb-6 ${asset.iconColor}`}>{CATEGORY_ICONS[cat.id]}</span>
                      </div>
                    )}
                  </div>
                </Link>
                
                <Link to={getProductsUrl(cat.id)} className="flex items-start justify-between text-left group">
                  <h3 className="font-sans text-base md:text-lg font-bold text-ghibli-charcoal group-hover:text-ghibli-wood transition-colors max-w-[85%] leading-tight">
                    {cat.label}
                  </h3>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" height="18" 
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                    className="text-ghibli-charcoal/60 mt-0.5 group-hover:translate-x-1 group-hover:text-ghibli-wood transition-all duration-300 flex-shrink-0"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ShopByCategory;
