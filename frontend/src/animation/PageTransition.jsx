import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { fadeUp } from './variants';

export const PageTransition = ({ children }) => {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};
