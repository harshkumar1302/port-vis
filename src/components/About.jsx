const About = () => {
    return (
        <section id="about" className="section-container relative overflow-hidden bg-ghibli-paper/20">
            {/* Artistic Background glow */}
            <div className="absolute top-[10%] right-[-5%] w-[50%] h-[50%] bg-ghibli-sunset/5 blur-[150px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10 px-6">
                <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-ghibli-charcoal dark:text-white drop-shadow-sm">
                    The <span className="italic text-ghibli-wood dark:text-ghibli-gold">Story Behind</span>
                </h2>

                <div className="space-y-12">
                    {/* Genesis Card */}
                    <div className="card-glass p-6 sm:p-10 bg-white/60 dark:bg-ghibli-dark-card/60 backdrop-blur-3xl shadow-xl text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ghibli-moss via-ghibli-gold to-ghibli-wood opacity-50"></div>

                        <h3 className="text-3xl font-serif font-bold text-ghibli-navy dark:text-ghibli-gold mb-6 inline-flex items-center gap-4 justify-center">
                            <span className="text-4xl">📖</span> The Genesis
                        </h3>
                        <p className="text-xl text-ghibli-charcoal/90 dark:text-white/90 leading-relaxed font-serif italic mb-6">
                            "A dedicated professional with a background in Business Administration and a creative heart."
                        </p>
                        <p className="text-lg text-ghibli-charcoal/70 dark:text-white/70 leading-relaxed font-sans max-w-2xl mx-auto">
                            My journey is built on the belief that structures can be beautiful, and data can be artistic. I transform complex processes into seamless experiences.
                        </p>
                    </div>

                    {/* Values Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="card-glass p-6 sm:p-8 hover:border-ghibli-gold group transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl bg-white/40 dark:bg-ghibli-dark-card/40 backdrop-blur-md">
                            <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 flex justify-center text-center">
                                <span className="group-hover:scale-110 transition-transform duration-300 block">🧩</span>
                            </div>
                            <h4 className="text-xl sm:text-2xl font-bold text-center text-ghibli-wood dark:text-ghibli-gold mb-3 transition-colors">Precision</h4>
                            <p className="text-ghibli-charcoal/70 dark:text-white/70 font-serif text-sm leading-relaxed text-center">
                                Meticulous in every pattern and business process.
                            </p>
                        </div>

                        <div className="card-glass p-6 sm:p-8 hover:border-ghibli-gold group transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl bg-white/40 dark:bg-ghibli-dark-card/40 backdrop-blur-md">
                            <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 flex justify-center text-center">
                                <span className="group-hover:scale-110 transition-transform duration-300 block">🤝</span>
                            </div>
                            <h4 className="text-xl sm:text-2xl font-bold text-center text-ghibli-wood dark:text-ghibli-gold mb-3 transition-colors">Empathy</h4>
                            <p className="text-ghibli-charcoal/70 dark:text-white/70 font-serif text-sm leading-relaxed text-center">
                                Building solutions that truly resonate with people.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
