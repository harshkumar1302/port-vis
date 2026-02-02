const Skills = () => {
    const tools = [
        {
            category: "Traditional",
            icon: "🎨",
            items: ["Watercolor", "Gouache", "Ink & Pen", "Handmade Paper"]
        },
        {
            category: "Miniature",
            icon: "🏡",
            items: ["Polymer Clay", "Balsa Wood", "Moss & Foliage", "Acrylics"]
        },
        {
            category: "Digital",
            icon: "✨",
            items: ["Procreate", "Canva", "Vector Art", "Digital Patterning"]
        }
    ];

    return (
        <section id="skills" className="section-container relative">
            <div className="max-w-4xl mx-auto text-center">
                <span className="text-ghibli-wood font-bold tracking-[0.2em] uppercase text-xs mb-8 block">
                    My Toolkit
                </span>

                <h2 className="text-3xl md:text-4xl font-bold text-ghibli-charcoal mb-16 font-serif">
                    Tools of the <span className="italic text-ghibli-moss">Trade</span>
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {tools.map((group, idx) => (
                        <div key={idx} className={`bg-white/40 p-8 rounded-[2rem] border border-white/50 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden ${idx % 2 === 0 ? '-rotate-1' : 'rotate-1'} hover:rotate-0 hover:-translate-y-2`}>
                            {/* Decorative Corner Sparkle */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-ghibli-gold animate-pulse">✦</div>
                            <div className="text-4xl mb-6 bg-ghibli-cream w-16 h-16 flex items-center justify-center rounded-full mx-auto shadow-inner group-hover:scale-110 transition-transform">
                                {group.icon}
                            </div>
                            <h3 className="text-xl font-bold text-ghibli-wood mb-6 font-serif">
                                {group.category}
                            </h3>
                            <ul className="space-y-3">
                                {group.items.map((item, i) => (
                                    <li key={i} className="text-sm font-sans text-ghibli-charcoal/80">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
