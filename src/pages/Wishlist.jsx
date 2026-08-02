import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/artwork';

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  return (
    <div className="pt-32 pb-24 min-h-screen bg-ghibli-cream/40">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-ghibli-charcoal font-serif tracking-tight mb-4">
          Your Wishlist
        </h1>
        <p className="text-ghibli-charcoal/70 mb-12 text-lg">
          {wishlist.length === 0 ? "You haven't saved any items yet." : `${wishlist.length} item(s) saved.`}
        </p>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-3xl border border-ghibli-wood/10">
            <div className="text-6xl mb-4 opacity-50">🤍</div>
            <h2 className="text-xl font-bold text-ghibli-charcoal mb-4">Your wishlist is empty</h2>
            <Link to="/products" className="inline-block px-8 py-3 rounded-full bg-ghibli-wood text-white font-bold uppercase tracking-wider text-sm shadow-soft hover:shadow-luxe transition-all">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map(art => {
              const slug = art.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
              
              return (
                <div key={art.id} className="group relative flex flex-col">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ghibli-paper/30 mb-4 block">
                    {art.image_url ? (
                      <img src={art.image_url} alt={art.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">🎨</div>
                    )}
                    
                    <button 
                      onClick={() => toggleWishlist(art)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-red-500 hover:bg-white transition-colors"
                      title="Remove from wishlist"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    </button>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <Link to={`/product/${slug}`} state={{ art }} className="font-heading font-semibold text-ghibli-charcoal text-lg leading-snug mb-1 line-clamp-2 hover:text-ghibli-wood transition-colors">
                      {art.title}
                    </Link>
                    
                    <div className="mb-4 text-ghibli-charcoal font-bold">
                      {art.price ? formatPrice(art.price) : 'Enquire for price'}
                    </div>
                    
                    <button 
                      onClick={() => addToCart(art)}
                      className="w-full text-center py-2.5 rounded-xl bg-gold-gradient text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
