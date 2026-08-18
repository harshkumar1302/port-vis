import { useState } from 'react';
import useSiteSetting from '../hooks/useSiteSettings';
import { buildInstagramUrl, DEFAULT_CHANNELS } from '../lib/enquire';
import { Link } from 'react-router-dom';
import NewsletterModal from './NewsletterModal';

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    getUrl: (channels) => buildInstagramUrl(channels),
    color: 'hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F]',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@Visheshkalaa',
    color: 'hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/vishakha-garg30/',
    color: 'hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5]',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h5v-8.306c0-4.613 6.135-4.498 6.135 0v8.306h5v-9.715c0-7.398-7.906-7.166-11.167-3.475v-3.116z" />
      </svg>
    ),
  },
];

const ClosingCTA = () => {
  const { value: channels } = useSiteSetting('contact_channels', DEFAULT_CHANNELS);
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  return (
    <>
      <section id="contact" className="defer-section relative py-16 md:py-32 scroll-mt-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ghibli-paper/30 to-ghibli-cream pointer-events-none" />
        <div className="max-w-7xl mx-auto page-container relative z-10 text-center">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ghibli-wood/10 border border-ghibli-wood/20 text-ghibli-wood text-xs font-bold tracking-widest uppercase mb-6 cursor-default no-underline"
          >
            Handmade, just for you
          </Link>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ghibli-charcoal font-serif tracking-tight mb-4 sm:mb-6 max-w-3xl mx-auto px-2 sm:px-0">
            Looking for Something Special?
          </h2>
          <p className="text-lg text-ghibli-charcoal/70 mb-10 max-w-2xl mx-auto">
            Browse the collection, or say hello — we&apos;d love to hear from you.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link to="/shop" className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-ghibli-wood text-ghibli-cream font-bold text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-widest hover:scale-105 transition-transform shadow-lg">
              Shop Collection
            </Link>
            <button
              type="button"
              onClick={() => setNewsletterOpen(true)}
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white border border-ghibli-wood/20 text-ghibli-wood font-bold text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-widest hover:scale-105 transition-transform"
            >
              Join Newsletter
            </button>
            <a
              href={buildInstagramUrl(channels)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white border border-ghibli-wood/20 text-ghibli-wood font-bold text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-widest hover:scale-105 transition-transform"
            >
              @visheshkalaa
            </a>
          </div>

          <div className="flex flex-wrap gap-4 justify-center items-center">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.getUrl ? link.getUrl(channels) : link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border border-ghibli-wood/10 flex items-center justify-center text-ghibli-charcoal shadow-sm hover:shadow-lg hover:scale-110 transition-all ${link.color}`}
                title={link.name}
              >
                {link.icon}
              </a>
            ))}
            <Link
              to="/contact"
              className="px-5 sm:px-6 py-3 bg-ghibli-wood text-ghibli-cream font-bold text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-widest rounded-full shadow-lg hover:bg-[#A0704F] hover:scale-105 transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <NewsletterModal isOpen={newsletterOpen} onClose={() => setNewsletterOpen(false)} />
    </>
  );
};

export default ClosingCTA;
