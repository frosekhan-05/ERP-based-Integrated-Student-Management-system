import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageTransition } from '../animation/PageTransition';
import { motion } from 'framer-motion';
import { slideInRight } from '../animation/variants';

export const AuthLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  
  // If already logged in, redirect based on role
  if (user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden lg:flex flex-col flex-1 bg-indigo-900 justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-fuchsia-600/20 mix-blend-overlay z-0" />
        <div className="relative z-10 max-w-lg">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold mb-6"
          >
            ERP Student Management System
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-indigo-200 text-lg"
          >
            Manage attendance, timetable, fees, and more from one unified platform.
          </motion.p>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative bg-white">
        <div className="w-full max-w-md">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </div>
    </div>
  );
};
