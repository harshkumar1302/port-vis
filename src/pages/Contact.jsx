import { useEffect } from 'react';
import useSiteSetting from '../hooks/useSiteSettings';
import { buildInstagramUrl } from '../lib/enquire';
import WhatsAppButton from '../components/WhatsAppButton';

const Contact = () => {
  const { value: channels } = useSiteSetting('contact_channels', {});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const instaUrl = buildInstagramUrl(channels);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for reaching out! We will get back to you soon.');
    e.target.reset();
  };

  return (
    <div className="pt-8 pb-24 min-h-screen bg-ghibli-cream/40">
      <div className="page-container max-w-7xl">
        
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-ghibli-charcoal font-serif tracking-tight mb-4">
            Get in Touch
          </h1>
          <p className="text-ghibli-charcoal/70 max-w-2xl mx-auto text-lg">
            Have a question about an order, custom commissions, or just want to say hi? We're here.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left: Contact Methods */}
          <div className="w-full lg:w-1/3 space-y-8">
            <div className="card-glass p-8 bg-white/60 backdrop-blur-md rounded-3xl shadow-sm border border-ghibli-wood/10">
              <h3 className="font-serif font-bold text-xl text-ghibli-charcoal mb-6">Fastest Reply</h3>
              <WhatsAppButton className="w-full text-center py-4 rounded-xl bg-[#25D366]/80 text-white font-bold tracking-widest uppercase text-sm shadow-sm mb-4">
                Chat on WhatsApp
              </WhatsAppButton>
              <a 
                href={instaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-4 rounded-xl bg-gradient-to-r from-[#E4405F] to-[#833AB4] text-white font-bold tracking-widest uppercase text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                DM on Instagram
              </a>
            </div>

            <div className="card-glass p-8 bg-white/60 backdrop-blur-md rounded-3xl shadow-sm border border-ghibli-wood/10">
              <h3 className="font-serif font-bold text-xl text-ghibli-charcoal mb-4">Email Us</h3>
              <p className="text-ghibli-charcoal/70 mb-2">For business inquiries and support:</p>
              <a href="mailto:hello@visheshkala.com" className="font-bold text-ghibli-wood hover:underline">
                hello@visheshkala.com
              </a>
            </div>
          </div>

          {/* Right: Contact Form & FAQ */}
          <div className="w-full lg:w-2/3">
            
            <div className="card-glass p-8 md:p-10 bg-white/80 backdrop-blur-3xl rounded-3xl shadow-soft border border-ghibli-wood/10 mb-12">
              <h2 className="font-serif font-bold text-2xl text-ghibli-charcoal mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-ghibli-charcoal/70 mb-2">Name</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-xl border border-ghibli-wood/20 bg-white/50 focus:outline-none focus:border-ghibli-wood focus:ring-1 focus:ring-ghibli-wood transition-colors" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ghibli-charcoal/70 mb-2">Email</label>
                    <input required type="email" className="w-full px-4 py-3 rounded-xl border border-ghibli-wood/20 bg-white/50 focus:outline-none focus:border-ghibli-wood focus:ring-1 focus:ring-ghibli-wood transition-colors" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-ghibli-charcoal/70 mb-2">Subject</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-ghibli-wood/20 bg-white/50 focus:outline-none focus:border-ghibli-wood focus:ring-1 focus:ring-ghibli-wood transition-colors" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ghibli-charcoal/70 mb-2">Message</label>
                  <textarea required rows="4" className="w-full px-4 py-3 rounded-xl border border-ghibli-wood/20 bg-white/50 focus:outline-none focus:border-ghibli-wood focus:ring-1 focus:ring-ghibli-wood transition-colors resize-none" placeholder="Write your message here..."></textarea>
                </div>
                <button type="submit" className="px-8 py-4 rounded-xl bg-ghibli-wood text-white font-bold tracking-widest uppercase text-sm shadow-soft hover:shadow-luxe hover:bg-ghibli-charcoal transition-all">
                  Send Message
                </button>
              </form>
            </div>

            {/* FAQ */}
            <div className="space-y-6">
              <h2 className="font-serif font-bold text-2xl text-ghibli-charcoal mb-6">Frequently Asked Questions</h2>
              
              <div className="border-b border-ghibli-wood/10 pb-4">
                <h4 className="font-bold text-ghibli-charcoal mb-2">What are your shipping times?</h4>
                <p className="text-ghibli-charcoal/70 text-sm leading-relaxed">Ready-to-ship items are dispatched within 2-3 business days. Made-to-order and custom commissions typically take 7-14 days depending on the complexity of the piece.</p>
              </div>
              
              <div className="border-b border-ghibli-wood/10 pb-4">
                <h4 className="font-bold text-ghibli-charcoal mb-2">Do you accept custom orders?</h4>
                <p className="text-ghibli-charcoal/70 text-sm leading-relaxed">Yes! We love bringing your ideas to life. Reach out via the contact form or Instagram to discuss your vision, sizing, and pricing.</p>
              </div>
              
              <div className="pb-4">
                <h4 className="font-bold text-ghibli-charcoal mb-2">What is your return policy?</h4>
                <p className="text-ghibli-charcoal/70 text-sm leading-relaxed">Because each piece is handmade, we do not accept returns on custom orders. If an item arrives damaged, please contact us within 48 hours of delivery with photos, and we will make it right.</p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
