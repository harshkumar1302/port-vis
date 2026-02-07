import { useEffect, useState } from 'react';
import MandalaBackground from './MandalaBackground';

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
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-transparent">
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
                {/* Desktop Mandala - Grand & Expansive */}
                <div className="absolute top-[10%] right-[-10%] w-[900px] h-[900px] hidden md:block opacity-10 pointer-events-none">
                    <MandalaBackground color="#D4A74A" />
                </div>

                {/* Mobile Mandala - Optimized & Tucked */}
                <div className="absolute top-[-10%] right-[-30%] w-[120%] h-[120%] block md:hidden opacity-10 pointer-events-none">
                    <MandalaBackground color="#D4A74A" />
                </div>

                {/* Side Gradient Fillers for "Empty Space" */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-32 h-[80%] bg-gradient-to-r from-ghibli-cream/20 to-transparent blur-3xl pointer-events-none"></div>

                {/* Zig-Zag Pattern: 1. Hero -> Top Right */}
                <MandalaBackground
                    className="top-[-15%] right-[-25%] md:top-[-20%] md:right-[-10%] w-[130%] md:w-[900px] md:h-[900px]"
                    color="#F5E6CA"
                    opacity={0.3}
                />
            </div>

            <div className="section-container relative z-10 text-center">
                <div className="animate-fade-in space-y-8 max-w-2xl mx-auto">

                    {/* Avatar Element */}
                    <div className="relative inline-block mb-2 group">
                        <div className="absolute inset-0 bg-ghibli-gold/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700 animate-pulse-slow"></div>
                        <img
                            src="/ghibli-avatar.png"
                            alt="Vishakha"
                            className="w-40 h-40 md:w-52 md:h-52 rounded-full border-[6px] border-white/40 shadow-2xl object-cover animate-float relative z-10"
                        />
                        {/* Little sparkle decoration */}
                        <span className="absolute -top-2 -right-2 text-4xl animate-bounce delay-700 select-none">✨</span>
                    </div>

                    {/* Poetic Headline */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-medium tracking-tight text-ghibli-charcoal leading-tight drop-shadow-sm select-none">
                        {wordWrap("Visheshkala")} <br />
                        <span className="text-ghibli-wood italic font-serif mt-2 block tracking-normal text-3xl md:text-4xl">
                            {wordWrap("Where Soul Meets Craft")}
                        </span>
                    </h1>

                    {/* Soft Description */}
                    <p className="text-lg md:text-xl text-ghibli-charcoal/80 font-sans leading-relaxed select-none">
                        {wordWrap("Quiet, meaningful art shaped into heartfelt gifts and lasting memories.")}
                    </p>

                    {/* Action */}
                    <div className="pt-8 relative z-30">
                        <a
                            href="#gallery"
                            className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full bg-ghibli-wood text-ghibli-cream hover:bg-[#A0704F] hover:scale-105 active:scale-95 transition-all duration-300 font-bold tracking-widest text-xs md:text-sm shadow-lg hover:shadow-xl ring-4 ring-transparent hover:ring-ghibli-gold/20 cursor-pointer"
                        >
                            <span>EXPLORE THE COLLECTION</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
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
