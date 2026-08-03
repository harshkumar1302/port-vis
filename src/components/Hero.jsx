import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const TITLE = 'Visheshkala';
const TAGLINE_WORDS = 'Matchless offerings, from us to you.'.split(' ');

/** Slow fog-like orbital arcs around the portrait */
const ORBIT_LINES = [
  { rx: 188, ry: 188, tilt: 0, width: 1, dash: '40 520', opacity: 0.35, duration: 48, reverse: false },
  { rx: 198, ry: 172, tilt: 12, width: 0.8, dash: '25 600', opacity: 0.22, duration: 62, reverse: true },
  { rx: 205, ry: 185, tilt: -8, width: 1.2, dash: '70 480', opacity: 0.28, duration: 55, reverse: false },
  { rx: 215, ry: 168, tilt: 22, width: 0.7, dash: '15 650', opacity: 0.18, duration: 72, reverse: true },
  { rx: 178, ry: 198, tilt: -15, width: 0.9, dash: '55 510', opacity: 0.25, duration: 58, reverse: false },
  { rx: 222, ry: 190, tilt: 35, width: 0.6, dash: '30 580', opacity: 0.15, duration: 80, reverse: true },
  { rx: 192, ry: 210, tilt: -28, width: 1, dash: '90 450', opacity: 0.2, duration: 65, reverse: false },
  { rx: 208, ry: 155, tilt: 45, width: 0.75, dash: '20 620', opacity: 0.16, duration: 90, reverse: true },
  { rx: 225, ry: 205, tilt: -5, width: 0.5, dash: '12 700', opacity: 0.12, duration: 100, reverse: false },
  { rx: 170, ry: 182, tilt: 18, width: 0.85, dash: '45 540', opacity: 0.2, duration: 52, reverse: true },
  { rx: 200, ry: 220, tilt: -38, width: 0.65, dash: '18 590', opacity: 0.14, duration: 85, reverse: false },
  { rx: 230, ry: 175, tilt: 8, width: 0.55, dash: '8 720', opacity: 0.1, duration: 110, reverse: true },
];

const Hero = () => {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) {
        gsap.set(root.querySelectorAll('[data-hero-animate]'), { opacity: 1, clearProps: 'all' });
        ORBIT_LINES.forEach((line, i) => {
          gsap.set(`[data-hero-orbit-line="${i}"] ellipse`, { opacity: line.opacity * 0.6 });
        });
        return;
      }

      gsap.set('[data-hero-char]', { y: 110, rotateX: -75, opacity: 0, transformOrigin: '50% 100%' });
      gsap.set('[data-hero-word]', { y: '100%', opacity: 0 });
      gsap.set('[data-hero-badge]', { y: 36, opacity: 0 });
      gsap.set('[data-hero-btn]', { y: 36, opacity: 0 });
      gsap.set('[data-hero-desc]', { y: 36, opacity: 0 });
      gsap.set('[data-hero-scale]', { scale: 0, opacity: 0 });
      gsap.set('[data-hero-blob]', { scale: 0.2, opacity: 0 });
      gsap.set('[data-hero-curtain]', { scaleY: 1 });
      gsap.set('[data-hero-line]', { scaleX: 0 });
      gsap.set('[data-hero-ring]', { strokeDashoffset: 880, opacity: 0 });
      gsap.set('[data-hero-orbit-line] ellipse', { opacity: 0, strokeDashoffset: 0 });
      gsap.set('[data-hero-spark]', { scale: 0, opacity: 0, rotation: -90 });
      gsap.set('[data-hero-scroll]', { opacity: 0, y: 16 });

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.to('[data-hero-curtain]', {
        scaleY: 0,
        duration: 1.1,
        ease: 'power3.inOut',
        transformOrigin: 'top center',
      })
        .to(
          '[data-hero-blob]',
          { scale: 1, opacity: 1, duration: 1.4, stagger: 0.12, ease: 'power2.out' },
          0.15
        )
        .to('[data-hero-badge]', { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.7)' }, 0.45)
        .to(
          '[data-hero-char]',
          {
            y: 0,
            rotateX: 0,
            opacity: 1,
            duration: 0.95,
            stagger: { each: 0.035, from: 'start' },
            ease: 'back.out(1.4)',
          },
          0.55
        )
        .to('[data-hero-line]', { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, 0.95)
        .to(
          '[data-hero-word]',
          {
            y: '0%',
            opacity: 1,
            duration: 0.65,
            stagger: 0.06,
            ease: 'power3.out',
          },
          1.05
        )
        .to('[data-hero-desc]', { y: 0, opacity: 1, duration: 0.75 }, 1.35)
        .to('[data-hero-ring]', { strokeDashoffset: 0, opacity: 1, duration: 1.6, ease: 'power2.inOut' }, 1.2)
        .to(
          '[data-hero-orbit-line] ellipse',
          {
            opacity: (i) => ORBIT_LINES[i]?.opacity ?? 0.2,
            duration: 1.8,
            stagger: 0.06,
            ease: 'power2.out',
          },
          1.3
        )
        .to(
          '[data-hero-avatar-wrap]',
          { scale: 1, opacity: 1, duration: 1.1, ease: 'back.out(1.6)' },
          1.25
        )
        .to(
          '[data-hero-spark]',
          { scale: 1, opacity: 1, rotation: 0, duration: 0.55, stagger: 0.08, ease: 'back.out(2.5)' },
          1.55
        )
        .to(
          '[data-hero-btn]',
          { y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: 'back.out(1.8)' },
          1.65
        )
        .to('[data-hero-scroll]', { opacity: 1, y: 0, duration: 0.6 }, 2.0);

      // Continuous ambient motion
      gsap.to('[data-hero-blob="1"]', {
        x: 30,
        y: -20,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('[data-hero-blob="2"]', {
        x: -25,
        y: 25,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5,
      });
      gsap.to('[data-hero-blob="3"]', {
        scale: 1.12,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('[data-hero-ring-wrap]', {
        rotation: 360,
        transformOrigin: '200px 200px',
        duration: 28,
        repeat: -1,
        ease: 'none',
      });

      ORBIT_LINES.forEach((line, i) => {
        gsap.to(`[data-hero-orbit-line="${i}"]`, {
          rotation: line.reverse ? -360 : 360,
          transformOrigin: '200px 200px',
          duration: line.duration,
          repeat: -1,
          ease: 'none',
        });
        gsap.to(`[data-hero-orbit-line="${i}"] ellipse`, {
          strokeDashoffset: line.reverse ? 800 : -800,
          duration: line.duration * 1.2,
          repeat: -1,
          ease: 'none',
        });
      });

      gsap.to('[data-hero-avatar]', {
        y: -14,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2.2,
      });

      gsap.to('[data-hero-glow]', {
        scale: 1.15,
        opacity: 0.65,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Mouse parallax on avatar column
      const parallax = root.querySelector('[data-hero-parallax]');
      const onMove = (e) => {
        const rect = root.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(parallax, {
          x: x * 28,
          y: y * 18,
          rotateY: x * 6,
          rotateX: -y * 6,
          duration: 0.8,
          ease: 'power2.out',
        });
      };
      const onLeave = () => {
        gsap.to(parallax, { x: 0, y: 0, rotateY: 0, rotateX: 0, duration: 1, ease: 'power3.out' });
      };
      root.addEventListener('mousemove', onMove);
      root.addEventListener('mouseleave', onLeave);

      return () => {
        root.removeEventListener('mousemove', onMove);
        root.removeEventListener('mouseleave', onLeave);
      };
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      id="home"
      className="hero-section relative overflow-hidden flex items-center pt-16 pb-24 md:pt-24 md:pb-32 lg:pt-32 lg:pb-40 min-h-[500px]"
    >
      {/* Opening curtain */}
      <div
        data-hero-curtain
        className="absolute inset-0 z-[60] bg-gradient-to-b from-ghibli-cream via-ghibli-paper/90 to-ghibli-cream origin-top pointer-events-none"
        aria-hidden
      />



      {/* Subtle grain */}
      <div className="hero-grain absolute inset-0 z-[1] pointer-events-none opacity-[0.35]" aria-hidden />

      <div className="max-w-7xl mx-auto page-container relative z-10 w-full">
        {/* Ambient blobs locked to content */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
          <div
            data-hero-blob="1"
            className="absolute -left-24 top-16 h-[32rem] w-[32rem] rounded-full bg-[#FCEBEB]/70 blur-3xl"
          />
          <div
            data-hero-blob="2"
            className="absolute -right-20 bottom-0 h-[42rem] w-[42rem] rounded-full bg-[#FACD60]/30 blur-3xl"
          />
          <div
            data-hero-blob="3"
            className="absolute right-[15%] top-[18%] h-72 w-72 rounded-full bg-white/55 blur-3xl"
          />
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-10 sm:gap-12 lg:gap-20">
          {/* Left — copy */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left pt-4 sm:pt-10 [perspective:900px]">
            <div data-hero-badge data-hero-fade className="mb-5 opacity-0 translate-y-9">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/75 border border-ghibli-gold/35 text-ghibli-wood text-[10px] sm:text-xs font-bold tracking-[0.22em] uppercase shadow-sm backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-ghibli-gold hero-pulse-dot" />
                Handmade in India
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-serif leading-[1.05] mb-3 select-none">
              <span className="hero-shimmer-text block text-ghibli-charcoal">
                {TITLE.split('').map((char, i) => (
                  <span
                    key={i}
                    data-hero-char
                    className="inline-block will-change-transform"
                    style={{ display: 'inline-block', transformStyle: 'preserve-3d' }}
                  >
                    {char}
                  </span>
                ))}
              </span>
              <span
                data-hero-line
                className="block h-[3px] w-24 sm:w-32 mt-4 mb-4 rounded-full bg-gradient-to-r from-ghibli-gold via-ghibli-wood to-transparent origin-left scale-x-0"
              />
              <span className="block text-ghibli-wood italic text-3xl sm:text-4xl md:text-[2.65rem] font-serif leading-snug overflow-hidden">
                {TAGLINE_WORDS.map((word, i) => (
                  <span key={i} className="inline-block overflow-hidden mr-[0.28em] last:mr-0 align-bottom">
                    <span data-hero-word className="inline-block will-change-transform">
                      {word}
                    </span>
                  </span>
                ))}
              </span>
            </h1>

            <p
              data-hero-desc
              data-hero-fade
              className="text-lg md:text-xl text-ghibli-charcoal/70 font-sans leading-relaxed mb-10 max-w-lg select-none opacity-0 translate-y-9"
            >
              Mandalas, miniatures, and gifts — each one shaped slowly by hand. Made to feel personal, not picked off a shelf.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <div data-hero-btn data-hero-fade className="opacity-0 translate-y-9">
                <Link
                  to="/shop"
                  className="hero-cta-primary group inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-ghibli-wood text-ghibli-cream font-bold tracking-widest text-xs shadow-lg w-full sm:w-auto relative overflow-hidden"
                >
                  <span className="relative z-10">Shop Collection →</span>
                  <span className="hero-cta-shine absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              </div>
              <div data-hero-btn data-hero-fade className="opacity-0 translate-y-9">
                <Link
                  to="/gallery"
                  className="inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-white/85 text-ghibli-wood border border-ghibli-wood/20 hover:bg-ghibli-paper font-bold tracking-widest text-xs shadow-sm backdrop-blur-sm w-full sm:w-auto transition-colors duration-300"
                >
                  View Gallery
                </Link>
              </div>
            </div>
          </div>

          {/* Right — avatar stage */}
          <div
            data-hero-parallax
            className="w-full lg:w-1/2 relative flex flex-col items-center justify-center mt-12 lg:mt-0 min-h-[340px] sm:min-h-[420px] will-change-transform"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              data-hero-badge
              data-hero-fade
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/60 border border-ghibli-wood/15 text-ghibli-wood text-xs font-bold tracking-widest uppercase mb-10 shadow-sm backdrop-blur-md opacity-0 translate-y-9"
            >
              <span className="w-2 h-2 rounded-full bg-ghibli-gold hero-pulse-dot" />
              Handcrafted Art & Gifts
            </div>

            <div className="relative flex items-center justify-center w-[min(100%,22rem)] sm:w-[26rem] md:w-[28rem] aspect-square">
              {/* Foggy orbital lines */}
              <svg
                className="absolute inset-[-8%] w-[116%] h-[116%] pointer-events-none z-[4] hero-orbit-fog"
                viewBox="0 0 400 400"
                fill="none"
                aria-hidden
              >
                <defs>
                  <linearGradient id="orbitLineGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FACD60" stopOpacity="0" />
                    <stop offset="35%" stopColor="#FACD60" stopOpacity="0.85" />
                    <stop offset="65%" stopColor="#8B5E3C" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#FACD60" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="orbitLineSoft" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8B5E3C" stopOpacity="0" />
                    <stop offset="50%" stopColor="#FACD60" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#8B5E3C" stopOpacity="0" />
                  </linearGradient>
                  <filter id="orbitFogBlur" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <g filter="url(#orbitFogBlur)">
                  {ORBIT_LINES.map((line, i) => (
                    <g
                      key={i}
                      data-hero-orbit-line={i}
                      style={{ transformOrigin: '200px 200px' }}
                    >
                      <ellipse
                        cx="200"
                        cy="200"
                        rx={line.rx}
                        ry={line.ry}
                        fill="none"
                        stroke={i % 2 === 0 ? 'url(#orbitLineGold)' : 'url(#orbitLineSoft)'}
                        strokeWidth={line.width}
                        strokeDasharray={line.dash}
                        strokeLinecap="round"
                        opacity="0"
                        transform={`rotate(${line.tilt} 200 200)`}
                      />
                    </g>
                  ))}
                </g>
              </svg>

              {/* Inner ring draw */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
                viewBox="0 0 400 400"
                fill="none"
                aria-hidden
              >
                <g data-hero-ring-wrap style={{ transformOrigin: '200px 200px' }}>
                  <circle
                    data-hero-ring
                    cx="200"
                    cy="200"
                    r="178"
                    stroke="url(#heroRingGrad)"
                    strokeWidth="1.5"
                    strokeDasharray="880"
                    strokeDashoffset="880"
                    strokeLinecap="round"
                    opacity="0"
                  />
                </g>
                <defs>
                  <linearGradient id="heroRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FACD60" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#8B5E3C" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#FACD60" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
              </svg>

              <div
                data-hero-avatar-wrap
                data-hero-scale
                className="relative z-10 scale-0 opacity-0"
              >
                <div
                  data-hero-glow
                  className="absolute -inset-6 rounded-full bg-ghibli-gold/35 blur-2xl"
                />
                <img
                  data-hero-avatar
                  src="/ghibli-avatar.png"
                  alt="Vishakha Garg — founder of Visheshkala handmade art studio"
                  className="relative w-44 h-44 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-full border-[6px] sm:border-8 border-white/70 shadow-[0_25px_60px_rgba(139,94,60,0.25)] object-cover"
                />
                <span
                  data-hero-spark
                  className="absolute -top-3 -right-2 text-4xl sm:text-5xl select-none z-20"
                >
                  ✨
                </span>
                <span
                  data-hero-spark
                  className="absolute bottom-8 -left-5 text-3xl sm:text-4xl select-none z-20"
                >
                  ✨
                </span>
                <span
                  data-hero-spark
                  className="absolute top-1/2 -right-8 text-2xl select-none z-20 opacity-80"
                >
                  ✦
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        data-hero-scroll
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none opacity-0"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-ghibli-wood/45">Discover</span>
        <div className="hero-scroll-mouse w-5 h-8 rounded-full border-2 border-ghibli-wood/25 flex justify-center pt-1.5">
          <div className="hero-scroll-wheel w-1 h-1.5 rounded-full bg-ghibli-wood/50" />
        </div>
      </div>

      <div className="absolute bottom-0 w-full h-36 bg-gradient-to-t from-ghibli-cream to-transparent pointer-events-none z-10" />
    </section>
  );
};

export default Hero;
