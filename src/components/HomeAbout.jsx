import { Link, useLocation } from 'react-router-dom';

const HomeAbout = () => {
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';

  return (
    <section className={`defer-section relative ${isAboutPage ? 'pt-8 pb-12' : 'py-24 md:py-32'} bg-[#FAF8F5] overflow-hidden`}>
      <div className="absolute top-0 right-0 w-[50vw] max-w-[600px] h-[50vw] max-h-[600px] bg-ghibli-wood/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[40vw] max-w-[500px] h-[40vw] max-h-[500px] bg-ghibli-gold/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />

      <div className="page-container max-w-[1400px] relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="w-full lg:w-1/2 relative h-[380px] sm:h-[450px] md:h-[600px] flex items-center justify-center">
            <div
              className="reveal-up absolute z-20 w-[65%] aspect-[3/4] rounded-t-full rounded-b-3xl bg-ghibli-paper shadow-2xl border-4 border-white overflow-hidden"
              style={{ animationDelay: '0ms' }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-ghibli-wood/40 to-transparent z-10" />
              <div className="w-full h-full bg-ghibli-cream/50 flex flex-col items-center justify-center p-6 text-center relative z-0">
                <span className="text-6xl mb-4">🌸</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-ghibli-wood">Vishakha Garg</span>
                <span className="text-xs text-ghibli-charcoal/40 font-serif italic mt-1">Visual Artist</span>
              </div>
            </div>

            <div
              className="reveal-up absolute left-[5%] top-[25%] z-30 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-ghibli-wood/10 -rotate-6"
              style={{ animationDelay: '120ms' }}
            >
              <div className="text-3xl font-extrabold text-ghibli-wood font-serif">100%</div>
              <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-ghibli-charcoal/50 mt-1">Handmade</div>
            </div>

            <div
              className="reveal-up absolute right-[5%] bottom-[15%] z-10 w-[45%] aspect-square rounded-[2rem] bg-[#E8B4B8]/20 shadow-lg border-2 border-white flex flex-col justify-center items-center p-4 text-center"
              style={{ animationDelay: '80ms' }}
            >
              <span className="text-4xl mb-2">✨</span>
              <div className="text-2xl font-extrabold text-ghibli-charcoal font-serif">500+</div>
              <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-ghibli-charcoal/50">Happy Homes</div>
            </div>

            <div
              className="reveal-up absolute right-[15%] top-[10%] z-30 bg-white p-3 rounded-full shadow-lg border border-ghibli-wood/10 flex items-center gap-2 rotate-12"
              style={{ animationDelay: '160ms' }}
            >
              <span className="text-xl">⭐️</span>
              <span className="text-sm font-bold text-ghibli-charcoal pr-2">5.0</span>
            </div>
          </div>

          <div
            className="reveal-up w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left"
            style={{ animationDelay: '100ms' }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-ghibli-wood/40" />
              <span className="text-ghibli-wood text-[11px] font-extrabold tracking-[0.3em] uppercase">
                The Artist Behind The Craft
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-ghibli-charcoal font-serif tracking-tight mb-8 leading-[1.1] relative">
              Where soul <br />
              <span className="relative z-10 text-ghibli-wood italic font-light">meets craft.</span>
              <div className="absolute bottom-2 left-0 w-full h-4 bg-ghibli-gold/20 -z-10 -rotate-2" />
            </h2>

            <p className="text-ghibli-charcoal/70 text-lg md:text-xl leading-relaxed mb-6 max-w-xl font-serif">
              I am <strong className="text-ghibli-charcoal">Vishakha Garg</strong>, a visual artist specializing in paintings, handmade miniatures, and custom clay works.
            </p>

            <p className="text-ghibli-charcoal/60 text-base leading-relaxed mb-12 max-w-xl">
              Visheshkala is born from a deep love for details. Every piece is an exploration of concise, meaningful art—crafted slowly, deliberately, and with immense intention to bring warmth into your everyday spaces.
            </p>

            {!isAboutPage && (
              <Link
                to="/about"
                className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-300 bg-ghibli-wood rounded-full hover:bg-ghibli-wood/90 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black" />
                <span className="relative text-sm tracking-[0.15em] uppercase flex items-center gap-3">
                  Discover My Toolkit
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-2">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAbout;
