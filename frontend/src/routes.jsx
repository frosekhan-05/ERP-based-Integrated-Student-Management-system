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
import { AdminTeachers } from './features/admin/AdminTeachers';
import { AdminCourses } from './features/courses/AdminCourses';
import { AdminSettings } from './features/admin/AdminSettings';
import { StudentDashboard } from './features/dashboard/StudentDashboard';
import { StudentAttendance } from './features/attendance/StudentAttendance';
import { StudentTimetable } from './features/timetable/StudentTimetable';
import { StudentMarks } from './features/marks/StudentMarks';
import { StudentFees } from './features/fees/StudentFees';
import { TeacherDashboard } from './features/dashboard/TeacherDashboard';
import { TeacherAttendance } from './features/attendance/TeacherAttendance';
import { TeacherTimetable } from './features/timetable/TeacherTimetable';
import { TeacherMarks } from './features/marks/TeacherMarks';
import NotFoundPage from './pages/NotFoundPage';

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
            { path: 'teachers', element: <AdminTeachers /> },
            { path: 'courses', element: <AdminCourses /> },
            { path: 'settings', element: <AdminSettings /> },
        ],
    },
    {
        path: '/teacher',
        element: <TeacherLayout />,
        children: [
            { path: 'dashboard', element: <TeacherDashboard /> },
            { path: 'attendance', element: <TeacherAttendance /> },
            { path: 'timetable', element: <TeacherTimetable /> },
            { path: 'marks', element: <TeacherMarks /> },
        ],
    },
    {
        path: '/student',
        element: <StudentLayout />,
        children: [
            { path: 'dashboard', element: <StudentDashboard /> },
            { path: 'attendance', element: <StudentAttendance /> }, // This route exists
            { path: 'timetable', element: <StudentTimetable /> },
            { path: 'marks', element: <StudentMarks /> },
            { path: 'fees', element: <StudentFees /> },
        ],
    },
    // IMPORTANT: 404 route MUST be last
    {
        path: '*',
        element: <NotFoundPage />,
    }
]);
