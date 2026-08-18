import { Link } from 'react-router-dom';
import { SITE_EMAIL } from '../constants/site';
import NewsletterSignup from './NewsletterSignup';

const EXPLORE_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const SiteFooter = () => {
  return (
    <footer className="relative mt-auto border-t border-ghibli-wood/10 bg-[#f5f0e6]">
      <div className="absolute inset-0 bg-gradient-to-b from-ghibli-cream/50 to-transparent pointer-events-none" />

      <div className="page-container max-w-7xl relative py-14 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block font-serif text-2xl sm:text-3xl text-ghibli-charcoal hover:text-ghibli-wood transition-colors mb-4">
              Visheshkala
            </Link>
            <p className="text-sm text-ghibli-charcoal/60 leading-relaxed max-w-sm mb-6">
              Handmade mandalas, miniatures &amp; gifts by Vishakha Garg — slow-made art from India, crafted with devotion and detail.
            </p>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ghibli-wood/60 mb-3">
              Studio email
            </p>
            <a
              href={`mailto:${SITE_EMAIL}`}
              className="text-sm font-semibold text-ghibli-charcoal hover:text-ghibli-wood transition-colors break-all"
            >
              {SITE_EMAIL}
            </a>
          </div>

          {/* Explore */}
          <div className="lg:col-span-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ghibli-wood/70 mb-4">
              Explore
            </p>
            <nav className="flex flex-col gap-2.5" aria-label="Footer navigation">
              {EXPLORE_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm font-semibold text-ghibli-charcoal/65 hover:text-ghibli-wood transition-colors w-fit"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-5 sm:col-span-2">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ghibli-wood/70 mb-4">
              Newsletter
            </p>
            <NewsletterSignup variant="footer" />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-ghibli-wood/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-[11px] font-semibold text-ghibli-charcoal/45 tracking-wide">
            Where devotion meets detail · Visheshkala © {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-5 text-[11px] font-bold uppercase tracking-widest">
            <Link to="/privacy" className="text-ghibli-charcoal/45 hover:text-ghibli-wood transition-colors">
              Privacy
            </Link>
            <span className="text-ghibli-wood/20" aria-hidden="true">·</span>
            <Link to="/contact" className="text-ghibli-charcoal/45 hover:text-ghibli-wood transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
