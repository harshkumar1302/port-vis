import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import Analytics from './components/Analytics';
import PageWayfinding from './components/PageWayfinding';
import Hero from './components/Hero';
import ShopByCategory from './components/ShopByCategory';
import FeaturedPicks from './components/FeaturedPicks';
import RouteSEO from './components/RouteSEO';
import ShopPageSkeleton from './components/skeletons/ShopPageSkeleton';
import GalleryPageSkeleton from './components/skeletons/GalleryPageSkeleton';
import FullGalleryPageSkeleton from './components/skeletons/FullGalleryPageSkeleton';

import { StoreProvider } from './context/StoreContext';
import { ProductsRedirect, ProductSlugRedirect } from './pages/LegacyRedirects';

const HomeAbout = lazy(() => import('./components/HomeAbout'));
const WhyUs = lazy(() => import('./components/WhyUs'));
const Reviews = lazy(() => import('./components/Reviews'));
const ClosingCTA = lazy(() => import('./components/ClosingCTA'));
const Chatbot = lazy(() => import('./components/Chatbot'));

const Shop = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Gallery = lazy(() => import('./pages/Gallery'));
const GalleryPieceDetail = lazy(() => import('./pages/GalleryPieceDetail'));
const FullGallery = lazy(() => import('./components/FullGallery'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const ResetPassword = lazy(() => import('./components/ResetPassword'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PageFallback = () => (
  <div className="min-h-[50vh] animate-pulse bg-ghibli-cream/40" aria-hidden />
);

const BelowFold = ({ children }) => (
  <Suspense fallback={null}>{children}</Suspense>
);

const Home = () => (
  <>
    <Hero />
    <ShopByCategory />
    <FeaturedPicks />
    <BelowFold>
      <WhyUs />
      <Reviews />
      <ClosingCTA />
    </BelowFold>
  </>
);

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const isResetPassword = location.pathname === '/reset-password';

  return (
    <div className="relative min-h-screen bg-ghibli-cream text-ghibli-charcoal overflow-x-hidden selection:bg-ghibli-gold/30">
      {!isAdmin && !isResetPassword && <SiteHeader />}

      <main className={!isAdmin && !isResetPassword ? 'pt-[var(--site-header-height,52px)]' : ''}>
        {!isAdmin && !isResetPassword && <PageWayfinding />}
        <Suspense fallback={null}>{children}</Suspense>
      </main>

      {!isAdmin && !isResetPassword && (
        <SiteFooter />
      )}
      {!isAdmin && !isResetPassword && (
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
      )}
    </div>
  );
};

const ScrollToHash = () => {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '');
    const timer = window.setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    return () => window.clearTimeout(timer);
  }, [hash, pathname]);
  return null;
};

const App = () => {
  return (
    <StoreProvider>
      <Router>
        <ScrollToHash />
        <RouteSEO />
        <Analytics />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Suspense fallback={<ShopPageSkeleton />}><Shop /></Suspense>} />
            <Route path="/shop/:slug" element={<Suspense fallback={<PageFallback />}><ProductDetail /></Suspense>} />
            <Route path="/gallery/piece/:slug" element={<Suspense fallback={<PageFallback />}><GalleryPieceDetail /></Suspense>} />
            <Route path="/gallery" element={<Suspense fallback={<GalleryPageSkeleton />}><Gallery /></Suspense>} />
            <Route path="/gallery/:category" element={<Suspense fallback={<FullGalleryPageSkeleton />}><FullGallery /></Suspense>} />
            <Route path="/about" element={<Suspense fallback={<PageFallback />}><About /></Suspense>} />
            <Route path="/contact" element={<Suspense fallback={<PageFallback />}><Contact /></Suspense>} />
            <Route path="/wishlist" element={<Suspense fallback={<PageFallback />}><Wishlist /></Suspense>} />
            <Route path="/cart" element={<Suspense fallback={<PageFallback />}><Cart /></Suspense>} />
            <Route path="/checkout" element={<Suspense fallback={<PageFallback />}><Checkout /></Suspense>} />
            <Route path="/privacy" element={<Suspense fallback={<PageFallback />}><PrivacyPolicy /></Suspense>} />

            <Route path="/products" element={<ProductsRedirect />} />
            <Route path="/product/:slug" element={<ProductSlugRedirect />} />

            <Route path="/admin" element={<Suspense fallback={<PageFallback />}><AdminDashboard /></Suspense>} />
            <Route path="/reset-password" element={<Suspense fallback={<PageFallback />}><ResetPassword /></Suspense>} />
            <Route path="*" element={<Suspense fallback={<PageFallback />}><NotFound /></Suspense>} />
          </Routes>
        </Layout>
      </Router>
    </StoreProvider>
  );
};

export default App;
