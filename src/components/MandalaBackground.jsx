import React from 'react';

const MandalaBackground = ({ className = "", color = "#D4A74A", opacity = 0.1, size }) => {
    return (
        <div
            className={`pointer-events-none absolute z-0 select-none ${className}`}
            style={{
                width: size || undefined,
                height: size || undefined,
                opacity: opacity
            }}
        >
            <svg
                viewBox="0 0 100 100"
                className="w-full h-full animate-[spin_60s_linear_infinite]"
                style={{ fill: 'none', stroke: color, strokeWidth: '0.8' }}
            >
                {/* One Single Inner Ring - Restored (Decorative Intersect) */}
                <circle cx="50" cy="50" r="35" opacity="0.5" />

                {/* Petals Layer 1 - Main Flower */}
                <g>
                    {[...Array(8)].map((_, i) => (
                        <path
                            key={`petal1-${i}`}
                            d="M50 50 Q60 20 50 10 Q40 20 50 50"
                            transform={`rotate(${i * 45} 50 50)`}
                            opacity="1"
                        />
                    ))}
                </g>

                {/* Petals Layer 2 - Interstitial Details */}
                <g opacity="0.7">
                    {[...Array(8)].map((_, i) => (
                        <path
                            key={`petal2-${i}`}
                            d="M50 50 Q55 30 50 25 Q45 30 50 50"
                            transform={`rotate(${i * 45 + 22.5} 50 50)`}
                        />
                    ))}
                </g>

                {/* Center Geometry */}
                <circle cx="50" cy="50" r="15" opacity="0.5" />
                <circle cx="50" cy="50" r="8" />
                <circle cx="50" cy="50" r="2" fill={color} stroke="none" />

                {/* Outer Detail Dots */}
                {[...Array(24)].map((_, i) => (
                    <circle
                        key={`dot-${i}`}
                        cx="50"
                        cy="3.5"
                        r="0.4"
                        fill={color}
                        transform={`rotate(${i * 15} 50 50)`}
                    />
                ))}
            </svg>
        </div>
    );
};

export default MandalaBackground;
