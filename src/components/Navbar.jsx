import AudioPlayer from './AudioPlayer';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasAnnouncement, setHasAnnouncement] = useState(true);
    const audioRef = useRef(null);
    const location = useLocation();
    const { cartCount, wishlistCount } = useStore();

    const toggleAudio = () => {
        if (audioRef.current) {
            audioRef.current.toggle();
            setIsPlaying((prev) => !prev);
        }
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        document.documentElement.classList.remove('dark');
        localStorage.removeItem('theme');

        const dismissed = sessionStorage.getItem('visheshkala_announcement_dismissed') === '1';
        setHasAnnouncement(!dismissed);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const topOffset = hasAnnouncement ? 'top-7' : 'top-0';

    return (
        <>
            <nav className={`fixed ${topOffset} left-0 right-0 z-[100] transition-all duration-300 w-full`}>
                <div className={`
                relative flex items-center justify-between px-6 md:px-12 py-4 
                bg-white/95 backdrop-blur-xl 
                border-b border-ghibli-wood/10 shadow-sm
                transition-all duration-300
                ${scrolled ? 'py-2.5 shadow-md bg-white/98' : ''}
            `}>
                    <Link to="/" className="font-bold text-xl tracking-tighter text-ghibli-wood hover:scale-105 transition-transform flex items-center gap-1.5">
                        <span className="text-2xl">✨</span>
                        Visheshkala
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`text-sm font-semibold transition-all duration-300 relative px-4 py-2 rounded-full ${location.pathname === link.href ? 'text-ghibli-wood bg-ghibli-wood/10' : 'text-ghibli-charcoal/60 hover:text-ghibli-charcoal hover:bg-ghibli-charcoal/5'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        
                        <Link to="/wishlist" className="relative w-10 h-10 rounded-full flex items-center justify-center text-ghibli-charcoal/60 hover:bg-ghibli-paper hover:text-ghibli-wood transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                            {wishlistCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-ghibli-gold text-ghibli-charcoal text-[10px] font-bold flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        <Link to="/cart" className="relative w-10 h-10 rounded-full flex items-center justify-center text-ghibli-charcoal/60 hover:bg-ghibli-paper hover:text-ghibli-wood transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-ghibli-gold text-ghibli-charcoal text-[10px] font-bold flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <div className="w-px h-6 bg-ghibli-charcoal/10 mx-1 hidden md:block"></div>

                        <button
                            onClick={toggleAudio}
                            className={`w-10 h-10 rounded-full hidden md:flex items-center justify-center transition-all duration-300 border ${isPlaying
                                ? 'bg-ghibli-gold text-ghibli-cream border-ghibli-gold shadow-[0_0_15px_rgba(250,205,96,0.5)]'
                                : 'bg-transparent text-ghibli-charcoal/40 border-ghibli-charcoal/10 hover:border-ghibli-gold hover:text-ghibli-gold'
                                }`}
                            title={isPlaying ? 'Pause Music' : 'Play Music'}
                        >
                            {isPlaying ? <span>⏸</span> : <span className="ml-0.5">▶</span>}
                        </button>
                        <AudioPlayer ref={audioRef} />

                        <button
                            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-ghibli-charcoal hover:bg-ghibli-paper focus:outline-none"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>
            </nav>

            <div className={`fixed inset-0 z-[90] bg-ghibli-cream/95 backdrop-blur-3xl transition-all duration-500 flex flex-col items-center justify-center gap-8 md:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {navLinks.map((link, idx) => (
                    <Link
                        key={link.name}
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-2xl font-serif font-bold text-ghibli-wood hover:text-ghibli-wood/80 transition-all duration-300 transform ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                        style={{ transitionDelay: `${idx * 100}ms` }}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>
        </>
    );
};

export default Navbar;
