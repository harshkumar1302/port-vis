import { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../lib/artwork';
import ArtworkImage from '../components/ArtworkImage';
import WhatsAppButton from '../components/WhatsAppButton';

const Checkout = () => {
  const { cart, clearCart } = useStore();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [checkoutStatus, setCheckoutStatus] = useState('idle');
  const [checkoutMsg, setCheckoutMsg] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState(null);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const displayItems = submittedOrder?.items ?? cart;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (cart.length === 0 && checkoutStatus !== 'done') {
      navigate('/cart');
    }
  }, [cart, navigate, checkoutStatus]);

  const calculateTotal = (items = displayItems) =>
    items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);

  const handleCheckout = async () => {
    // Basic validation
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setCheckoutStatus('error');
      setCheckoutMsg('Please fill out all required shipping details.');
      return;
    }

    setCheckoutStatus('loading');
    setCheckoutMsg('');
    try {
      const res = await fetch('/api/enquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customer.name.trim(),
          email: customer.email.trim() || undefined,
          phone: customer.phone.trim(),
          address: customer.address.trim(),
          items: cart.map(({ id, title, price, quantity, image_url }) => ({
            id, title, price, quantity, image_url,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');

      setSubmittedOrder({
        items: cart.map(({ id, title, price, quantity, image_url }) => ({
          id, title, price, quantity, image_url,
        })),
        total: calculateTotal(cart),
      });
      clearCart();
      setCheckoutStatus('done');
      setCheckoutMsg(data.message);
      if (data.whatsappUrl) {
        setWhatsappUrl(data.whatsappUrl);
        window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      setCheckoutStatus('error');
      setCheckoutMsg(err.message || 'Could not process checkout. Try contacting us directly.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  if (displayItems.length === 0 && checkoutStatus !== 'done') return null;

  return (
    <div className="min-h-screen bg-ghibli-cream pb-24 pt-24 md:pt-32">
      <div className="page-container max-w-[1200px] mb-12">
        <div className="text-center md:text-left border-b border-ghibli-wood/10 pb-6 mb-8">
          <Link to="/cart" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-ghibli-wood/70 hover:text-ghibli-wood transition-colors mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Cart
          </Link>
          <h1 className="text-4xl md:text-5xl font-normal text-ghibli-charcoal font-serif tracking-tight">
            Checkout
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Side: Shipping Details Form */}
          <div className="w-full lg:w-[58%] flex flex-col">
            <div className="bg-white/60 backdrop-blur-md border border-ghibli-wood/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm">
              <h2 className="font-serif text-2xl text-ghibli-charcoal mb-8 border-b border-ghibli-wood/10 pb-4">
                Shipping details
              </h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-[10px] tracking-widest uppercase font-bold text-ghibli-charcoal/50 mb-2">Full name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={customer.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 border border-ghibli-wood/20 rounded-xl text-ghibli-charcoal text-sm focus:outline-none focus:border-ghibli-wood focus:ring-1 focus:ring-ghibli-wood/20 transition-all shadow-inner shadow-black/5"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-[10px] tracking-widest uppercase font-bold text-ghibli-charcoal/50 mb-2">Email address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={customer.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 border border-ghibli-wood/20 rounded-xl text-ghibli-charcoal text-sm focus:outline-none focus:border-ghibli-wood focus:ring-1 focus:ring-ghibli-wood/20 transition-all shadow-inner shadow-black/5"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-[10px] tracking-widest uppercase font-bold text-ghibli-charcoal/50 mb-2">10-digit phone number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={customer.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 border border-ghibli-wood/20 rounded-xl text-ghibli-charcoal text-sm focus:outline-none focus:border-ghibli-wood focus:ring-1 focus:ring-ghibli-wood/20 transition-all shadow-inner shadow-black/5"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-[10px] tracking-widest uppercase font-bold text-ghibli-charcoal/50 mb-2">Full shipping address *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={customer.address}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="House, street, city, state, PIN"
                    className="w-full px-4 py-3 bg-white/50 border border-ghibli-wood/20 rounded-xl text-ghibli-charcoal text-sm placeholder:text-ghibli-charcoal/30 focus:outline-none focus:border-ghibli-wood focus:ring-1 focus:ring-ghibli-wood/20 transition-all shadow-inner shadow-black/5 resize-none"
                    required
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="w-full lg:w-[42%]">
            <div className="sticky top-28 bg-white/70 backdrop-blur-xl border border-ghibli-wood/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="font-serif text-2xl text-ghibli-charcoal mb-6 border-b border-ghibli-wood/10 pb-4">
                Order summary
              </h2>

              <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
                {displayItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-ghibli-paper/40 border border-ghibli-wood/10">
                       <ArtworkImage
                          src={item.image_url}
                          alt={item.title}
                          size="thumb"
                          imgClassName="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <span className="font-serif text-sm font-bold text-ghibli-charcoal line-clamp-2 leading-snug mb-1">
                        {item.title}
                      </span>
                      <span className="text-[10px] tracking-widest uppercase text-ghibli-charcoal/50">
                        Qty {item.quantity}
                      </span>
                    </div>
                    <div className="font-sans text-sm font-semibold text-ghibli-charcoal ml-2">
                      {item.price ? formatPrice((item.price * item.quantity)) : 'Enquire'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-8 text-sm">
                <div className="flex justify-between items-end text-ghibli-charcoal/70">
                  <span>Subtotal</span>
                  <span className="text-ghibli-charcoal">{formatPrice(calculateTotal())}</span>
                </div>
                <div className="flex justify-between items-end text-ghibli-charcoal/70">
                  <span>Shipping</span>
                  <span className="text-ghibli-wood text-xs uppercase tracking-wider font-bold">Free</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-ghibli-wood/10 mt-2">
                  <span className="font-serif text-xl font-bold text-ghibli-charcoal">Total</span>
                  <span className="font-serif text-2xl font-bold text-ghibli-charcoal">{formatPrice(calculateTotal())}</span>
                </div>
              </div>

              {checkoutStatus === 'done' ? (
                <div className="text-center py-2">
                  <p className="text-ghibli-wood text-sm mb-4">{checkoutMsg}</p>
                  {whatsappUrl && (
                    <WhatsAppButton
                      href={whatsappUrl}
                      className="w-full py-4 rounded-full bg-[#25D366] text-white font-bold tracking-wide text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
                    >
                      Open WhatsApp
                    </WhatsAppButton>
                  )}
                </div>
              ) : (
                <>
                  <WhatsAppButton
                    onClick={handleCheckout}
                    disabled={checkoutStatus === 'loading'}
                    className="w-full py-4 rounded-full bg-transparent border-2 border-ghibli-charcoal text-ghibli-charcoal font-bold tracking-wide text-sm flex items-center justify-center gap-2 hover:bg-ghibli-charcoal hover:text-white transition-all duration-300 disabled:opacity-70 disabled:hover:bg-transparent disabled:hover:text-ghibli-charcoal"
                  >
                    {checkoutStatus === 'loading' ? 'Processing…' : (
                      <>
                        Order via WhatsApp
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                      </>
                    )}
                  </WhatsAppButton>
                  {checkoutStatus === 'error' && (
                    <p className="mt-4 text-red-500 text-xs text-center font-semibold">{checkoutMsg}</p>
                  )}
                </>
              )}

              <div className="mt-6 flex items-center justify-center gap-2 text-ghibli-charcoal/40">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Secure checkout with Visheshkala
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
