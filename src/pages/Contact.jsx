import { useEffect, useState } from 'react';
import useSiteSetting from '../hooks/useSiteSettings';
import { SITE_EMAIL, SITE_WHATSAPP_DISPLAY } from '../constants/site';
import { buildInstagramUrl, buildWhatsAppUrl, DEFAULT_CHANNELS } from '../lib/enquire';
import { fetchJson } from '../lib/fetchJson';

const INQUIRY_TYPES = [
  'Custom Artwork',
  'Temple & Decor',
  'Order Inquiry',
  'Gifting / Bulk',
  'General Question',
];

const FAQS = [
  {
    q: 'How do custom commissions work?',
    a: 'Every custom artwork begins with a conversation about your space, size preference, and spiritual or aesthetic vision. Once we align on dimensions and design motifs, we share WIP updates before final finishing, varnish, and secure packaging.',
  },
  {
    q: 'What are your delivery & dispatch timelines?',
    a: 'Ready-to-ship creations are carefully packed and dispatched within 2–3 business days. Made-to-order commissions typically take 7–14 days depending on the detail, drying layers, and framing requirements.',
  },
  {
    q: 'Can you customize dimensions for home temples and shrines?',
    a: 'Yes! Many of our pieces are specially proportioned for sacred altars, mandirs, and entryway sanctums. Simply mention your exact height and width constraints in your inquiry.',
  },
  {
    q: 'How are the artworks packaged for transit?',
    a: 'Each piece is wrapped in moisture-resistant archival paper, reinforced with multi-layer bubble cushioning, and encased in sturdy corner-protected wooden/rigid boxes to guarantee safe delivery across India.',
  },
];

const Contact = () => {
  const { value: channels } = useSiteSetting('contact_channels', DEFAULT_CHANNELS);
  const [selectedType, setSelectedType] = useState('Custom Artwork');
  const [form, setForm] = useState({ name: '', email: '', subject: 'Custom Artwork', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(null);
  const [openFaq, setOpenFaq] = useState(0); // first item open by default

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const instaUrl = buildInstagramUrl(channels) || 'https://instagram.com';
  const waGeneral = buildWhatsAppUrl({ title: 'Visheshkala Atelier' }, channels, { source: 'contact' });

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setForm((prev) => ({ ...prev, subject: type }));
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const { data } = await fetchJson('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!data?.success) throw new Error('Could not send message');
      setSubmitted({
        name: form.name.trim(),
        subject: form.subject || selectedType,
        message: form.message.trim(),
      });
      setStatus('success');
      setForm({ name: '', email: '', subject: selectedType, message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Try reaching us directly via WhatsApp.');
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-ghibli-cream pb-28 pt-24 md:pt-32">
      {/* Editorial Header */}
      <div className="page-container max-w-[1200px] mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ghibli-wood/5 border border-ghibli-wood/15 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-ghibli-wood animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-ghibli-wood">
            Atelier Concierge & Commissions
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal text-ghibli-charcoal font-serif tracking-tight max-w-3xl mx-auto leading-[1.15] mb-5">
          Let’s bring your sacred vision to life.
        </h1>
        <p className="text-ghibli-charcoal/65 max-w-xl mx-auto text-base sm:text-lg font-sans leading-relaxed">
          Whether you’re looking for a bespoke altar piece, custom color palette, or have a question about an order, our studio is here for you.
        </p>
      </div>

      <div className="page-container max-w-[1200px]">
        {/* Main Two-Column Section: Form & FAQ */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start mb-16">
          {/* Left Column: Commission & Inquiry Form */}
          <div className="w-full lg:w-[58%]">
            <div className="bg-white/80 backdrop-blur-2xl border border-ghibli-wood/10 rounded-[2.5rem] p-8 sm:p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="mb-8">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-ghibli-wood">Send a Message</span>
                <h2 className="font-serif text-3xl text-ghibli-charcoal mt-1">Inquiry Form</h2>
              </div>

              {status === 'success' && submitted ? (
                <div className="text-center py-10 px-4 animate-in fade-in duration-300">
                  <img
                    src="/logo.png"
                    alt="Visheshkala"
                    className="w-24 h-24 mx-auto mb-6 object-contain"
                  />
                  <h3 className="font-serif text-3xl text-ghibli-charcoal mb-3">Message sent!</h3>
                  <p className="text-ghibli-charcoal/70 text-sm max-w-md mx-auto leading-relaxed mb-6">
                    Thank you{submitted.name ? `, ${submitted.name.split(' ')[0]}` : ''}! Vishakha will read your note personally and get back to you soon — usually within 24 hours.
                  </p>

                  <div className="text-left max-w-md mx-auto mb-8 rounded-2xl border border-ghibli-wood/10 bg-ghibli-cream/40 p-5 space-y-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-ghibli-wood/70 mb-1">Inquiry</p>
                      <p className="text-sm font-semibold text-ghibli-charcoal">{submitted.subject}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-ghibli-wood/70 mb-1">Your message</p>
                      <p className="text-sm text-ghibli-charcoal/75 leading-relaxed whitespace-pre-wrap">{submitted.message}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setStatus('idle');
                        setSubmitted(null);
                      }}
                      className="px-8 py-3 rounded-full bg-ghibli-charcoal text-white text-xs font-bold uppercase tracking-widest hover:bg-ghibli-wood transition-colors"
                    >
                      Send another note
                    </button>
                    {waGeneral && (
                      <a
                        href={waGeneral}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 rounded-full border-2 border-[#25D366] text-[#128C7E] text-xs font-bold uppercase tracking-widest hover:bg-[#25D366] hover:text-white transition-colors"
                      >
                        Chat on WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Topic Selector Chips */}
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase font-bold text-ghibli-charcoal/50 mb-3">
                      What is your inquiry regarding?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {INQUIRY_TYPES.map((type) => {
                        const isSelected = selectedType === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleTypeSelect(type)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'bg-ghibli-wood text-white shadow-sm'
                                : 'bg-ghibli-cream/60 text-ghibli-charcoal/70 hover:bg-ghibli-cream hover:text-ghibli-charcoal border border-ghibli-wood/10'
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <div>
                      <label className="block text-[10px] tracking-widest uppercase font-bold text-ghibli-charcoal/50 mb-1">
                        Your Name *
                      </label>
                      <input
                        required
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        type="text"
                        placeholder="e.g. Radhika Sharma"
                        className="w-full px-1 py-3 bg-transparent border-b border-ghibli-wood/20 text-ghibli-charcoal text-sm placeholder:text-ghibli-charcoal/30 focus:outline-none focus:border-ghibli-wood transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-widest uppercase font-bold text-ghibli-charcoal/50 mb-1">
                        Email Address *
                      </label>
                      <input
                        required
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        type="email"
                        placeholder="radhika@example.com"
                        className="w-full px-1 py-3 bg-transparent border-b border-ghibli-wood/20 text-ghibli-charcoal text-sm placeholder:text-ghibli-charcoal/30 focus:outline-none focus:border-ghibli-wood transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase font-bold text-ghibli-charcoal/50 mb-1">
                      Your Message / Custom Details *
                    </label>
                    <textarea
                      required
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Share dimensions, preferred color palette, deity or motif preference, or any specific questions..."
                      className="w-full px-1 py-3 bg-transparent border-b border-ghibli-wood/20 text-ghibli-charcoal text-sm placeholder:text-ghibli-charcoal/30 focus:outline-none focus:border-ghibli-wood transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-red-500 text-xs font-semibold">{errorMsg}</p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full sm:w-auto px-10 py-4 rounded-full bg-ghibli-charcoal text-white font-bold tracking-widest uppercase text-xs hover:bg-ghibli-wood shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(139,94,60,0.23)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:hover:transform-none"
                  >
                    {status === 'sending' ? 'Sending Message…' : 'Submit Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Interactive FAQ Accordion */}
          <div className="w-full lg:w-[42%] flex flex-col">
            <div className="bg-white/70 backdrop-blur-xl border border-ghibli-wood/10 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="mb-6 border-b border-ghibli-wood/10 pb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-ghibli-wood">Need Quick Answers?</span>
                <h3 className="font-serif text-2xl text-ghibli-charcoal mt-1">Frequently Asked Questions</h3>
              </div>

              <div className="divide-y divide-ghibli-wood/10">
                {FAQS.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0">
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        className="w-full flex items-center justify-between text-left gap-4 py-2 group cursor-pointer focus:outline-none"
                      >
                        <span className={`font-serif text-base transition-colors ${
                          isOpen ? 'text-ghibli-wood font-bold' : 'text-ghibli-charcoal group-hover:text-ghibli-wood'
                        }`}>
                          {faq.q}
                        </span>
                        <span className={`w-7 h-7 rounded-full border border-ghibli-wood/15 flex items-center justify-center text-xs flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 bg-ghibli-wood text-white border-ghibli-wood' : 'text-ghibli-charcoal/50 group-hover:border-ghibli-wood/30'
                        }`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </span>
                      </button>

                      {isOpen && (
                        <div className="pt-2 pb-2 pr-6 text-ghibli-charcoal/70 text-xs sm:text-sm leading-relaxed font-sans animate-fade-in">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Studio Assurance Note */}
              <div className="mt-8 pt-6 border-t border-ghibli-wood/10 flex items-center gap-3 text-ghibli-charcoal/50 text-[11px]">
                <span className="text-base">✨</span>
                <span>Handcrafted with precision & devotion in our private studio.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Concierge Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* WhatsApp Card */}
          <a
            href={waGeneral}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-white/70 backdrop-blur-xl border border-ghibli-wood/10 rounded-3xl p-7 hover:border-ghibli-wood/30 hover:shadow-[0_12px_36px_rgba(139,94,60,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
              </div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-ghibli-wood mb-1">Fastest Response</div>
              <h3 className="font-serif text-2xl text-ghibli-charcoal mb-2">WhatsApp Concierge</h3>
              <p className="text-ghibli-charcoal/60 text-xs leading-relaxed">
                Direct chat with Vishakha for immediate pricing, WIP snapshots, and custom quotes.
              </p>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-ghibli-charcoal group-hover:text-ghibli-wood transition-colors">
              <span>{SITE_WHATSAPP_DISPLAY}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </a>

          {/* Instagram Card */}
          <a
            href={instaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-white/70 backdrop-blur-xl border border-ghibli-wood/10 rounded-3xl p-7 hover:border-ghibli-wood/30 hover:shadow-[0_12px_36px_rgba(139,94,60,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E4405F]/10 text-[#E4405F] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-ghibli-wood mb-1">Visual Atelier</div>
              <h3 className="font-serif text-2xl text-ghibli-charcoal mb-2">Instagram Direct</h3>
              <p className="text-ghibli-charcoal/60 text-xs leading-relaxed">
                Follow our daily studio process, reel reveals, and message us directly on DM.
              </p>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-ghibli-charcoal group-hover:text-ghibli-wood transition-colors">
              <span>Visit @visheshkala</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </a>

          {/* Email Card */}
          <a
            href={`mailto:${SITE_EMAIL}`}
            className="group relative bg-white/70 backdrop-blur-xl border border-ghibli-wood/10 rounded-3xl p-7 hover:border-ghibli-wood/30 hover:shadow-[0_12px_36px_rgba(139,94,60,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-ghibli-wood/10 text-ghibli-wood flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-ghibli-wood mb-1">Formal Inquiries</div>
              <h3 className="font-serif text-2xl text-ghibli-charcoal mb-2">Studio Mailbox</h3>
              <p className="text-ghibli-charcoal/60 text-xs leading-relaxed">
                For bulk corporate gifting, gallery showcases, or detailed project briefs.
              </p>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-ghibli-charcoal group-hover:text-ghibli-wood transition-colors">
              <span>{SITE_EMAIL}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
