import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from './layouts/AuthLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { TeacherLayout } from './layouts/TeacherLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { EmptyState } from './components/ui/EmptyState';
import { Button } from './components/ui/Button';
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';
import { AdminDashboard } from './features/dashboard/AdminDashboard';
import { AdminStudents } from './features/admin/AdminStudents';
import { StudentDashboard } from './features/dashboard/StudentDashboard';
import { StudentAttendance } from './features/attendance/StudentAttendance';
import { StudentTimetable } from './features/timetable/StudentTimetable';
import { StudentMarks } from './features/marks/StudentMarks';
import { StudentFees } from './features/fees/StudentFees';
// Temporary placeholder components for routes until we build the features
const Placeholder = ({ title }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">{title}</h1>
    <EmptyState 
      title={`No data for ${title}`} 
      action={<Button>Create New</Button>} 
    />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login /> },
    ],
  },
  {
    path: '/register',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Register /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'students', element: <AdminStudents /> },
      { path: 'teachers', element: <Placeholder title="Manage Teachers" /> },
      { path: 'courses', element: <Placeholder title="Manage Courses" /> },
      { path: 'settings', element: <Placeholder title="Settings" /> },
    ],
  },
  {
    path: '/teacher',
    element: <TeacherLayout />,
    children: [
      { path: 'dashboard', element: <Placeholder title="Teacher Dashboard" /> },
      { path: 'attendance', element: <Placeholder title="Mark Attendance" /> },
      { path: 'timetable', element: <Placeholder title="Timetable" /> },
      { path: 'marks', element: <Placeholder title="Upload Marks" /> },
    ],
  },
  {
    path: '/student',
    element: <StudentLayout />,
    children: [
      { path: 'dashboard', element: <StudentDashboard /> },
      { path: 'attendance', element: <StudentAttendance /> },
      { path: 'timetable', element: <StudentTimetable /> },
      { path: 'marks', element: <StudentMarks /> },
      { path: 'fees', element: <StudentFees /> },
    ],
  },
  {
    path: '*',
    element: (
      <div className="flex h-screen items-center justify-center">
        {console.log("404 ROUTE HIT. Current pathname:", window.location.pathname)}
        <EmptyState title="404 - Not Found" description={`The page you are looking for does not exist. (Path: ${window.location.pathname})`} action={<Button onClick={() => window.location.href = '/'}>Go Home</Button>} />
      </div>
    ),
  }
]);
