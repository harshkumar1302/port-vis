import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FALLBACK_CATEGORIES } from '../constants/categories';
import ProductCardGrid from '../components/ProductCardGrid';
import { fetchSiteSetting } from '../lib/fetchSettings';
import {
  resolveCategoryLabel,
  getCategoryId,
  artMatchesCategory,
  artMatchesSubCategory,
  isProductListing,
} from '../lib/categoryUtils';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);

  const categoryParam = searchParams.get('category') || 'All';
  const subParam = searchParams.get('sub') || null;

  const [activeCategory, setActiveCategory] = useState(() => resolveCategoryLabel(categoryParam, FALLBACK_CATEGORIES));
  const [activeSubCategory, setActiveSubCategory] = useState(subParam);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const label = resolveCategoryLabel(categoryParam, categories);
    setActiveCategory(label);
    setActiveSubCategory(searchParams.get('sub') || null);
  }, [categoryParam, searchParams, categories]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catValue = await fetchSiteSetting('category_definitions', null);
        if (catValue?.length) setCategories(catValue);

        const { data, error } = await supabase
          .from('artworks')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setArtworks(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateUrl = (catLabel, subCat = null) => {
    if (catLabel === 'All') {
      setSearchParams({});
    } else {
      const id = getCategoryId(catLabel, categories);
      const params = { category: id };
      if (subCat) params.sub = subCat;
      setSearchParams(params);
    }
  };

  const handleCategoryClick = (catLabel) => {
    setActiveCategory(catLabel);
    setActiveSubCategory(null);
    updateUrl(catLabel, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubCategoryClick = (catLabel, subCatLabel) => {
    setActiveCategory(catLabel);
    setActiveSubCategory(subCatLabel);
    updateUrl(catLabel, subCatLabel);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const catalogItems = useMemo(() => {
    return artworks.filter(isProductListing);
  }, [artworks]);

  const getFilteredAndSorted = () => {
    let filtered = catalogItems;

    if (activeCategory !== 'All') {
      filtered = filtered.filter(
        (art) =>
          artMatchesCategory(art, activeCategory, categories) &&
          artMatchesSubCategory(art, activeSubCategory)
      );
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
      return new Date(b.created_at) - new Date(a.created_at);
    });
  };

  const displayArtworks = getFilteredAndSorted();
  const activeCatDef = categories.find((c) => c.label === activeCategory);

  return (
    <div className="pt-6 sm:pt-8 pb-20 sm:pb-24 min-h-screen bg-ghibli-cream/40">
      <div className="page-container max-w-[1400px]">

        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ghibli-charcoal font-serif tracking-tight mb-4">
            {activeCategory === 'All' ? 'Shop' : activeCategory}
          </h1>
          <p className="text-ghibli-charcoal/70 max-w-2xl text-base sm:text-lg">
            {activeCategory === 'All'
              ? 'Handmade art and studio merchandise — everything available to order.'
              : activeSubCategory
                ? `${activeSubCategory} within ${activeCategory}.`
                : `All ${activeCategory} pieces in one place.`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          <div className="w-full lg:w-64 flex-shrink-0 lg:sticky sticky-below-header-padded self-start">
            <div className="hidden lg:block bg-white/50 backdrop-blur-md rounded-3xl p-6 border border-ghibli-wood/10 shadow-sm">
              <h3 className="font-bold text-ghibli-charcoal uppercase tracking-widest text-xs mb-6 text-ghibli-wood/80">
                Categories
              </h3>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => handleCategoryClick('All')}
                    className={`text-left w-full font-bold transition-all ${activeCategory === 'All' ? 'text-ghibli-wood' : 'text-ghibli-charcoal/60 hover:text-ghibli-charcoal'}`}
                  >
                    All Products
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id} className="pt-2">
                    <button
                      onClick={() => handleCategoryClick(cat.label)}
                      className={`text-left w-full font-bold transition-all ${activeCategory === cat.label && !activeSubCategory ? 'text-ghibli-wood' : 'text-ghibli-charcoal/80 hover:text-ghibli-charcoal'}`}
                    >
                      {cat.label}
                    </button>
                    {activeCategory === cat.label && cat.subCategories?.length > 0 && (
                      <ul className="mt-2 ml-4 space-y-2 border-l-2 border-ghibli-wood/10 pl-3">
                        {cat.subCategories.map((subCat) => (
                          <li key={subCat}>
                            <button
                              onClick={() => handleSubCategoryClick(cat.label, subCat)}
                              className={`text-left w-full text-sm transition-all ${
                                activeSubCategory === subCat
                                  ? 'text-ghibli-wood font-bold'
                                  : 'text-ghibli-charcoal/60 hover:text-ghibli-charcoal'
                              }`}
                            >
                              {subCat}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:hidden w-full overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6">
              <div className="flex gap-2 min-w-max">
                <button
                  onClick={() => handleCategoryClick('All')}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold tracking-wider uppercase transition-all whitespace-nowrap border min-h-[44px] ${
                    activeCategory === 'All'
                      ? 'bg-ghibli-wood text-white border-ghibli-wood shadow-md'
                      : 'bg-white text-ghibli-charcoal/70 border-ghibli-wood/10'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.label)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold tracking-wider uppercase transition-all whitespace-nowrap border min-h-[44px] ${
                      activeCategory === cat.label && !activeSubCategory
                        ? 'bg-ghibli-wood text-white border-ghibli-wood shadow-md'
                        : 'bg-white text-ghibli-charcoal/70 border-ghibli-wood/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              {activeCatDef?.subCategories?.length > 0 && (
                <div className="flex gap-2 min-w-max mt-3">
                  {activeCatDef.subCategories.map((subCat) => (
                    <button
                      key={subCat}
                      onClick={() => handleSubCategoryClick(activeCategory, subCat)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                        activeSubCategory === subCat
                          ? 'bg-ghibli-wood/10 text-ghibli-wood border-ghibli-wood'
                          : 'bg-white/50 text-ghibli-charcoal/60 border-ghibli-wood/10 border-dashed'
                      }`}
                    >
                      {subCat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-ghibli-wood/10">
              <div className="text-sm font-bold text-ghibli-charcoal/60 uppercase tracking-widest">
                {!loading ? `${displayArtworks.length} ${displayArtworks.length === 1 ? 'piece' : 'pieces'}` : 'Loading…'}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 rounded-full bg-white border border-ghibli-wood/10 text-sm font-bold text-ghibli-charcoal focus:outline-none cursor-pointer shadow-sm w-full sm:w-auto min-h-[44px]"
              >
                <option value="featured">Newest first</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
              </select>
            </div>

            <div className="min-h-[500px]">
              <ProductCardGrid
                items={displayArtworks}
                dataLoading={loading}
                empty={
                  <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-ghibli-wood/10">
                    <div className="text-5xl mb-4 opacity-50">🎨</div>
                    <h3 className="text-xl font-bold text-ghibli-charcoal font-serif mb-2">Nothing here yet</h3>
                    <p className="text-ghibli-charcoal/60 mb-6">
                      No pieces in this category right now — check back soon, or browse everything.
                    </p>
                    <button
                      onClick={() => handleCategoryClick('All')}
                      className="px-6 py-2 rounded-full bg-ghibli-wood text-white font-bold text-sm hover:bg-ghibli-wood/80 transition-all"
                    >
                      View all products
                    </button>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
