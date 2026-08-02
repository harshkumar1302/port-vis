import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section id="home" className="min-h-screen relative overflow-hidden bg-transparent flex items-center pt-24 md:pt-32 pb-16">
            {/* Ambient Background Blobs */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute -left-20 top-20 h-[30rem] w-[30rem] rounded-full bg-[#FCEBEB]/60 blur-3xl"></div>
                <div className="absolute right-0 bottom-0 h-[40rem] w-[40rem] rounded-full bg-[#FACD60]/20 blur-3xl"></div>
                <div className="absolute right-32 top-1/4 h-64 w-64 rounded-full bg-white/60 blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    
                    {/* Left Column: Typography & CTAs */}
                    <div className="w-full lg:w-1/2 flex flex-col items-start text-left pt-10">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-ghibli-charcoal font-serif leading-[1.1] mb-6 drop-shadow-sm select-none">
                            Visheshkala <br />
                            <span className="text-ghibli-wood italic mt-2 block tracking-tight text-3xl sm:text-4xl md:text-5xl font-serif">
                                Matchless offerings, from us to you.
                            </span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-ghibli-charcoal/70 font-sans leading-relaxed mb-10 max-w-lg select-none">
                            Mandalas, miniatures, and gifts — each one shaped slowly by hand. Made to feel personal, not picked off a shelf.
                        </p>

                        <div className="flex flex-wrap items-center gap-4">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-ghibli-wood text-ghibli-cream hover:bg-[#A0704F] hover:scale-105 active:scale-95 transition-all duration-300 font-bold tracking-widest text-xs shadow-lg hover:shadow-xl ring-4 ring-transparent hover:ring-ghibli-gold/20 cursor-pointer"
                            >
                                <span>Shop Collection →</span>
                            </Link>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/80 text-ghibli-wood border border-ghibli-wood/20 hover:bg-ghibli-paper hover:scale-105 active:scale-95 transition-all duration-300 font-bold tracking-widest text-xs shadow-sm hover:shadow-md cursor-pointer"
                            >
                                <span>Explore Handmade Art</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Avatar & Pill */}
                    <div className="w-full lg:w-1/2 relative flex flex-col items-center justify-center mt-12 lg:mt-0 min-h-[400px]">
                        
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-ghibli-wood/10 border border-ghibli-wood/20 text-ghibli-wood text-xs font-bold tracking-widest uppercase mb-12 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-ghibli-gold animate-pulse" />
                            Handcrafted Art & Gifts
                        </div>

                        <div className="relative inline-block group">
                            <div className="absolute inset-0 bg-ghibli-gold/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-700 animate-pulse-slow" />
                            <img
                                src="/ghibli-avatar.png"
                                alt="Vishakha"
                                className="w-64 h-64 md:w-80 md:h-80 rounded-full border-[8px] border-white/60 shadow-2xl object-cover animate-float relative z-10"
                            />
                            <span className="absolute -top-4 -right-4 text-5xl animate-bounce delay-700 select-none z-20">✨</span>
                            <span className="absolute bottom-10 -left-6 text-4xl animate-bounce delay-300 select-none z-20 opacity-80">✨</span>
                        </div>

                    </div>

                </div>
            </div>
            
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-ghibli-cream/40 to-transparent pointer-events-none z-20" />
        </section>
    );
};

export default Hero;
