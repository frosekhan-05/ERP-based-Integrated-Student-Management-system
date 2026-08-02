import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LayoutDashboard, Users, BookOpen, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = ({ links = [] }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="bg-slate-900 text-white h-screen flex flex-col relative flex-shrink-0"
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-slate-800">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-xl whitespace-nowrap"
            >
              ERP System
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-slate-800 text-white p-1 rounded-full border border-slate-700 hover:bg-slate-700"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <nav className="flex-1 py-4 flex flex-col gap-2 px-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
          
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center p-2 rounded-lg relative transition-colors ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-indigo-600 rounded-lg"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-4 px-2">
                {link.icon}
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap"
                    >
                      {link.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center gap-4 text-slate-400 hover:text-white transition-colors w-full p-2 rounded-lg hover:bg-slate-800"
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};
