import { motion, AnimatePresence } from 'framer-motion';
import { slideInRight } from '../../animation/variants';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

const icons = {
  success: <CheckCircle className="text-success" size={20} />,
  error: <AlertCircle className="text-danger" size={20} />,
  info: <Info className="text-info" size={20} />
};

export const Toast = ({ isVisible, message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible && duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={slideInRight}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 p-4 min-w-[300px]"
        >
          {icons[type]}
          <p className="flex-1 text-sm font-medium">{message}</p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
