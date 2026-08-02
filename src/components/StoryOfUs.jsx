import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const TOOLKIT = [
  { icon: '🎨', label: 'Watercolor & Mandala' },
  { icon: '🏺', label: 'Polymer Clay' },
  { icon: '🪄', label: 'Digital Art' },
  { icon: '🏡', label: 'Miniatures' },
  { icon: '🎁', label: 'Gift Crafting' },
  { icon: '✂️', label: 'DIY & Bookmarks' },
];

const StudioStrip = () => {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    supabase
      .from('artworks')
      .select('*')
      .ilike('category', 'upcoming')
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => setArtworks(data || []))
      .catch(console.error);
  }, []);

  if (artworks.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-ghibli-wood font-serif mb-4">Coming from the Studio</h3>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {artworks.map(art => (
          <div key={art.id} className="flex-shrink-0 w-40 rounded-2xl overflow-hidden bg-white shadow-sm border border-ghibli-wood/10">
            {art.image_url ? (
              <img src={art.image_url} alt={art.title} className="w-full aspect-square object-cover" />
            ) : (
              <div className="w-full aspect-square bg-ghibli-paper/30 flex items-center justify-center text-2xl">🌿</div>
            )}
            <p className="p-3 text-xs font-bold text-ghibli-charcoal truncate">{art.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const StoryOfUs = () => (
  <section id="story" className="relative overflow-hidden bg-ghibli-paper/20 py-24 md:py-32 scroll-mt-28">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-ghibli-cream via-white to-ghibli-cream/20" />
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(255,220,180,0.15)_0%,transparent_70%)] blur-[80px] rounded-full opacity-60" />
    </div>

    <div className="max-w-7xl mx-auto relative z-10 px-6 md:px-12 lg:px-16">
      <div className="mb-12 space-y-4">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ghibli-wood/10 border border-ghibli-wood/20 text-ghibli-wood text-xs font-bold tracking-widest uppercase">
          Our Story
        </span>
        <h2 className="text-4xl md:text-6xl font-extrabold text-ghibli-charcoal font-serif tracking-tight">
          A Little About Us
        </h2>
        <p className="text-ghibli-charcoal/60 max-w-3xl text-lg leading-relaxed">
          Visheshkala started with a simple belief — that small, handmade things can hold big feelings. Every piece here is made slowly, with patience.
        </p>
      </div>

      <div className="card-glass p-6 sm:p-10 bg-white/60 backdrop-blur-3xl shadow-luxe relative overflow-hidden mb-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ghibli-wood via-ghibli-gold to-ghibli-wood opacity-50" />
        <p className="text-xl text-ghibli-charcoal/90 leading-relaxed font-serif italic mb-6 max-w-5xl">
          "I create with a belief that small details carry meaning. As an artist, I value patience, balance, and intention in every step of the process."
        </p>
        <p className="text-lg text-ghibli-charcoal/70 leading-relaxed font-sans max-w-4xl">
          That's the heart of Visheshkala — art and gifts shaped with care, made to feel personal and worth keeping.
        </p>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-ghibli-wood mb-4">Creative Toolkit</h3>
        <div className="flex flex-wrap gap-3">
          {TOOLKIT.map((tool, i) => (
            <motion.span
              key={tool.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-ghibli-wood/10 text-sm font-medium text-ghibli-charcoal hover:border-ghibli-gold transition-colors"
            >
              <span>{tool.icon}</span>
              {tool.label}
            </motion.span>
          ))}
        </div>
      </div>

      <StudioStrip />
    </div>
  </section>
);

export default StoryOfUs;
