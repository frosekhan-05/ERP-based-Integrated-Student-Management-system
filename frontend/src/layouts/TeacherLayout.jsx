import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './partials/Sidebar';
import { Topbar } from './partials/Topbar';
import { useAuth } from '../hooks/useAuth';
import { PageTransition } from '../animation/PageTransition';
import { LayoutDashboard, Calendar, ClipboardCheck, FileText } from 'lucide-react';

const teacherLinks = [
  { path: '/teacher/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/teacher/attendance', label: 'Attendance', icon: <ClipboardCheck size={20} /> },
  { path: '/teacher/timetable', label: 'Timetable', icon: <Calendar size={20} /> },
  { path: '/teacher/marks', label: 'Marks', icon: <FileText size={20} /> },
];

export const TeacherLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  
  if (!user || user.role?.toUpperCase() !== 'TEACHER') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar links={teacherLinks} />
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
