import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import PageWayfinding from './components/PageWayfinding';
import Hero from './components/Hero';
import ShopByCategory from './components/ShopByCategory';
import FeaturedPicks from './components/FeaturedPicks';
import Reviews from './components/Reviews';
import ClosingCTA from './components/ClosingCTA';
import Chatbot from './components/Chatbot';
import AdminDashboard from './components/AdminDashboard';
import ResetPassword from './components/ResetPassword';

import HomeAbout from './components/HomeAbout';
import WhyUs from './components/WhyUs';

import { StoreProvider } from './context/StoreContext';
import Shop from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Gallery from './pages/Gallery';
import FullGallery from './components/FullGallery';
import About from './pages/About';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import { ProductsRedirect, ProductSlugRedirect } from './pages/LegacyRedirects';
import RouteSEO from './components/RouteSEO';
import NotFound from './pages/NotFound';

const Home = () => (
  <>
    <Hero />
    <ShopByCategory />
    <FeaturedPicks />
    <HomeAbout />
    <WhyUs />
    <Reviews />
    <ClosingCTA />
  </>
);

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const isResetPassword = location.pathname === '/reset-password';

  return (
    <div className="relative min-h-screen bg-ghibli-cream text-ghibli-charcoal overflow-x-hidden selection:bg-ghibli-gold/30">
      {!isAdmin && !isResetPassword && <SiteHeader />}

      <main className={!isAdmin && !isResetPassword ? 'pt-[var(--site-header-height,72px)]' : ''}>
        {!isAdmin && !isResetPassword && <PageWayfinding />}
        {children}
      </main>

      {!isAdmin && !isResetPassword && (
        <footer className="py-10 sm:py-16 text-center text-ghibli-wood/40 font-bold tracking-[0.2em] text-[10px] relative group uppercase select-none border-t border-ghibli-wood/10">
          <div className="page-container max-w-7xl">
            <div className="flex items-center justify-center gap-2">
              <span>Where devotion meets detail. Visheshkala © 2026</span>
            </div>
          </div>
          <a href="/admin" className="absolute bottom-2 right-4 opacity-0 group-hover:opacity-50 hover:text-ghibli-gold transition-all duration-500" title="Admin Gate">
            🗝️
          </a>
        </footer>
      )}
      {!isAdmin && !isResetPassword && <Chatbot />}
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
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:slug" element={<ProductDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/:category" element={<FullGallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />

            {/* Legacy URLs */}
            <Route path="/products" element={<ProductsRedirect />} />
            <Route path="/product/:slug" element={<ProductSlugRedirect />} />

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </StoreProvider>
  );
};

export default App;
