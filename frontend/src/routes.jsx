import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from './layouts/AuthLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { TeacherLayout } from './layouts/TeacherLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { EmptyState } from './components/ui/EmptyState';
import { Button } from './components/ui/Button';

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
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Placeholder title="Login" /> },
      { path: 'register', element: <Placeholder title="Register" /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <Placeholder title="Admin Dashboard" /> },
      { path: 'students', element: <Placeholder title="Manage Students" /> },
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
      { path: 'dashboard', element: <Placeholder title="Student Dashboard" /> },
      { path: 'attendance', element: <Placeholder title="My Attendance" /> },
      { path: 'timetable', element: <Placeholder title="My Timetable" /> },
      { path: 'marks', element: <Placeholder title="My Marks" /> },
      { path: 'fees', element: <Placeholder title="Fee Payment" /> },
    ],
  },
  {
    path: '*',
    element: (
      <div className="flex h-screen items-center justify-center">
        <EmptyState title="404 - Not Found" description="The page you are looking for does not exist." action={<Button onClick={() => window.history.back()}>Go Back</Button>} />
      </div>
    ),
  }
]);
