import { useState, useEffect, useRef } from 'react';

const FireflyCursor = () => {
    const [fireflies, setFireflies] = useState([]);
    const mousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
            // Update global CSS variables for the Torch Effect
            document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Initial fireflies - Less count, bigger size, "Medium" feel
        const initial = Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 8 + 4, // Medium size (4px to 12px)
            delay: Math.random() * 2,
            speed: Math.random() * 0.04 + 0.01
        }));
        setFireflies(initial);

        const updateFireflies = () => {
            setFireflies(prev => prev.map(f => {
                const dx = mousePos.current.x - f.x;
                const dy = mousePos.current.y - f.y;

                // Tighter attraction for faster following
                const attraction = 0.04;

                return {
                    ...f,
                    x: f.x + dx * attraction + (Math.random() - 0.5) * 3, // More wander
                    y: f.y + dy * attraction + (Math.random() - 0.5) * 3,
                };
            }));
            requestAnimationFrame(updateFireflies);
        };

        const animId = requestAnimationFrame(updateFireflies);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <div className="firefly-wrapper">
            {fireflies.map(f => (
                <div
                    key={f.id}
                    className="firefly animate-twinkle"
                    style={{
                        left: f.x,
                        top: f.y,
                        width: f.size,
                        height: f.size,
                        animationDelay: `${f.delay}s`
                    }}
                />
            ))}
        </div>
    );
};

export default FireflyCursor;
