import { useState, useEffect } from 'react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        // Force Light Mode (Ghibli Default)
        document.documentElement.classList.remove('dark');
        localStorage.removeItem('theme');

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'About', href: '#about' },
        { name: 'Gallery', href: '#gallery' },
        { name: 'Creative Work', href: '#creative-work' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
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
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm font-semibold text-ghibli-charcoal/70 hover:text-ghibli-wood transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ghibli-gold transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {/* Admin Access (Owner Only) */}
                    <a
                        href="/admin"
                        className="w-10 h-10 rounded-full bg-ghibli-cream shadow-md flex items-center justify-center text-base hover:scale-110 transition-all border border-ghibli-wood/20 group relative"
                        title="Owner Login"
                    >
                        🗝️
                        <span className="absolute -bottom-10 right-0 bg-ghibli-charcoal text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Admin Login</span>
                    </a>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-ghibli-charcoal"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-4 p-4 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col gap-4 md:hidden animate-fade-in">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-center py-2 text-ghibli-charcoal font-medium hover:bg-ghibli-gold/10 rounded-xl"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
