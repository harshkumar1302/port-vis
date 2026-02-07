

const Contact = () => {
    const socialLinks = [
        {
            name: "Instagram",
            url: "https://www.instagram.com/vishesh.kala/",
            color: "hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F]",
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            )
        },

        {
            name: "YouTube",
            url: "https://www.youtube.com/@Vishesh-kala", // Add YouTube Link Here
            color: "hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]",
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
            )
        },
        {
            name: "WhatsApp",
            url: "https://wa.me/917310956254", // Add WhatsApp Link Here
            color: "hover:bg-[#25D366] hover:text-white hover:border-[#25D366]",
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
            )
        },

        {
            name: "LinkedIn",
            url: "https://www.linkedin.com/in/vishakha-garg30/",
            color: "hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5]",
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h5v-8.306c0-4.613 6.135-4.498 6.135 0v8.306h5v-9.715c0-7.398-7.906-7.166-11.167-3.475v-3.116z" />
                </svg>
            )
        }
    ];

    return (
        <section id="contact" className="section-container relative overflow-hidden pt-32 pb-32">
            {/* --- Message / Connection Backdrop --- */}
            {false && (
                <div className="absolute inset-0 pointer-events-none">
                    {/* 1. Base Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-ghibli-cream"></div>

                    {/* 2. Abstract "Envelope" Fold Shapes using Gradients */}
                    <div className="absolute top-0 left-0 w-full h-[500px] bg-[conic-gradient(from_180deg_at_50%_0%,rgba(212,167,74,0.05)_0deg,transparent_60deg,transparent_300deg,rgba(212,167,74,0.05)_360deg)] opacity-60"></div>

                    {/* 3. Floating "Stamp" Circle Decoration */}
                    <div className="absolute top-[10%] right-[10%] w-32 h-32 border border-ghibli-wood/10 rounded-full opacity-60 flex items-center justify-center animate-spin-slow">
                        <div className="w-24 h-24 border border-ghibli-wood/10 rounded-full border-dashed"></div>
                    </div>

                    {/* 4. Connecting Line */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-b from-transparent via-ghibli-wood/20 to-transparent"></div>
                </div>
            )}

            {/* Right Side Glow */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-ghibli-gold/20 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="max-w-3xl mx-auto text-center relative z-10 px-6">

                <span className="text-ghibli-wood font-bold tracking-[0.2em] uppercase text-xs mb-6 block">
                    Have an idea?
                </span>

                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-ghibli-charcoal font-serif">
                    Let's create something <br />
                    <span className="text-ghibli-wood italic">beautiful together.</span>
                </h2>

                <p className="text-lg text-ghibli-charcoal/80 mb-16 font-sans leading-loose">
                    Open for commissions, potential collaborations, or just a friendly chat about art and miniatures.
                </p>

                <div className="flex flex-col items-center gap-10">

                    {/* Socials & Email */}
                    <div className="flex flex-wrap gap-3 md:gap-6 items-center justify-center">
                        {socialLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-10 h-10 md:w-16 md:h-16 rounded-full bg-white border border-ghibli-wood/10 flex items-center justify-center text-ghibli-charcoal shadow-sm hover:shadow-lg hover:scale-110 transition-all group relative duration-300 ${link.color}`}
                            >
                                {link.icon}
                                <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-ghibli-charcoal text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-50 pointer-events-none">
                                    {link.name}
                                </span>
                            </a>
                        ))}

                        <a
                            href="mailto:visheshkalaofficial@gmail.com"
                            className="px-6 py-3 md:px-8 md:py-4 bg-ghibli-wood text-ghibli-cream font-bold text-xs uppercase tracking-[0.2em] rounded-full shadow-lg hover:bg-[#A0704F] hover:scale-105 transition-all"
                        >
                            Order Now
                        </a>
                    </div>

                </div>
            </div>

            {/* Footer Signature */}
            <div className="absolute bottom-10 left-0 right-0 text-center opacity-60 select-none">
                <p className="font-serif  text-xs text-ghibli-charcoal flex items-center justify-center gap-2 tracking-widest">
                    <span>A home for thoughtful creations |</span>
                    <span> Visheshkala</span>
                </p>
            </div>
        </section>
    );
};

export default Contact;
