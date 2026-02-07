import { motion } from 'framer-motion';
import MandalaBackground from './MandalaBackground';

const Skills = () => {
    const tools = [
        {
            category: "Traditional",
            icon: "🎨",
            description: "Tangible mediums that breathe life into paper.",
            items: ["Watercolor", "Gouache", "Ink & Pen", "Handmade Paper"],
            color: "from-amber-100/50 to-orange-100/50",
            border: "group-hover:border-amber-300/50"
        },
        {
            category: "Miniature",
            icon: "🏡",
            description: "Crafting tiny worlds with immense precision.",
            items: ["Polymer Clay", "Balsa Wood", "Moss & Foliage", "Acrylics"],
            color: "from-emerald-100/50 to-teal-100/50",
            border: "group-hover:border-emerald-300/50"
        },
        {
            category: "Digital",
            icon: "✨",
            description: "Pixel-perfect artistry for the modern age.",
            items: ["Procreate", "Canva", "Vector Art", "Digital Patterning"],
            color: "from-blue-100/50 to-indigo-100/50",
            border: "group-hover:border-blue-300/50"
        }
    ];

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
            }
        })
    };

    return (
        <section id="skills" className="relative py-32 overflow-hidden bg-gradient-to-b from-transparent via-ghibli-cream/30 to-transparent">
            {/* Zig-Zag Pattern: 3. Skills -> Right */}
            {/* Desktop Mandala */}
            <MandalaBackground
                className="hidden md:block absolute top-[-20%] right-[-10%] w-[900px] h-[900px] animate-spin-slow"
                opacity={0.08}
                color="#A1887F"
            />

            {/* Mobile Mandala - Smaller & Tucked */}
            <MandalaBackground
                className="block md:hidden absolute top-0 right-[-40%] w-[150%] animate-spin-slow"
                opacity={0.06}
                color="#A1887F"
            />

            {/* Left Side Decorative Filler */}
            <div className="absolute top-1/4 left-0 w-64 h-full bg-gradient-to-r from-ghibli-blue/5 to-transparent blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-ghibli-wood font-bold tracking-[0.3em] uppercase text-xs mb-4 block"
                    >
                        What I Work With
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-bold text-ghibli-charcoal font-serif mb-6"
                    >
                        My <span className="italic text-ghibli-wood">Creative Toolkit</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-ghibli-charcoal/60 max-w-2xl mx-auto text-lg leading-relaxed"
                    >
                        A curated selection of instruments that help bridge the gap between imagination and reality.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
                    {tools.map((group, idx) => (
                        <motion.div
                            key={idx}
                            custom={idx}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={cardVariants}
                            whileHover={{ y: -12, scale: 1.02 }}
                            className={`
                                group relative p-10 rounded-[2.5rem] 
                                backdrop-blur-md bg-white/60 border border-white/80 shadow-lg 
                                transition-all duration-500 overflow-hidden
                                hover:shadow-2xl hover:bg-gradient-to-br ${group.color} ${group.border} hover:border-opacity-100
                            `}
                        >
                            {/* Magical Floating Orb Background */}
                            <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/40 rounded-full blur-3xl group-hover:bg-white/60 transition-all duration-700"></div>

                            {/* Icon Container */}
                            <div className="relative mb-8">
                                <div className="w-20 h-20 bg-white/60 rounded-full flex items-center justify-center text-4xl shadow-inner-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 will-change-transform">
                                    {group.icon}
                                </div>
                                {/* Sparkles */}
                                <motion.div
                                    className="absolute -top-2 -right-2 text-xl text-ghibli-gold opacity-0 group-hover:opacity-100"
                                    animate={{ rotate: [0, 15, -15, 0], scale: [0.8, 1.2, 0.8] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    ✦
                                </motion.div>
                            </div>

                            <h3 className="text-3xl font-bold text-ghibli-wood mb-3 font-serif group-hover:text-ghibli-charcoal transition-colors">
                                {group.category}
                            </h3>

                            <p className="text-sm font-medium text-ghibli-wood/60 mb-8 italic">
                                {group.description}
                            </p>

                            <ul className="space-y-4 relative z-10">
                                {group.items.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-ghibli-charcoal/80 group-hover:text-ghibli-charcoal transition-colors">
                                        <span className="w-1.5 h-1.5 rounded-full bg-ghibli-wood/30 group-hover:bg-ghibli-wood transition-colors"></span>
                                        <span className="text-base font-medium tracking-wide">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Hover Bottom Highlight */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ghibli-wood/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
