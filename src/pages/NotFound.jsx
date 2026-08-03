import { Link } from 'react-router-dom';

const NotFound = () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center py-24">
      <p className="text-ghibli-wood/70 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">404</p>
      <h1 className="text-3xl md:text-4xl font-extrabold text-ghibli-charcoal font-serif mb-4">
        Page not found
      </h1>
      <p className="text-ghibli-charcoal/60 mb-8 max-w-md">
        That page doesn&apos;t exist — but our handmade mandalas, miniatures and gifts still do.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          to="/"
          className="px-6 py-3 rounded-full bg-ghibli-wood text-white font-bold text-sm hover:bg-ghibli-wood/90 transition-colors"
        >
          Home
        </Link>
        <Link
          to="/shop"
          className="px-6 py-3 rounded-full bg-white border border-ghibli-wood/20 text-ghibli-wood font-bold text-sm hover:bg-ghibli-paper transition-colors"
        >
          Shop
        </Link>
      </div>
    </div>
);

export default NotFound;
