import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './partials/Sidebar';
import { Topbar } from './partials/Topbar';
import { useAuth } from '../hooks/useAuth';
import { PageTransition } from '../animation/PageTransition';
import { LayoutDashboard, Calendar, ClipboardCheck, FileText, CreditCard } from 'lucide-react';

const studentLinks = [
  { path: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/student/attendance', label: 'My Attendance', icon: <ClipboardCheck size={20} /> },
  { path: '/student/timetable', label: 'My Timetable', icon: <Calendar size={20} /> },
  { path: '/student/marks', label: 'My Marks', icon: <FileText size={20} /> },
  { path: '/student/fees', label: 'Fee Payment', icon: <CreditCard size={20} /> },
];

export const StudentLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  
  if (!user || user.role?.toUpperCase() !== 'STUDENT') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar links={studentLinks} />
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
