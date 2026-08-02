import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AnnouncementBar from './components/AnnouncementBar';
import Hero from './components/Hero';
import ShopByCategory from './components/ShopByCategory';
import FeaturedPicks from './components/FeaturedPicks';
import Reviews from './components/Reviews';
import ClosingCTA from './components/ClosingCTA';
import Chatbot from './components/Chatbot';
import GalleryRedirect from './pages/GalleryRedirect';
import AdminDashboard from './components/AdminDashboard';
import Loader from './components/Loader';
import ResetPassword from './components/ResetPassword';

import HomeAbout from './components/HomeAbout';
import WhyUs from './components/WhyUs';

// New Pages & Context
import { StoreProvider } from './context/StoreContext';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';

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
    <div className="relative min-h-screen bg-ghibli-cream text-ghibli-charcoal transition-colors duration-500 overflow-x-hidden selection:bg-ghibli-gold/30">
      {!isAdmin && !isResetPassword && <AnnouncementBar />}
      {!isAdmin && !isResetPassword && <Navbar />}

      {children}

      {!isAdmin && !isResetPassword && (
        <footer className="py-16 text-center text-ghibli-wood/40 font-bold tracking-[0.2em] text-[10px] relative group uppercase select-none border-t border-ghibli-wood/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
            <div className="flex items-center justify-center gap-2">
              <span>Where devotion meets detail. VisheshKala © 2026</span>
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
  const [isLoading, setIsLoading] = useState(true);

  return (
    <StoreProvider>
      {isLoading && <Loader onFinished={() => setIsLoading(false)} />}
      <Router>
        <ScrollToHash />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            {/* Old gallery URLs → products with category filter */}
            <Route path="/gallery/:categoryId" element={<GalleryRedirect />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </Router>
    </StoreProvider>
  );
};

export default App;
