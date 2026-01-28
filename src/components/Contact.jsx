const Contact = () => {
    const socialLinks = [
        {
            name: "Instagram",
            url: "https://www.instagram.com/idiosyncratic_art30_/",
            icon: "📷"
        },
        {
            name: "LinkedIn",
            url: "https://www.linkedin.com/in/vishakha-garg30/",
            icon: "💼"
        }
    ];

    return (
        <section id="contact" className="section-container relative overflow-hidden bg-gradient-to-b from-transparent to-ghibli-gold/10 pt-32 pb-32">
            <div className="max-w-3xl mx-auto text-center relative z-10 px-6">

                <span className="text-ghibli-wood dark:text-ghibli-gold font-bold tracking-[0.2em] uppercase text-xs mb-6 block">
                    Have an idea?
                </span>

                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-ghibli-charcoal dark:text-white font-serif">
                    Let's create something <br />
                    <span className="text-ghibli-wood dark:text-ghibli-salmon italic">beautiful together.</span>
                </h2>

                <p className="text-lg text-ghibli-charcoal/70 dark:text-white/70 mb-16 font-sans leading-loose">
                    Open for commissions, potential collaborations, or just a friendly chat about art and miniatures.
                </p>

                <div className="flex flex-col items-center gap-10">

                    {/* Socials & Email */}
                    <div className="flex flex-wrap gap-6 items-center justify-center">
                        {socialLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-14 h-14 rounded-full bg-white dark:bg-ghibli-dark-card border border-ghibli-wood/10 dark:border-white/10 flex items-center justify-center text-2xl shadow-sm hover:shadow-lg hover:scale-110 transition-all group relative"
                            >
                                {link.icon}
                                <span className="absolute -bottom-8 px-2 py-1 bg-ghibli-charcoal text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {link.name}
                                </span>
                            </a>
                        ))}

                        <a
                            href="mailto:vishakha.g309@gmail.com"
                            className="px-8 py-4 bg-ghibli-wood text-ghibli-cream font-bold text-xs uppercase tracking-[0.2em] rounded-full shadow-lg hover:bg-ghibli-navy hover:scale-105 transition-all"
                        >
                            Say Hello
                        </a>
                    </div>

                </div>
            </div>

            {/* Footer Signature */}
            <div className="absolute bottom-10 left-0 right-0 text-center opacity-40 select-none">
                <p className="font-serif italic text-xs text-ghibli-charcoal dark:text-white flex items-center justify-center gap-2 tracking-widest">
                    <span>Made with creativity</span>
                    <span className="text-sm animate-star translate-y-[-1px]">✨</span>
                    <span>from Vishakha</span>
                </p>
            </div>
        </section>
    );
};

export default Contact;
