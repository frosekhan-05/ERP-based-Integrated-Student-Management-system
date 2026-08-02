import { motion } from 'framer-motion';
import { fadeUp } from '../../animation/variants';
import { Inbox } from 'lucide-react';

export const EmptyState = ({ 
  title = "No data found", 
  description = "Get started by creating a new record.",
  icon = <Inbox size={48} className="text-gray-300" />,
  action
}) => {
  return (
    <motion.div 
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 min-h-[300px]"
    >
      <div className="mb-4 bg-gray-50 dark:bg-slate-700/50 p-4 rounded-full">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">{description}</p>
      {action && <div>{action}</div>}
    </motion.div>
  );
};
