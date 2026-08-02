import { useEffect } from 'react';
import { motion } from 'framer-motion';
import HomeAbout from '../components/HomeAbout';
import WhyUs from '../components/WhyUs';
import { Link } from 'react-router-dom';

const TOOLKIT_CATEGORIES = [
  {
    id: 'traditional',
    title: 'Traditional',
    description: 'Tangible mediums that breathe life into paper.',
    icon: '🎨',
    items: ['Watercolor', 'Gouache', 'Gopi & Dot Work', 'Acrylics', 'Ink & Pen', 'Mandala Dotting Tools', 'Handmade Paper'],
    color: 'from-ghibli-wood/10 to-ghibli-wood/5'
  },
  {
    id: 'clay',
    title: 'Clay & Craft',
    description: 'Crafting tiny worlds with immense precision.',
    icon: '🏡',
    items: ['Polymer Clay', 'MDF Board', 'Resin & Casting', 'Fabric & Tote Crafting', 'Clay Sculpting Tools'],
    color: 'from-ghibli-cream to-ghibli-gold/20'
  },
  {
    id: 'surface',
    title: 'Surface & Object Art',
    description: 'Every surface holds a canvas waiting to be found.',
    icon: '🏺',
    items: ['Glass & Mirror', 'Wooden Surfaces', 'Bottle & Container Art', 'Bookmark Making (Clay, Wood, Paper)', 'Car Hanging & Decor', 'Vintage Frame Decoration'],
    color: 'from-ghibli-paper to-ghibli-wood/10'
  },
  {
    id: 'digital',
    title: 'Digital',
    description: 'Bringing handcrafted vision into the digital space.',
    icon: '🪄',
    items: ['Procreate', 'Canva', 'Vector Art', 'Digital Mandala Patterning', 'Digital Bookmarks', 'Photo Editing for Art'],
    color: 'from-blue-50 to-indigo-50/50'
  }
];

const PHILOSOPHY_ITEMS = [
  {
    title: 'Handcrafted',
    text: 'Every piece is thoughtfully made by hand, in small batches.',
    icon: '✨'
  },
  {
    title: 'Inspired by Nature',
    text: 'Flowers, sunshine, and the little wonders of the everyday.',
    icon: '🌻'
  },
  {
    title: 'Made with Love',
    text: 'Crafted with care by Vishakha Garg, an artist who adores what she does.',
    icon: '❤️'
  },
  {
    title: 'Thoughtful Details',
    text: 'We believe the smallest details make a home feel truly special.',
    icon: '🌿'
  }
];

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-ghibli-cream/30">
      
      {/* 1. Page Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 text-center mb-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-ghibli-charcoal font-serif tracking-tight mb-4">
          The Visheshkala Story
        </h1>
        <p className="text-ghibli-charcoal/70 max-w-2xl mx-auto text-lg">
          Rooted in tradition, refined with care.
        </p>
      </div>

      {/* 2. Bio Section (Reused from Homepage) */}
      <HomeAbout />

      {/* 3. The Visheshkala Promise (Why Visheshkala) */}
      <WhyUs />

      {/* 4. My Creative Toolkit (Bento Box) */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <span className="text-ghibli-wood/70 text-[10px] font-bold tracking-[0.2em] uppercase mb-3 block">
              What I Work With
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-ghibli-charcoal font-serif tracking-tight flex flex-col items-center">
              My Creative Toolkit
              <div className="h-0.5 w-16 bg-ghibli-wood/40 mt-6 rounded-full" />
            </h2>
            <p className="text-ghibli-charcoal/60 mt-6 max-w-xl mx-auto">
              A curated selection of instruments that help bridge the gap between imagination and reality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {TOOLKIT_CATEGORIES.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.7 }}
                className={`relative group bg-gradient-to-br ${cat.color} rounded-[2.5rem] p-8 md:p-10 shadow-soft hover:shadow-xl transition-all duration-500 overflow-hidden border border-white/50 hover:-translate-y-2`}
              >
                {/* Icon Circle */}
                <div className="w-16 h-16 bg-white/60 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  {cat.icon}
                </div>
                
                <h3 className="text-2xl font-serif font-bold text-ghibli-charcoal mb-3 relative z-10">{cat.title}</h3>
                <p className="text-ghibli-charcoal/60 text-sm italic font-serif mb-8 leading-relaxed relative z-10 min-h-[40px]">
                  {cat.description}
                </p>
                
                <ul className="space-y-3 relative z-10">
                  {cat.items.map(item => (
                    <li key={item} className="flex items-start text-sm text-ghibli-charcoal/80 font-medium">
                      <span className="text-ghibli-wood/40 mr-3 mt-0.5 text-[10px]">✦</span>
                      <span className="leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Decorative overlay on hover */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. My Approach */}
      <section className="py-24 bg-white border-t border-ghibli-wood/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            {/* Left: Quote */}
            <div className="w-full lg:w-1/2">
              <span className="text-ghibli-wood text-[10px] font-bold tracking-[0.2em] uppercase mb-6 block">
                My Approach
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-ghibli-charcoal mb-8 leading-tight">
                Beyond beauty, beyond art.
              </h2>
              <div className="prose prose-lg text-ghibli-charcoal/70 mb-8">
                <p>
                  Rooted in tradition, refined with care. Artifacts crafted slowly with patience and love, designed to carry meaning and endure with purpose.
                </p>
                <blockquote className="border-l-4 border-ghibli-gold/40 pl-6 italic font-serif text-2xl text-ghibli-charcoal my-10">
                  "I create with a belief that small details carry meaning. As an artist, I value patience, balance, and intention in every step of the process."
                </blockquote>
                <p>
                  At Visheshkala, this is reflected in art and handcrafted pieces shaped with care, simple creations made to feel personal and lasting.
                </p>
              </div>
            </div>

            {/* Right: Highlights */}
            <div className="w-full lg:w-1/2 flex flex-col gap-8">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-ghibli-paper/50 rounded-3xl p-8 border border-ghibli-wood/10 flex gap-6"
              >
                <div className="text-4xl">🎁</div>
                <div>
                  <h4 className="font-bold text-ghibli-charcoal text-lg mb-2">Meaningful Gifting</h4>
                  <p className="text-ghibli-charcoal/70 text-sm leading-relaxed">
                    Each creation is shaped by hand, never rushed, and made to be cherished, shared, and remembered.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-ghibli-wood/5 rounded-3xl p-8 border border-ghibli-wood/10 flex gap-6"
              >
                <div className="text-4xl">✨</div>
                <div>
                  <h4 className="font-bold text-ghibli-charcoal text-lg mb-2">Detailing</h4>
                  <p className="text-ghibli-charcoal/70 text-sm leading-relaxed">
                    Thoughtful finishes, balanced patterns, and careful attention to every line and texture make each creation feel refined and personal.
                  </p>
                </div>
              </motion.div>
            </div>

          </div>
          
          <div className="mt-20 text-center">
            <Link 
              to="/products"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-ghibli-wood hover:bg-ghibli-wood/80 text-white font-bold tracking-[0.1em] text-sm uppercase transition-all shadow-md hover:shadow-xl hover:-translate-y-1"
            >
              Explore Our Collection
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
