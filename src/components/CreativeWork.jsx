const CreativeWork = () => {
    return (
        <section id="creative-work" className="section-container relative">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">

                {/* Visual Side */}
                <div className="w-full md:w-1/2 relative group">
                    <div className="absolute inset-0 bg-ghibli-moss/20 rounded-[2rem] transform rotate-3 transition-transform group-hover:rotate-6"></div>
                    <div className="relative bg-white dark:bg-ghibli-dark-card p-6 rounded-[2rem] shadow-xl border border-ghibli-wood/10 card-glass aspect-square flex items-center justify-center">
                        <span className="text-6xl animate-float">🌿</span>
                    </div>
                </div>

                {/* Text Side */}
                <div className="w-full md:w-1/2 text-left space-y-6">
                    <span className="text-ghibli-moss font-bold tracking-[0.2em] uppercase text-xs">
                        Small Business
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-ghibli-charcoal dark:text-white leading-tight">
                        Handmade with <br />
                        <span className="text-ghibli-moss italic font-serif">patience & love</span>
                    </h2>
                    <p className="text-ghibli-charcoal/70 dark:text-white/70 font-sans leading-relaxed">
                        Beyond the digital screen, I run a small creative shop where I craft physical mandalas and miniature sets.
                        Each piece is a labor of love, designed to bring a little bit of magic into your home.
                    </p>
                    <p className="text-ghibli-charcoal/70 dark:text-white/70 font-sans leading-relaxed">
                        Whether it's a custom commission or a piece from my collection, I pour my heart into every detail.
                    </p>

                    <div className="pt-4">
                        <a href="#contact" className="inline-block px-10 py-3 rounded-full bg-ghibli-moss text-white font-bold tracking-widest text-xs hover:scale-110 active:scale-95 hover:bg-ghibli-wood transition-all shadow-lg hover:shadow-xl ring-4 ring-transparent hover:ring-ghibli-moss/20">
                            INQUIRE
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default CreativeWork;
