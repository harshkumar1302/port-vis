import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FALLBACK_CATEGORIES } from '../constants/categories';
import ProductCardGrid from '../components/ProductCardGrid';
import ShopPageSkeleton from '../components/skeletons/ShopPageSkeleton';
import { fetchSiteSetting } from '../lib/fetchSettings';
import { useArtworksCatalog } from '../hooks/useArtworksCatalog';
import {
  resolveCategoryLabel,
  getCategoryId,
  artMatchesCategory,
  artMatchesSubCategory,
  isProductListing,
} from '../lib/categoryUtils';

const FilterSelect = ({ label, value, onChange, children, className = '' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    {label && <span className="text-sm text-ghibli-charcoal/70 whitespace-nowrap">{label}</span>}
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="appearance-none pl-3 pr-8 py-2 text-sm font-medium text-ghibli-charcoal bg-transparent border border-ghibli-charcoal/15 rounded-md cursor-pointer hover:border-ghibli-charcoal/40 focus:outline-none focus:border-ghibli-charcoal min-h-[40px]"
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-ghibli-charcoal/50"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
      </svg>
    </div>
  </div>
);

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { artworks, loading } = useArtworksCatalog();
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);

  const categoryParam = searchParams.get('category') || 'All';
  const subParam = searchParams.get('sub') || null;

  const [activeCategory, setActiveCategory] = useState(() => resolveCategoryLabel(categoryParam, FALLBACK_CATEGORIES));
  const [activeSubCategory, setActiveSubCategory] = useState(subParam);
  const [sortBy, setSortBy] = useState('featured');
  const [priceFilter, setPriceFilter] = useState('all');
  const [availability, setAvailability] = useState('all');

  useEffect(() => {
    const label = resolveCategoryLabel(categoryParam, categories);
    setActiveCategory(label);
    setActiveSubCategory(searchParams.get('sub') || null);
  }, [categoryParam, searchParams, categories]);

  useEffect(() => {
    fetchSiteSetting('category_definitions', null).then((catValue) => {
      if (catValue?.length) setCategories(catValue);
    });
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

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    if (val === 'All') {
      setActiveCategory('All');
      setActiveSubCategory(null);
      updateUrl('All', null);
    } else {
      const [catLabel, subCat] = val.includes('::') ? val.split('::') : [val, null];
      setActiveCategory(catLabel);
      setActiveSubCategory(subCat);
      updateUrl(catLabel, subCat);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const catalogItems = useMemo(() => artworks.filter(isProductListing), [artworks]);

  const categorySelectValue = useMemo(() => {
    if (activeCategory === 'All') return 'All';
    if (activeSubCategory) return `${activeCategory}::${activeSubCategory}`;
    return activeCategory;
  }, [activeCategory, activeSubCategory]);

  const displayArtworks = useMemo(() => {
    let filtered = catalogItems;

    if (activeCategory !== 'All') {
      filtered = filtered.filter(
        (art) =>
          artMatchesCategory(art, activeCategory, categories) &&
          artMatchesSubCategory(art, activeSubCategory)
      );
    }

    if (priceFilter === 'under500') filtered = filtered.filter((a) => (a.price || 0) < 500);
    if (priceFilter === '500-1500') filtered = filtered.filter((a) => (a.price || 0) >= 500 && (a.price || 0) <= 1500);
    if (priceFilter === 'over1500') filtered = filtered.filter((a) => (a.price || 0) > 1500);

    if (availability === 'instock') filtered = filtered.filter((a) => a.stock !== 0);

    return [...filtered].sort((a, b) => {
      if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [catalogItems, activeCategory, activeSubCategory, categories, priceFilter, availability, sortBy]);

  const pageTitle = activeCategory === 'All' ? 'Shop' : activeSubCategory || activeCategory;

  if (loading) {
    return <ShopPageSkeleton />;
  }

  return (
    <div className="pt-6 sm:pt-10 pb-20 sm:pb-24 min-h-screen bg-[#FBF8EC]">
      <div className="page-container max-w-[1400px]">

        <header className="mb-8 md:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-ghibli-charcoal tracking-tight mb-2">
            {pageTitle}
          </h1>
          {activeCategory !== 'All' && (
            <p className="text-sm text-ghibli-charcoal/60">
              Handmade pieces from Visheshkala studio
            </p>
          )}
        </header>

        {/* Filter bar — afzaai-style */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 pb-6 border-b border-ghibli-charcoal/10">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="text-sm font-medium text-ghibli-charcoal">Filter:</span>

            <FilterSelect value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
              <option value="all">Price</option>
              <option value="under500">Under Rs. 500</option>
              <option value="500-1500">Rs. 500 – 1,500</option>
              <option value="over1500">Over Rs. 1,500</option>
            </FilterSelect>

            <FilterSelect value={availability} onChange={(e) => setAvailability(e.target.value)}>
              <option value="all">Availability</option>
              <option value="instock">In stock</option>
            </FilterSelect>

            <FilterSelect value={categorySelectValue} onChange={handleCategoryChange}>
              <option value="All">Category</option>
              {categories.map((cat) => (
                <optgroup key={cat.id} label={cat.label}>
                  <option value={cat.label}>{cat.label} — all</option>
                  {cat.subCategories?.map((sub) => (
                    <option key={sub} value={`${cat.label}::${sub}`}>
                      {sub}
                    </option>
                  ))}
                </optgroup>
              ))}
            </FilterSelect>
          </div>

          <div className="flex flex-wrap items-center gap-4 lg:gap-6">
            <span className="text-sm text-ghibli-charcoal/60">
              {`${displayArtworks.length} products`}
            </span>
            <FilterSelect label="Sort by:" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="title">Alphabetically, A–Z</option>
              <option value="price_asc">Price, low to high</option>
              <option value="price_desc">Price, high to low</option>
            </FilterSelect>
          </div>
        </div>

        <ProductCardGrid
          items={displayArtworks}
          dataLoading={false}
          variant="shop"
          empty={
            <div className="text-center py-24">
              <h3 className="text-xl font-bold text-ghibli-charcoal mb-2">No products found</h3>
              <p className="text-ghibli-charcoal/60 mb-6">
                Try changing your filters, or browse the full collection.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('All');
                  setActiveSubCategory(null);
                  setPriceFilter('all');
                  setAvailability('all');
                  updateUrl('All', null);
                }}
                className="px-6 py-3 border border-ghibli-charcoal rounded-md text-sm font-medium hover:bg-[#ebe8e4] transition-colors"
              >
                View all products
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Shop;
