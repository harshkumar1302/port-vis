import { useEffect, useState } from 'react';

const Loader = ({ onFinished }) => {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [isZooming, setIsZooming] = useState(false);
    const [waveOffset, setWaveOffset] = useState(0);

    useEffect(() => {
        const duration = 3500; // 3.5 seconds to reach 100%
        const interval = 20; // Update every 20ms for smooth animation
        const step = 100 / (duration / interval);

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + step;
                if (next >= 100) {
                    clearInterval(timer);
                    // Wait 300ms at 100%, then start zoom
                    setTimeout(() => {
                        setIsZooming(true);
                        // After 2500ms of zoom+fade, hide loader
                        setTimeout(() => {
                            setIsVisible(false);
                            setTimeout(onFinished, 500);
                        }, 2500);
                    }, 300);
                    return 100;
                }
                return next;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [onFinished]);

    // Animate wave horizontally
    useEffect(() => {
        let animationId;
        let offset = 0;

        const animateWave = () => {
            offset += 2;
            if (offset >= 150) offset = 0;
            setWaveOffset(offset);
            animationId = requestAnimationFrame(animateWave);
        };

        animationId = requestAnimationFrame(animateWave);
        return () => cancelAnimationFrame(animationId);
    }, []);

    // Calculate wave Y position - perfectly synced with progress
    // When progress is 0%, wave is at bottom (Y=100)
    // When progress is 100%, wave is at top (Y=0)
    const waveY = 100 - progress;

    return (
        <div
            className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#FAFAF8] transition-all ${isVisible ? 'opacity-100' : 'opacity-0 duration-500'
                } ${isZooming ? 'duration-[2500ms] scale-[15]' : 'duration-300 scale-100'}`}
        >
            {/* Text Container */}
            <div
                className={`relative select-none transition-opacity ${isZooming ? 'duration-[2500ms] opacity-0' : 'opacity-100 duration-300'
                    }`}
            >
                <svg
                    width="700"
                    height="120"
                    viewBox="0 0 700 120"
                    className="overflow-visible"
                >
                    <defs>
                        {/* Define text as a clip path */}
                        <clipPath id="text-mask">
                            <text
                                x="350"
                                y="85"
                                textAnchor="middle"
                                fontFamily="system-ui, -apple-system, sans-serif"
                                fontSize="70"
                                fontWeight="bold"
                                letterSpacing="-2"
                            >
                                HARE KRISHNA
                            </text>
                        </clipPath>
                    </defs>

                    {/* Text outline (always visible) - Black for premium feel */}
                    <text
                        x="350"
                        y="85"
                        textAnchor="middle"
                        fontFamily="system-ui, -apple-system, sans-serif"
                        fontSize="70"
                        fontWeight="bold"
                        letterSpacing="-2"
                        fill="none"
                        stroke="rgba(0, 0, 0, 0.15)"
                        strokeWidth="1.5"
                    >
                        HARE KRISHNA
                    </text>

                    {/* Wave fill clipped by text */}
                    <g clipPath="url(#text-mask)">
                        {/* Wave path */}
                        <path
                            d={`
                                M ${-150 - waveOffset} ${waveY}
                                Q ${-75 - waveOffset} ${waveY - 15} ${0 - waveOffset} ${waveY}
                                T ${150 - waveOffset} ${waveY}
                                T ${300 - waveOffset} ${waveY}
                                T ${450 - waveOffset} ${waveY}
                                T ${600 - waveOffset} ${waveY}
                                T ${750 - waveOffset} ${waveY}
                                T ${900 - waveOffset} ${waveY}
                                T ${1050 - waveOffset} ${waveY}
                                V 150
                                H ${-150 - waveOffset}
                                Z
                            `}
                            fill="#D4A74A"
                        />
                    </g>
                </svg>
            </div>

            {/* Progress Indicator - Hidden when at 100% */}
            <div
                className={`mt-12 relative flex flex-col items-center gap-4 transition-opacity duration-300 ${progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
            >
                <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-ghibli-gold/70 to-ghibli-gold transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.4em] text-gray-400 uppercase">
                    <span>Filling Divine Energy</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-700 font-bold">{Math.round(progress)}%</span>
                </div>
            </div>

            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,167,74,0.08)_0%,transparent_70%)] pointer-events-none" />
        </div>
    );
};

export default Loader;
