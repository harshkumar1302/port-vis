import { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/artwork';
import { titleToSlug } from '../lib/categoryUtils';
import WhatsAppButton from '../components/WhatsAppButton';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity } = useStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const calculateTotal = () =>
    cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-ghibli-cream pb-24">
        <div className="page-container max-w-[1400px] pt-8 pb-10">
          <p className="text-ghibli-wood/70 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
            Your Order
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-ghibli-charcoal font-serif tracking-tight">
            Cart
          </h1>
          <div className="h-0.5 w-16 bg-ghibli-wood/30 mt-6 rounded-full" />
        </div>

        <div className="page-container max-w-[1400px]">
          <div className="flex flex-col items-center justify-center py-20 md:py-28 text-center">
            <div className="w-20 h-20 rounded-full bg-ghibli-gold/15 flex items-center justify-center text-3xl mb-8">
              🛍️
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-ghibli-charcoal mb-3">
              Your cart is empty
            </h2>
            <p className="text-ghibli-charcoal/60 mb-10 max-w-md leading-relaxed">
              Discover something special in our collection and add it here when you&apos;re ready.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-ghibli-wood text-white font-bold text-sm hover:bg-ghibli-wood/90 transition-colors duration-200"
            >
              Start Shopping
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ghibli-cream pb-24">
      <div className="page-container max-w-[1400px] pt-8 pb-10">
        <p className="text-ghibli-wood/70 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
          Your Order
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-ghibli-charcoal font-serif tracking-tight">
            Cart
          </h1>
          <p className="text-sm font-bold text-ghibli-charcoal/50 uppercase tracking-widest">
            {cart.reduce((n, i) => n + i.quantity, 0)} items
          </p>
        </div>
        <div className="h-0.5 w-16 bg-ghibli-wood/30 mt-6 rounded-full" />
      </div>

      <div className="page-container max-w-[1400px]">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
          <div className="w-full lg:w-[60%] flex flex-col gap-4 sm:gap-6 md:gap-8">
            <div className="hidden md:flex justify-between pb-3 border-b border-ghibli-wood/20 text-[10px] font-bold tracking-[0.2em] uppercase text-ghibli-charcoal/40">
              <span>Artwork</span>
              <span>Details</span>
            </div>

            {cart.map((item) => {
              const slug = titleToSlug(item.title, item.id);

              return (
                <div
                  key={item.id}
                  className="group flex flex-col sm:flex-row gap-4 md:gap-6 pb-6 border-b border-ghibli-wood/10"
                >
                  <Link
                    to={`/shop/${slug}`}
                    state={{ art: item }}
                    className="w-full sm:w-28 md:w-32 aspect-square overflow-hidden bg-ghibli-paper/20 rounded-xl sm:rounded-xl flex-shrink-0 relative"
                  >
                    <ArtworkImage
                      src={item.image_url}
                      alt={item.title}
                      size="thumb"
                      priority
                      imgClassName="transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <Link to={`/shop/${slug}`} state={{ art: item }} className="block mb-1 group/link">
                        <h3 className="font-serif font-bold text-lg md:text-xl text-ghibli-charcoal leading-tight group-hover/link:text-ghibli-wood transition-colors">
                          {item.title}
                        </h3>
                      </Link>
                      <div className="text-ghibli-charcoal/60 font-mono tracking-widest text-xs uppercase">
                        {item.price ? formatPrice(item.price) : 'Enquire for price'}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-ghibli-charcoal">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full border border-ghibli-wood/15 text-lg hover:text-ghibli-wood hover:bg-ghibli-paper/50 transition-colors flex items-center justify-center"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="font-mono text-base min-w-[2ch] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full border border-ghibli-wood/15 text-lg hover:text-ghibli-wood hover:bg-ghibli-paper/50 transition-colors flex items-center justify-center"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[10px] font-bold text-ghibli-charcoal/40 hover:text-red-500 uppercase tracking-[0.1em] transition-colors duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full lg:w-[40%]">
            <div className="sticky top-4 lg:sticky-below-header-padded bg-ghibli-navy text-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl relative overflow-hidden">
              <h2 className="font-serif font-bold text-xl text-ghibli-gold mb-8 tracking-wide">
                Order Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-end text-white/70 border-b border-white/10 pb-4">
                  <span className="text-xs tracking-widest uppercase">Subtotal</span>
                  <span className="font-mono text-base text-white">{formatPrice(calculateTotal())}</span>
                </div>
                <div className="flex justify-between items-end text-white/70 border-b border-white/10 pb-4">
                  <span className="text-xs tracking-widest uppercase">Delivery</span>
                  <span className="font-mono text-xs tracking-widest uppercase text-ghibli-gold">Free</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="text-xs tracking-widest uppercase text-white/70">Total</span>
                  <span className="font-serif font-bold text-2xl text-white">{formatPrice(calculateTotal())}</span>
                </div>
              </div>

              <WhatsAppButton className="w-full py-4 rounded-full bg-ghibli-gold/80 text-ghibli-navy font-bold tracking-[0.08em] text-xs uppercase flex items-center justify-center gap-2">
                Checkout via WhatsApp
              </WhatsAppButton>

              <p className="mt-6 text-center text-[9px] text-white/30 uppercase tracking-widest font-bold">
                Taxes calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
