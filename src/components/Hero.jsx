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
                            className="w-40 h-40 md:w-52 md:h-52 rounded-full border-[6px] border-white/40 shadow-2xl object-cover animate-float relative z-10"
                        />
                        {/* Little sparkle decoration */}
                        <span className="absolute -top-2 -right-2 text-4xl animate-bounce delay-700 select-none">✨</span>
                    </div>

                    {/* Poetic Headline */}
                    <h1 className="text-3xl md:text-5xl font-bold text-ghibli-charcoal leading-tight drop-shadow-sm select-none">
                        {wordWrap("weaving silence into")} <br />
                        <span className="text-ghibli-wood italic font-serif">
                            {wordWrap("stories of ink & clay")}
                        </span>
                    </h1>

                    {/* Soft Description */}
                    <p className="text-lg md:text-xl text-ghibli-charcoal/80 font-sans leading-relaxed select-none">
                        {wordWrap("A quiet corner of the internet where mandalas bloom and miniatures come to life.")}
                        <br />
                        {wordWrap("Welcome to my studio of small wonders.")}
                    </p>

                    {/* Action */}
                    <div className="pt-8 relative z-30">
                        <a
                            href="#gallery"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-ghibli-wood text-ghibli-cream hover:bg-ghibli-navy hover:scale-105 active:scale-95 transition-all duration-300 font-bold tracking-widest text-sm shadow-lg hover:shadow-xl ring-4 ring-transparent hover:ring-ghibli-gold/20 cursor-pointer"
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
