import { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/artwork';
import { titleToSlug } from '../lib/categoryUtils';
import ArtworkImage from '../components/ArtworkImage';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity } = useStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const calculateTotal = () =>
    cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-ghibli-cream pb-24 flex flex-col pt-32">
        <div className="page-container max-w-[800px] text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-ghibli-wood/5 flex items-center justify-center text-ghibli-wood mb-6 border border-ghibli-wood/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-ghibli-charcoal mb-4">
            Your cart is empty
          </h1>
          <p className="text-ghibli-charcoal/60 mb-10 max-w-sm leading-relaxed font-sans">
            Take a look at our artisanal collections to find something special.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-ghibli-charcoal text-white font-bold text-sm tracking-wide hover:bg-ghibli-wood transition-colors duration-300 shadow-sm"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ghibli-cream pb-24 pt-24 md:pt-32">
      <div className="page-container max-w-[1200px] mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ghibli-wood/10 pb-6">
          <h1 className="text-4xl md:text-5xl font-normal text-ghibli-charcoal font-serif tracking-tight">
            Cart <span className="text-ghibli-charcoal/40 text-3xl">({cart.reduce((n, i) => n + i.quantity, 0)})</span>
          </h1>
          <Link to="/shop" className="text-sm font-bold text-ghibli-wood hover:text-ghibli-charcoal transition-colors underline-offset-4 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="page-container max-w-[1200px]">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="w-full lg:w-[58%] flex flex-col gap-0">
            {cart.map((item) => {
              const slug = titleToSlug(item.title, item.id);

              return (
                <div
                  key={item.id}
                  className="group flex flex-col sm:flex-row gap-6 md:gap-8 py-8 border-b border-ghibli-wood/10 first:pt-0"
                >
                  <Link
                    to={`/shop/${slug}`}
                    state={{ art: item }}
                    className="w-32 h-32 sm:w-40 sm:h-40 overflow-hidden bg-ghibli-paper/40 rounded-2xl flex-shrink-0 relative border border-ghibli-wood/5"
                  >
                    <ArtworkImage
                      src={item.image_url}
                      alt={item.title}
                      size="thumb"
                      priority
                      imgClassName="transition-transform duration-700 ease-out group-hover:scale-105 object-cover w-full h-full"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                      <Link to={`/shop/${slug}`} state={{ art: item }} className="block group/link">
                        <h3 className="font-serif text-xl md:text-2xl text-ghibli-charcoal leading-snug group-hover/link:text-ghibli-wood transition-colors">
                          {item.title}
                        </h3>
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-ghibli-charcoal/30 hover:text-red-500 transition-colors p-1"
                        aria-label="Delete item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-ghibli-charcoal">
                        <span className="text-[10px] tracking-widest uppercase text-ghibli-charcoal/50 mr-2">Quantity</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (item.quantity <= 1) {
                              removeFromCart(item.id);
                            } else {
                              updateCartQuantity(item.id, item.quantity - 1);
                            }
                          }}
                          className="w-8 h-8 rounded-full border border-ghibli-wood/15 text-lg hover:text-ghibli-wood hover:bg-white transition-colors flex items-center justify-center cursor-pointer relative z-10"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="font-mono text-sm min-w-[2ch] text-center">{item.quantity}</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            updateCartQuantity(item.id, item.quantity + 1);
                          }}
                          className="w-8 h-8 rounded-full border border-ghibli-wood/15 text-lg hover:text-ghibli-wood hover:bg-white transition-colors flex items-center justify-center cursor-pointer relative z-10"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="font-sans text-lg text-ghibli-charcoal">
                        {item.price ? formatPrice((item.price * item.quantity)) : 'Enquire'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full lg:w-[42%]">
            <div className="sticky top-28 bg-white/70 backdrop-blur-xl border border-ghibli-wood/10 rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="font-serif text-2xl text-ghibli-charcoal mb-8 border-b border-ghibli-wood/10 pb-4">
                Order Summary
              </h2>

              <div className="space-y-4 mb-10 text-sm">
                <div className="flex justify-between items-end text-ghibli-charcoal/70">
                  <span>Subtotal</span>
                  <span className="text-ghibli-charcoal">{formatPrice(calculateTotal())}</span>
                </div>
                <div className="flex justify-between items-end text-ghibli-charcoal/70">
                  <span>Shipping</span>
                  <span className="text-ghibli-wood text-xs uppercase tracking-wider font-bold">Calculated at Checkout</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-ghibli-wood/10 mt-4">
                  <span className="font-serif text-xl text-ghibli-charcoal">Total</span>
                  <span className="font-serif text-2xl text-ghibli-charcoal">{formatPrice(calculateTotal())}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full py-4 rounded-full bg-ghibli-charcoal text-white font-bold tracking-wide text-sm flex items-center justify-center gap-2 hover:bg-ghibli-wood shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(139,94,60,0.23)] hover:-translate-y-0.5 transition-all duration-300"
              >
                Proceed to Checkout
              </Link>

              <div className="mt-6 flex items-center justify-center gap-2 text-ghibli-charcoal/40">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Secure Checkout
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
