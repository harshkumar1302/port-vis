import AudioPlayer from './AudioPlayer';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const audioRef = useRef(null);

    const toggleAudio = () => {
        if (audioRef.current) {
            audioRef.current.toggle();
            setIsPlaying((prev) => !prev);
        }
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        // Force Light Mode (Ghibli Default)
        document.documentElement.classList.remove('dark');
        localStorage.removeItem('theme');

        // Setup Intersection Observer for active section highlighting
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id || 'home');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        // Observe sections
        const sections = ['home', 'about', 'gallery', 'fromthestudio', 'contact'];
        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home', id: 'home' },
        { name: 'About', href: '#about', id: 'about' },
        { name: 'Gallery', href: '#gallery', id: 'gallery' },
        { name: 'From the Studio', href: '#fromthestudio', id: 'fromthestudio' },
        { name: 'Contact', href: '#contact', id: 'contact' },
    ];

    return (
        <>
            <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 w-[90%] max-w-4xl`}>
                {/* Dynamic Island Container */}
                <div className={`
                relative flex items-center justify-between px-6 py-3 rounded-full 
                bg-white/80 backdrop-blur-xl 
                border border-white/40 shadow-xl
                transition-all duration-500
                ${scrolled ? 'scale-[0.98] shadow-2xl py-2' : 'scale-100'}
            `}>

                    {/* Logo */}
                    <a href="#" className="font-bold text-xl tracking-tighter text-ghibli-wood hover:scale-105 transition-transform">
                        VG
                    </a>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-semibold transition-all duration-300 relative px-4 py-2 rounded-full ${activeSection === link.id ? 'text-ghibli-wood bg-ghibli-wood/10' : 'text-ghibli-charcoal/60 hover:text-ghibli-charcoal hover:bg-ghibli-charcoal/5'}`}
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Audio Toggle Button (Replacing Key Icon position) */}
                        <button
                            onClick={toggleAudio}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border ${isPlaying
                                ? 'bg-ghibli-gold text-ghibli-cream border-ghibli-gold scale-110 shadow-[0_0_15px_rgba(250,205,96,0.5)]'
                                : 'bg-transparent text-ghibli-charcoal/40 border-ghibli-charcoal/10 hover:border-ghibli-gold hover:text-ghibli-gold'
                                }`}
                            title={isPlaying ? "Pause Music" : "Play Music"}
                        >
                            {isPlaying ? (
                                <span>⏸</span>
                            ) : (
                                <span className="ml-1">▶</span>
                            )}
                        </button>
                        <AudioPlayer ref={audioRef} />

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-2xl text-ghibli-charcoal focus:outline-none"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay - Full Screen & Safe */}
            <div className={`fixed inset-0 z-[90] bg-ghibli-cream/95 backdrop-blur-3xl transition-all duration-500 flex flex-col items-center justify-center gap-8 md:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {navLinks.map((link, idx) => (
                    <a
                        key={link.name}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-2xl font-serif font-bold text-ghibli-wood hover:text-ghibli-wood/80 transition-all duration-300 transform ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                        style={{ transitionDelay: `${idx * 100}ms` }}
                    >
                        {link.name}
                    </a>
                ))}
            </div>
        </>
    );
};

export default Navbar;
