import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './partials/Sidebar';
import { Topbar } from './partials/Topbar';
import { useAuth } from '../hooks/useAuth';
import { PageTransition } from '../animation/PageTransition';
import { LayoutDashboard, Users, BookOpen, Settings } from 'lucide-react';

const adminLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/admin/students', label: 'Students', icon: <Users size={20} /> },
  { path: '/admin/teachers', label: 'Teachers', icon: <Users size={20} /> },
  { path: '/admin/courses', label: 'Courses', icon: <BookOpen size={20} /> },
  { path: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
];

export const AdminLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null; // Or a full screen skeleton
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar links={adminLinks} />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto p-6">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
};
