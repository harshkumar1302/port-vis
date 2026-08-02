import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/artwork';
import useSiteSetting from '../hooks/useSiteSettings';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity } = useStore();
  const { value: channels } = useSiteSetting('contact_channels', {});

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.price || 0) * item.quantity;
    }, 0);
  };

  const generateWhatsAppCheckout = () => {
    const number = channels?.whatsapp?.replace(/[^0-9]/g, '') || '919027814424';
    let message = "Hello VisheshKala! I'd like to place an order for:\n\n";
    
    cart.forEach(item => {
      message += `- ${item.title} (x${item.quantity})\n`;
    });
    
    message += `\nTotal Estimated: ${formatPrice(calculateTotal())}`;
    message += "\n\nPlease let me know the next steps for payment and delivery.";

    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-ghibli-cream/40">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-ghibli-charcoal font-serif tracking-tight mb-12">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-3xl border border-ghibli-wood/10">
            <div className="text-6xl mb-4 opacity-50">🛒</div>
            <h2 className="text-xl font-bold text-ghibli-charcoal mb-4">Your cart is empty</h2>
            <Link to="/products" className="inline-block px-8 py-3 rounded-full bg-ghibli-wood text-white font-bold uppercase tracking-wider text-sm shadow-soft hover:shadow-luxe transition-all">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Cart Items */}
            <div className="w-full lg:w-2/3 space-y-6">
              {cart.map(item => {
                const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                
                return (
                  <div key={item.id} className="flex gap-6 p-4 rounded-3xl bg-white shadow-sm border border-ghibli-wood/10 items-center">
                    <Link to={`/product/${slug}`} state={{ art: item }} className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-ghibli-paper/30 flex-shrink-0">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl opacity-30">🎨</div>
                      )}
                    </Link>
                    
                    <div className="flex-1">
                      <Link to={`/product/${slug}`} state={{ art: item }} className="font-heading font-bold text-ghibli-charcoal text-lg sm:text-xl line-clamp-1 hover:text-ghibli-wood">
                        {item.title}
                      </Link>
                      <div className="text-ghibli-charcoal font-bold mt-1 mb-4">
                        {item.price ? formatPrice(item.price) : 'Enquire for price'}
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 border border-ghibli-wood/20 rounded-full px-3 py-1 bg-white">
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-ghibli-charcoal/50 hover:bg-ghibli-paper"
                          >
                            -
                          </button>
                          <span className="font-bold text-sm min-w-[1ch] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-ghibli-charcoal/50 hover:bg-ghibli-paper"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs font-bold text-ghibli-wood/50 hover:text-red-500 uppercase tracking-widest"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-32 card-glass p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-soft border border-ghibli-wood/10">
                <h2 className="font-serif font-bold text-2xl text-ghibli-charcoal mb-6">Order Summary</h2>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-ghibli-charcoal/70">Subtotal</span>
                  <span className="font-bold text-ghibli-charcoal">{formatPrice(calculateTotal())}</span>
                </div>
                <div className="flex justify-between items-center pb-6 border-b border-ghibli-wood/10">
                  <span className="text-ghibli-charcoal/70">Shipping</span>
                  <span className="font-bold text-ghibli-moss">Free</span>
                </div>
                
                <div className="flex justify-between items-center py-6">
                  <span className="font-bold text-ghibli-charcoal text-lg">Total</span>
                  <span className="font-extrabold text-ghibli-charcoal text-2xl">{formatPrice(calculateTotal())}</span>
                </div>
                
                <a 
                  href={generateWhatsAppCheckout()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-4 rounded-xl bg-gold-gradient text-white font-bold tracking-widest uppercase text-sm shadow-soft hover:shadow-luxe hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mb-4"
                >
                  Checkout via WhatsApp
                </a>
                
                <p className="text-center text-xs text-ghibli-charcoal/50">
                  Taxes and final shipping (if applicable) calculated on WhatsApp.
                </p>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
