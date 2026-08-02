import { motion } from 'framer-motion';
import useSiteSetting from '../hooks/useSiteSettings';

const VALUES = [
  { icon: '🤲', title: 'Made by Hand', desc: 'Every piece is shaped individually — no two are quite the same.' },
  { icon: '✨', title: 'One of a Kind', desc: 'Each creation carries its own little story and character.' },
  { icon: '🎁', title: 'Lovely to Gift', desc: 'Birthdays, housewarmings, or just because — we pack each order with care.' },
  { icon: '🏠', title: 'For Your Home', desc: 'Warm, quiet details that make a space feel like yours.' },
];

const WhyVisheshkala = () => {
  const { value: stats } = useSiteSetting('hero_stats', {
    handmade_pct: 100,
    happy_homes: 500,
    rating: 5,
  });

  return (
    <section id="why" className="relative py-24 md:py-32 scroll-mt-28 bg-ghibli-cream/40">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ghibli-wood/10 border border-ghibli-wood/20 text-ghibli-wood text-xs font-bold tracking-widest uppercase">
            Why Visheshkala
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-ghibli-charcoal font-serif tracking-tight">
            What Makes Visheshkala Special
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-glass p-6 sm:p-8 bg-white/60 backdrop-blur-md hover:-translate-y-1 hover:shadow-luxe transition-all duration-500 text-center"
            >
              <div className="text-4xl mb-4">{v.icon}</div>
              <h3 className="text-lg font-bold text-ghibli-wood mb-2 font-serif">{v.title}</h3>
              <p className="text-sm text-ghibli-charcoal/70 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            { value: `${stats?.handmade_pct ?? 100}%`, label: 'Handmade' },
            { value: `${stats?.happy_homes ?? 500}+`, label: 'Happy Homes' },
            { value: `${stats?.rating ?? 5}★`, label: 'Happy Hearts' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-ghibli-wood font-serif">{s.value}</div>
              <div className="text-xs uppercase tracking-widest text-ghibli-charcoal/50 font-bold mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyVisheshkala;
