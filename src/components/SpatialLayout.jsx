import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const SpatialLayout = ({ children }) => {
  const containerRef = useRef(null);

  // Track the scroll progress within this container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // As the user scrolls down, the content slightly scales up to create a "zoom in" effect
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-ghibli-cream">
      {/* Background ambient gradient that shifts as you scroll */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0 mix-blend-multiply"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(216,138,146,0.05) 0%, rgba(253,251,247,0) 70%)',
          scale: useTransform(scrollYProgress, [0, 1], [1, 2]),
        }}
      />
      
      {/* Main content wrapper with the subtle zoom scale */}
      <motion.div 
        style={{ scale }} 
        className="relative z-10 w-full origin-top"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default SpatialLayout;
