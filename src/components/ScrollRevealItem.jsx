import { motion, useReducedMotion } from 'framer-motion';

const ScrollRevealItem = ({
  children,
  index = 0,
  className = '',
  amount = 0.2,
  delayStep = 0.07,
  duration = 0.9,
  y = 30,
  scale = 0.98,
}) => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={`will-change-transform ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      custom={index}
      variants={{
        hidden: {
          opacity: 0,
          y,
          scale,
          filter: 'blur(8px)',
        },
        visible: (itemIndex) => ({
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          transition: {
            duration,
            delay: Math.min(itemIndex * delayStep, 0.48),
            ease: [0.16, 1, 0.3, 1],
          },
        }),
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollRevealItem;
