import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export const AnimatedNumber = ({ value, duration = 1000 }) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const spring = useSpring(0, {
    stiffness: 50,
    damping: 20,
    mass: 1,
  });
  
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
};
