const Hero = () => {
    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-transparent">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[10%] right-[15%] w-64 h-64 bg-ghibli-gold/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-[20%] left-[10%] w-80 h-80 bg-ghibli-moss/10 rounded-full blur-[100px] animate-sway"></div>
            </div>

            <div className="section-container relative z-10 text-center">
                <div className="animate-fade-in space-y-8 max-w-2xl mx-auto">

                    {/* Avatar Element */}
                    <div className="relative inline-block mb-2 group">
                        <div className="absolute inset-0 bg-ghibli-gold/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700 animate-pulse-slow"></div>
                        <img
                            src="/ghibli-avatar.png"
                            alt="Vishakha"
                            className="w-40 h-40 md:w-52 md:h-52 rounded-full border-[6px] border-white/40 dark:border-white/10 shadow-2xl object-cover animate-float relative z-10"
                        />
                        {/* Little sparkle decoration */}
                        <span className="absolute -top-2 -right-2 text-4xl animate-bounce delay-700">✨</span>
                    </div>

                    {/* Poetic Headline */}
                    <h1 className="text-3xl md:text-5xl font-bold text-ghibli-charcoal dark:text-white leading-tight drop-shadow-sm">
                        weaving silence into <br />
                        <span className="text-ghibli-wood dark:text-ghibli-gold italic font-serif">stories of ink & clay</span>
                    </h1>

                    {/* Soft Description */}
                    <p className="text-lg md:text-xl text-ghibli-charcoal/70 dark:text-white/70 font-sans leading-relaxed">
                        A quiet corner of the internet where mandalas bloom and miniatures come to life.
                        Welcome to my studio of small wonders.
                    </p>

                    {/* Action */}
                    <div className="pt-8">
                        <a
                            href="#gallery"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-ghibli-wood text-ghibli-cream hover:bg-ghibli-navy hover:scale-105 active:scale-95 transition-all duration-300 font-bold tracking-widest text-sm shadow-lg hover:shadow-xl ring-4 ring-transparent hover:ring-ghibli-gold/20"
                        >
                            <span>EXPLORE THE COLLECTION</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                    </div>

                </div>
            </div>

            {/* Foreground Elements (Parallax feel) */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-ghibli-cream to-transparent dark:from-ghibli-dark-bg pointer-events-none"></div>
        </section>
    );
};

export default Hero;
