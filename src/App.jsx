import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import FontSwitcher from './components/FontSwitcher';
import Skills from './components/Skills';
import ArtGallery from './components/ArtGallery';
import FromTheStudio from './components/FromTheStudio';
import Contact from './components/Contact';

import AdminDashboard from './components/AdminDashboard';
import FullGallery from './components/FullGallery';
import Loader from './components/Loader';

import ResetPassword from './components/ResetPassword';

const Home = () => (
  <>
    <Hero />
    <About />
    <Skills />
    <ArtGallery />
    <FromTheStudio />
    <Contact />
  </>
);

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const isResetPassword = location.pathname === '/reset-password';

  return (
    <div className="relative min-h-screen bg-ghibli-cream text-ghibli-charcoal transition-colors duration-500 overflow-x-hidden selection:bg-ghibli-gold/30">

      {!isAdmin && !isResetPassword && <Navbar />}



      {children}

      {!isAdmin && !isResetPassword && (
        <footer className="py-16 text-center text-ghibli-wood/40 font-bold tracking-[0.2em] text-[10px] relative group uppercase select-none border-t border-ghibli-wood/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
            <div className="flex items-center justify-center gap-2">
              <span>Where devotion meets detail.
                VisheshKala
                © 2026 </span>
            </div>
          </div>
          <a href="/admin" className="absolute bottom-2 right-4 opacity-0 group-hover:opacity-50 hover:text-ghibli-gold transition-all duration-500" title="Admin Gate">
            🗝️
          </a>
          <FontSwitcher />
        </footer>
      )}
    </div>
  );
};

const ScrollToHash = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  return null;
};

// 🌊 Smooth Scroll implementation using Lenis
import Lenis from 'lenis';

const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0, // slightly faster
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: true,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
  return null;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Loader onFinished={() => setIsLoading(false)} />}
      <Router>
        <SmoothScroll />
        <ScrollToHash />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/gallery/:category" element={<FullGallery />} />
            {/* Fallback for unknown routes */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </Router>
    </>
  );
};

export default App;

