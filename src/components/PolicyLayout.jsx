import { Link } from 'react-router-dom';

const PolicyLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-ghibli-cream pb-24 pt-24 md:pt-32">
      <div className="page-container max-w-[760px]">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-ghibli-wood/70 hover:text-ghibli-wood transition-colors mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          Back to home
        </Link>

        <header className="mb-10 pb-8 border-b border-ghibli-wood/10">
          <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-ghibli-wood mb-3">Visheshkala</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-ghibli-charcoal tracking-tight mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-ghibli-charcoal/65 text-base leading-relaxed">{subtitle}</p>
          )}
          <p className="text-[11px] text-ghibli-charcoal/40 mt-4 uppercase tracking-wider font-semibold">
            Last updated: August 2026
          </p>
        </header>

        <article className="prose-policy space-y-8 text-ghibli-charcoal/80 text-[15px] leading-relaxed">
          {children}
        </article>

        <div className="mt-12 pt-8 border-t border-ghibli-wood/10 flex flex-wrap gap-4 text-[11px] font-bold uppercase tracking-widest">
          <Link to="/privacy" className="text-ghibli-wood hover:text-ghibli-charcoal transition-colors">Privacy</Link>
          <Link to="/contact" className="text-ghibli-wood hover:text-ghibli-charcoal transition-colors">Contact</Link>
        </div>
      </div>
    </div>
  );
};

export default PolicyLayout;
