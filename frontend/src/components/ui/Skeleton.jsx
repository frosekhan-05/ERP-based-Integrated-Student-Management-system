import { cn } from '../../utils/helpers';
import { motion } from 'framer-motion';

export const Skeleton = ({ className, shape = 'rectangle', ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        repeat: Infinity,
        repeatType: 'mirror',
        duration: 1,
        ease: 'easeInOut'
      }}
      className={cn(
        "bg-gray-200 dark:bg-slate-700",
        shape === 'circle' ? "rounded-full" : "rounded-md",
        className
      )}
      {...props}
    />
  );
};
