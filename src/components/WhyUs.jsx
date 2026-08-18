const WhyUs = () => {
  const cards = [
    {
      delay: '0ms',
      title: 'Handmade with Care',
      body: 'Every piece crafted with attention to detail.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
      ),
    },
    {
      delay: '80ms',
      title: 'Unique Designs',
      body: 'No two handmade creations are alike.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
      ),
    },
    {
      delay: '160ms',
      title: 'Perfect for Gifting',
      body: 'Thoughtful decor for every celebration.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="14" rx="2"/><path d="M12 5a3 3 0 1 0-3 3"/><path d="M15 8h-6"/><path d="M12 5a3 3 0 1 1 3 3"/><path d="M12 8v14"/></svg>
      ),
    },
    {
      delay: '240ms',
      title: 'Beautiful Homes',
      body: 'Warmth and personality for every space.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      ),
    },
    {
      delay: '320ms',
      title: 'Made in India',
      body: 'Proudly handcrafted by Indian artisans.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
      ),
    },
  ];

  return (
    <section className="defer-section py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-ghibli-cream/20">
      <div className="page-container max-w-[1400px] relative z-10">
        <div className="text-center mb-10 sm:mb-14 lg:mb-16">
          <span className="text-[#D88A92] text-[11px] font-extrabold tracking-[0.3em] uppercase mb-4 block">
            The Essence of Our Craft
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-ghibli-charcoal font-serif tracking-tight">
            Art That Speaks to the Soul
          </h2>
          <div className="h-0.5 w-16 bg-[#D88A92]/40 mx-auto rounded-full mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {cards.map((card, index) => (
            <div
              key={card.title}
              className={`reveal-card bg-white rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-8 border border-ghibli-wood/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group hover:-translate-y-1 lg:hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-300 h-full flex gap-3 lg:flex-col lg:items-center lg:text-center ${
                index === cards.length - 1 ? 'sm:col-span-2 sm:max-w-lg sm:mx-auto md:col-span-1 md:max-w-none md:mx-0' : ''
              }`}
              style={{ animationDelay: card.delay }}
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#FAF0F1] flex items-center justify-center text-[#D88A92] shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                {card.icon}
              </div>
              <div className="min-w-0 flex-1 lg:flex-none">
                <h3 className="font-bold text-ghibli-charcoal text-sm lg:text-[15px] mb-1 lg:mb-3 leading-tight">
                  {card.title}
                </h3>
                <p className="text-ghibli-charcoal/60 text-xs lg:text-[13px] leading-snug lg:leading-relaxed">
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
