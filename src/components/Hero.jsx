import { useEffect, useState } from 'react';


const Hero = () => {
    const [stars, setStars] = useState([]);

    // useEffect(() => {
    //     // Generate 100 stars with bi-directional movement
    //     const initialStars = Array.from({ length: 100 }).map((_, i) => {
    //         const direction = i < 40 ? 'right' : 'left'; // 40 move right, 60 move left
    //         return {
    //             id: i,
    //             top: `${Math.random() * 100}%`,
    //             left: `${Math.random() * 100}%`,
    //             size: Math.random() * 3 + 2, // Bigger stars (2px to 5px)
    //             delay: Math.random() * 10,
    //             duration: Math.random() * 3 + 2,
    //             driftDuration: Math.random() * 40 + 40, // Varied speeds
    //             direction
    //         };
    //     });
    //     setStars(initialStars);
    // }, []);

    const wordWrap = (text) => {
        return text.split(' ').map((word, i) => (
            <span key={i} className="hover-word mr-[0.3em] inline-block">
                {word}
            </span>
        ));
    };

    return (
        <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-transparent">
            {/* 🌌 Starry Night Background */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* Night Sky Gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-ghibli-navy/5 to-transparent"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_40%,rgba(250,205,96,0.05),transparent_60%)]"></div>

                {/* Individual Stars with Bi-directional Drift */}
                <div className="absolute inset-0 overflow-hidden">
                    {stars.map(star => (
                        <div
                            key={star.id}
                            className={`absolute bg-white rounded-full animate-twinkle shadow-[0_0_10px_rgba(255,255,255,0.8)] ${star.direction === 'right' ? 'animate-drift-right' : 'animate-drift-left'}`}
                            style={{
                                top: star.top,
                                left: star.left,
                                width: `${star.size}px`,
                                height: `${star.size}px`,
                                animationDelay: `${star.delay}s`,
                                animationDuration: `${star.duration}s`,
                                opacity: 0.3 + Math.random() * 0.5,
                                '--drift-duration': `${star.driftDuration}s`
                            }}
                        />
                    ))}
                </div>

                {/* Atmospheric Glows */}
                {/* Atmospheric Glows & Side Fillers */}




                {/* Side Gradient Fillers for "Empty Space" */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-32 h-[80%] bg-gradient-to-r from-ghibli-cream/20 to-transparent blur-3xl pointer-events-none"></div>


            </div>

            <div className="section-container relative z-10 pt-32 md:pt-48">
                <div className="animate-fade-in space-y-8 w-full flex flex-col items-center text-center">

                    {/* Pill Tag — Creonnect style */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ghibli-wood/10 border border-ghibli-wood/20 text-ghibli-wood text-xs font-bold tracking-widest uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-ghibli-gold animate-pulse"></span>
                        Handcrafted Art & Gifts
                    </div>

                    {/* Avatar Element */}
                    <div className="relative inline-block mb-2 group">
                        <div className="absolute inset-0 bg-ghibli-gold/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700 animate-pulse-slow"></div>
                        <img
                            src="/ghibli-avatar.png"
                            alt="Vishakha"
                            className="w-36 h-36 md:w-44 md:h-44 rounded-full border-[6px] border-white/40 shadow-2xl object-cover animate-float relative z-10"
                        />
                        {/* Little sparkle decoration */}
                        <span className="absolute -top-2 -right-2 text-4xl animate-bounce delay-700 select-none">✨</span>
                    </div>

                    {/* Poetic Headline — Creonnect tighter tracking */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-ghibli-charcoal leading-[1.1] drop-shadow-sm select-none max-w-4xl">
                        {wordWrap("Visheshkala")} <br />
                        <span className="text-ghibli-wood italic font-serif mt-2 block tracking-tight text-3xl sm:text-4xl md:text-5xl">
                            {wordWrap("Matchless offerings, from us to you.")}
                        </span>
                    </h1>

                    {/* Soft Description */}
                    <p className="text-lg md:text-xl text-ghibli-charcoal/70 font-sans leading-relaxed select-none max-w-2xl">
                        {wordWrap("Thoughtfully created to celebrate emotions, memories, and moments that matter. Every artwork is carefully envisioned and lovingly brought to life.")}
                    </p>

                    {/* Action — Pill buttons like Creonnect */}
                    <div className="pt-4 relative z-30 flex items-center gap-4">
                        <a
                            href="#gallery"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-ghibli-wood text-ghibli-cream hover:bg-[#A0704F] hover:scale-105 active:scale-95 transition-all duration-300 font-bold tracking-widest text-xs shadow-lg hover:shadow-xl ring-4 ring-transparent hover:ring-ghibli-gold/20 cursor-pointer"
                        >
                            <span>EXPLORE THE COLLECTION</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                        <a
                            href="#contact"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/80 text-ghibli-wood border border-ghibli-wood/20 hover:bg-ghibli-paper hover:scale-105 active:scale-95 transition-all duration-300 font-bold tracking-widest text-xs shadow-sm hover:shadow-md cursor-pointer"
                        >
                            <span>GET IN TOUCH</span>
                        </a>
                    </div>

                </div>
            </div>

            {/* Foreground Elements (Parallax feel) */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-ghibli-cream to-transparent pointer-events-none z-20"></div>
        </section>
    );
};

export default Hero;
