import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';
import { fadeUp } from '../../animation/variants';

export const Card = ({ className, children, ...props }) => {
  return (
    <motion.div
      variants={fadeUp}
      className={cn("bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};
