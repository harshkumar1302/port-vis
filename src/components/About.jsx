

const About = () => {
    return (
        <section id="about" className="section-container relative overflow-hidden bg-ghibli-paper/20">
            {/* --- Organic Flow Backdrop --- */}
            <div className="absolute inset-0 pointer-events-none">
                {/* 1. Base Gradient - Soft Creamy White */}
                <div className="absolute inset-0 bg-gradient-to-b from-ghibli-cream via-white to-ghibli-cream/20"></div>

                {/* 2. Fluid Wave - Top Right */}
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(255,220,180,0.15)_0%,transparent_70%)] blur-[80px] rounded-full opacity-60"></div>

                {/* 3. Soft Glow - Bottom Left */}
                <div className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(138,154,91,0.08)_0%,transparent_70%)] blur-[100px] rounded-full"></div>

                {/* 4. Subtle Noise Overlay for Texture */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
            </div>



            <div className="max-w-4xl mx-auto relative z-10 px-6">
                <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-ghibli-charcoal drop-shadow-sm">
                    <span className="italic text-ghibli-wood">About</span>
                </h2>

                <div className="space-y-12">
                    {/* Genesis Card */}
                    <div className="card-glass p-6 sm:p-10 bg-white/60 backdrop-blur-3xl shadow-xl text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ghibli-wood via-ghibli-gold to-ghibli-wood opacity-50"></div>

                        <p className="text-xl text-ghibli-charcoal/90 leading-relaxed font-serif italic mb-6">
                            "I create with a belief that small details carry meaning. As an artist, I value patience, balance, and intention in every step of the process."
                        </p>
                        <p className="text-lg text-ghibli-charcoal/70 leading-relaxed font-sans max-w-2xl mx-auto">
                            At Visheshkala, this is reflected in art and handcrafted pieces shaped with care, simple creations made to feel personal and lasting.
                        </p>
                    </div>

                    {/* Values Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="card-glass p-6 sm:p-8 hover:border-ghibli-gold group transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl bg-white/40 backdrop-blur-md">
                            <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 flex justify-center text-center">
                                <span className="group-hover:scale-110 transition-transform duration-300 block">🎁</span>
                            </div>
                            <h4 className="text-xl sm:text-2xl font-bold text-center text-ghibli-wood mb-3 transition-colors">Meaningful Gifting</h4>
                            <p className="text-ghibli-charcoal/70 font-serif text-sm leading-relaxed text-center">
                                Each creation is shaped by hand, never rushed, and made to be cherished, shared, and remembered.
                            </p>
                        </div>

                        <div className="card-glass p-6 sm:p-8 hover:border-ghibli-gold group transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl bg-white/40 backdrop-blur-md">
                            <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 flex justify-center text-center">
                                <span className="group-hover:scale-110 transition-transform duration-300 block">✨</span>
                            </div>
                            <h4 className="text-xl sm:text-2xl font-bold text-center text-ghibli-wood mb-3 transition-colors">Detailing</h4>
                            <p className="text-ghibli-charcoal/70 font-serif text-sm leading-relaxed text-center">
                                Thoughtful finishes, balanced patterns, and careful attention to every line and texture make each creation feel refined and personal.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
