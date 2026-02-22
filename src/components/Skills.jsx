import { motion } from 'framer-motion';



const Skills = () => {
    const tools = [
        {
            category: "Traditional",
            icon: "🎨",
            description: "Tangible mediums that breathe life into paper.",
            items: ["Watercolor", "Gouache", "Gopi & Dot Work", "Acrylics", "Ink & Pen", "Mandala Dotting Tools", "Handmade Paper"],
            color: "from-amber-100/50 to-orange-100/50",
            border: "group-hover:border-amber-300/50"
        },
        {
            category: "Clay & Craft",
            icon: "🏡",
            description: "Crafting tiny worlds with immense precision.",
            items: ["Polymer Clay", "MDF Board", "Resin & Casting", "Fabric & Tote Crafting", "Clay Sculpting Tools"],
            color: "from-emerald-100/50 to-teal-100/50",
            border: "group-hover:border-emerald-300/50"
        },
        {
            category: "Surface & Object Art",
            icon: "🏺",
            description: "Every surface holds a canvas waiting to be found.",
            items: ["Glass & Mirror", "Wooden Surfaces", "Bottle & Container Art", "Bookmark Making (Clay, Wood, Paper)", "Car Hanging & Decor", "Vintage Frame Decoration"],
            color: "from-fuchsia-100/50 to-pink-100/50",
            border: "group-hover:border-fuchsia-300/50"
        },
        {
            category: "Digital",
            icon: "🪄",
            description: "Bringing handcrafted vision into the digital space.",
            items: ["Procreate", "Canva", "Vector Art", "Digital Mandala Patterning", "Digital Bookmarks", "Photo Editing for Art"],
            color: "from-sky-100/50 to-indigo-100/50",
            border: "group-hover:border-sky-300/50"
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


            {/* Mobile Mandala - Smaller & Tucked */}


            {/* --- Creative Scattered Backdrop --- */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* 1. Base Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ghibli-cream/40 to-transparent"></div>

                {/* 2. Floating Shapes - Pastels */}
                {/* Top Left Circle */}
                <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-blue-100/30 blur-[60px] animate-float"></div>

                {/* Bottom Right Square (Rotated) */}
                <div className="absolute bottom-[15%] right-[5%] w-80 h-80 bg-amber-100/20 blur-[80px] rotate-12 animate-float" style={{ animationDelay: '1.5s' }}></div>

                {/* Center Accent */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.8)_0%,transparent_70%)] opacity-60"></div>

                {/* 3. Tiny Decorative Dots (Static) */}
                <div className="absolute top-[20%] right-[15%] w-2 h-2 rounded-full bg-ghibli-wood/10"></div>
                <div className="absolute bottom-[30%] left-[10%] w-3 h-3 rounded-full bg-ghibli-wood/10"></div>
                <div className="absolute top-[15%] left-[25%] w-1.5 h-1.5 rounded-full bg-ghibli-wood/10"></div>
            </div>

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

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center items-stretch">
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
                                group relative p-6 md:p-8 rounded-[2rem] 
                                backdrop-blur-md bg-white/60 border border-white/80 shadow-lg 
                                transition-all duration-500 overflow-hidden
                                hover:shadow-2xl hover:bg-gradient-to-br ${group.color} ${group.border} hover:border-opacity-100
                                flex-1 min-w-0 flex flex-col
                            `}
                        >
                            {/* Magical Floating Orb Background */}
                            <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/40 rounded-full blur-3xl group-hover:bg-white/60 transition-all duration-700"></div>

                            {/* Icon Container */}
                            <div className="relative mb-6">
                                <motion.div
                                    whileHover={{ rotate: [0, 15, -10, 5, 0] }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center text-3xl shadow-md group-hover:shadow-lg transition-all duration-500 will-change-transform border border-white/50"
                                >
                                    {group.icon}
                                </motion.div>
                                {/* Sparkles */}
                                <motion.div
                                    className="absolute -top-2 -right-2 text-xl text-ghibli-gold opacity-0 group-hover:opacity-100"
                                    animate={{ rotate: [0, 15, -15, 0], scale: [0.8, 1.2, 0.8] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    ✦
                                </motion.div>
                            </div>

                            <h3 className="text-[1.1rem] md:text-xl lg:text-2xl font-bold text-ghibli-wood mb-2 font-serif group-hover:text-ghibli-charcoal transition-colors leading-tight min-h-[3rem] flex items-center whitespace-nowrap">
                                {group.category}
                            </h3>

                            <p className="text-xs font-medium text-ghibli-wood/60 mb-6 italic line-clamp-2">
                                {group.description}
                            </p>

                            <ul className="space-y-3 relative z-10 mt-auto">
                                {group.items.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-ghibli-charcoal/80 group-hover:text-ghibli-charcoal transition-colors">
                                        <span className="w-1 h-1 rounded-full bg-ghibli-wood/30 group-hover:bg-ghibli-wood transition-colors flex-shrink-0"></span>
                                        <span className="text-sm font-medium tracking-wide">{item}</span>
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
