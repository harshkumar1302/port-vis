import { motion } from 'framer-motion';

const WhyUs = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-ghibli-cream/20 border-y border-ghibli-wood/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#D88A92] text-[11px] font-extrabold tracking-[0.3em] uppercase mb-4 block">
            The Essence of Our Craft
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-ghibli-charcoal font-serif tracking-tight">
            Art That Speaks to the Soul
          </h2>
          <div className="h-0.5 w-16 bg-[#D88A92]/40 mx-auto rounded-full mt-6" />
        </div>

        {/* 5-Column Grid matching exactly the shape and size requested */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-6 lg:p-8 flex flex-col items-center text-center border border-ghibli-wood/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAF0F1] flex items-center justify-center text-[#D88A92] mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
            </div>
            <h3 className="font-bold text-ghibli-charcoal text-[15px] mb-3 leading-tight">Handmade with Care</h3>
            <p className="text-ghibli-charcoal/60 text-[13px] leading-relaxed">
              Every piece is individually crafted with attention to detail.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-3xl p-6 lg:p-8 flex flex-col items-center text-center border border-ghibli-wood/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAF0F1] flex items-center justify-center text-[#D88A92] mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </div>
            <h3 className="font-bold text-ghibli-charcoal text-[15px] mb-3 leading-tight">Unique Designs</h3>
            <p className="text-ghibli-charcoal/60 text-[13px] leading-relaxed">
              No two handmade creations are exactly alike.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-3xl p-6 lg:p-8 flex flex-col items-center text-center border border-ghibli-wood/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAF0F1] flex items-center justify-center text-[#D88A92] mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="14" rx="2"/><path d="M12 5a3 3 0 1 0-3 3"/><path d="M15 8h-6"/><path d="M12 5a3 3 0 1 1 3 3"/><path d="M12 8v14"/></svg>
            </div>
            <h3 className="font-bold text-ghibli-charcoal text-[15px] mb-3 leading-tight">Perfect for Gifting</h3>
            <p className="text-ghibli-charcoal/60 text-[13px] leading-relaxed">
              Thoughtful decor for birthdays, anniversaries, and housewarmings.
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-3xl p-6 lg:p-8 flex flex-col items-center text-center border border-ghibli-wood/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAF0F1] flex items-center justify-center text-[#D88A92] mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <h3 className="font-bold text-ghibli-charcoal text-[15px] mb-3 leading-tight">Beautiful Homes</h3>
            <p className="text-ghibli-charcoal/60 text-[13px] leading-relaxed">
              Designed to add warmth and personality to every space.
            </p>
          </motion.div>

          {/* Card 5 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-3xl p-6 lg:p-8 flex flex-col items-center text-center border border-ghibli-wood/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAF0F1] flex items-center justify-center text-[#D88A92] mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
            </div>
            <h3 className="font-bold text-ghibli-charcoal text-[15px] mb-3 leading-tight">Made in India</h3>
            <p className="text-ghibli-charcoal/60 text-[13px] leading-relaxed">
              Proudly handcrafted by Indian artisans.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default WhyUs;
