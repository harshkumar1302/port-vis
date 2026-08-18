import AudioPlayer from './AudioPlayer';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { collectImageUrls, preloadImagesBackground } from '../lib/preloadImages';
import { motion, AnimatePresence } from 'framer-motion';

const iconBtn =
  'relative flex items-center justify-center w-9 h-9 rounded-full text-ghibli-charcoal/55 hover:text-ghibli-wood hover:bg-ghibli-paper/80 transition-colors';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const location = useLocation();
    const { cart, wishlist, cartCount, wishlistCount } = useStore();

    const toggleAudio = () => {
        if (audioRef.current) {
            audioRef.current.toggle();
            setIsPlaying((prev) => !prev);
        }
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/shop' },
        { name: 'Gallery', href: '/gallery' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const isNavActive = (href) => {
        if (href === '/') return location.pathname === '/';
        return location.pathname === href || location.pathname.startsWith(`${href}/`);
    };

    const prefetchWishlist = () => {
        preloadImagesBackground(collectImageUrls(wishlist, 'image_url', 'card'));
    };

    const prefetchCart = () => {
        preloadImagesBackground(collectImageUrls(cart, 'image_url', 'thumb'));
    };

    return (
        <>
            <nav className="relative w-full" aria-label="Main">
                <div
                    className={`flex items-center justify-between gap-4 px-4 sm:px-5 md:px-8 lg:px-10 transition-[padding] duration-200 ${
                        scrolled ? 'py-1.5' : 'py-2'
                    }`}
                >
                    <Link
                        to="/"
                        aria-label="Visheshkala home"
                        className="font-serif font-bold text-[15px] sm:text-base tracking-tight text-ghibli-wood hover:text-ghibli-charcoal transition-colors shrink-0"
                    >
                        <span className="hidden sm:inline">Visheshkala</span>
                        <span className="sm:hidden">VK</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`text-[11px] lg:text-xs font-semibold uppercase tracking-[0.12em] px-2.5 lg:px-3 py-1.5 rounded-md transition-colors ${
                                    isNavActive(link.href)
                                        ? 'text-ghibli-wood bg-ghibli-wood/8'
                                        : 'text-ghibli-charcoal/55 hover:text-ghibli-charcoal hover:bg-ghibli-charcoal/5'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-1 sm:gap-1.5">
                        <Link
                            to="/wishlist"
                            onMouseEnter={prefetchWishlist}
                            onFocus={prefetchWishlist}
                            onTouchStart={prefetchWishlist}
                            aria-label={wishlistCount > 0 ? `Wishlist, ${wishlistCount} items` : 'Wishlist'}
                            className={iconBtn}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                            {wishlistCount > 0 && (
                                <AnimatePresence mode="popLayout">
                                    <motion.span
                                        key={wishlistCount}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: [1.4, 1], opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm"
                                        aria-hidden="true"
                                    >
                                        {wishlistCount}
                                    </motion.span>
                                </AnimatePresence>
                            )}
                        </Link>

                        <Link
                            to="/cart"
                            onMouseEnter={prefetchCart}
                            onFocus={prefetchCart}
                            onTouchStart={prefetchCart}
                            aria-label={cartCount > 0 ? `Shopping cart, ${cartCount} items` : 'Shopping cart'}
                            className={iconBtn}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-0.5 rounded-full bg-ghibli-gold text-ghibli-charcoal text-[9px] font-bold flex items-center justify-center" aria-hidden="true">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <button
                            type="button"
                            onClick={toggleAudio}
                            aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
                            className={`hidden md:flex w-8 h-8 items-center justify-center rounded-full transition-colors border text-xs ${
                                isPlaying
                                    ? 'bg-ghibli-gold/15 text-ghibli-wood border-ghibli-gold/40'
                                    : 'bg-transparent text-ghibli-charcoal/40 border-transparent hover:border-ghibli-wood/20 hover:text-ghibli-wood'
                            }`}
                        >
                            {isPlaying ? '⏸' : '▶'}
                        </button>
                        <AudioPlayer ref={audioRef} />

                        <button
                            type="button"
                            className={`md:hidden ${iconBtn}`}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            <div
                className={`fixed inset-0 z-[120] bg-white/95 backdrop-blur-md transition-all duration-300 flex flex-col pt-[var(--site-header-height,52px)] md:hidden ${
                    mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                aria-hidden={!mobileMenuOpen}
            >
                <div className="flex flex-col px-6 py-4 gap-1 border-b border-ghibli-wood/10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`text-sm font-semibold py-3 border-b border-ghibli-wood/5 last:border-0 ${
                                isNavActive(link.href) ? 'text-ghibli-wood' : 'text-ghibli-charcoal/70'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Navbar;
