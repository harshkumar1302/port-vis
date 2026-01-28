import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import ArtGallery from './components/ArtGallery';
import CreativeWork from './components/CreativeWork';
import Contact from './components/Contact';
import FireflyCursor from './components/FireflyCursor';
import AdminDashboard from './components/AdminDashboard';
import FullGallery from './components/FullGallery';

const Home = () => (
  <>
    <Hero />
    <About />
    <Skills />
    <ArtGallery />
    <CreativeWork />
    <Contact />
  </>
);

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <div className="relative min-h-screen bg-ghibli-cream dark:bg-ghibli-dark-bg text-ghibli-charcoal transition-colors duration-500 overflow-x-hidden selection:bg-ghibli-gold/30">
      <FireflyCursor />
      {!isAdmin && <Navbar />}

      {/* Global Torch Light Effect */}
      <div className="torch-effect" />

      {children}

      {!isAdmin && (
        <footer className="py-16 text-center text-ghibli-wood/40 dark:text-ghibli-paper/20 font-bold tracking-[0.2em] text-[10px] relative group uppercase select-none">
          <div className="flex items-center justify-center gap-2">
            <span>© 2026</span>
            <span className="text-base animate-star translate-y-[-1px]">✨</span>
            <span>CRAFTED IN THE GARDEN OF SMALL THINGS</span>
          </div>
          <a href="/admin" className="absolute bottom-2 right-4 opacity-0 group-hover:opacity-50 hover:text-ghibli-gold transition-all duration-500" title="Admin Gate">
            🗝️
          </a>
        </footer>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/gallery/:category" element={<FullGallery />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

