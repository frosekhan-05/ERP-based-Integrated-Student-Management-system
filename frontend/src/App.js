import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';

// Pages
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import StudentManagement from './components/admin/StudentManagement';
import TeacherManagement from './components/admin/TeacherManagement';
import CourseManagement from './components/admin/CourseManagement';
import SubjectManagement from './components/admin/SubjectManagement';
import TimetableManagement from './components/admin/TimetableManagement';
import Reports from './components/admin/Reports';
import AdminAnnouncements from './components/admin/Announcements';

// Student Components
import StudentDashboard from './components/student/StudentDashboard';
import StudentProfile from './components/student/StudentProfile';
import ViewAttendance from './components/student/ViewAttendance';
import ViewMarks from './components/student/ViewMarks';
import ViewTimetable from './components/student/ViewTimetable';
import FeePayment from './components/student/FeePayment';
import DownloadResults from './components/student/DownloadResults';
import StudentAnnouncements from './components/student/Announcements';

// Teacher Components
import TeacherDashboard from './components/teacher/TeacherDashboard';
import MarkAttendance from './components/teacher/MarkAttendance';
import UploadMarks from './components/teacher/UploadMarks';
import StudentList from './components/teacher/StudentList';
import UploadAssignments from './components/teacher/UploadAssignments';
import Announcements from './components/teacher/Announcements';

import './App.css';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
          
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <PrivateRoute role="ADMIN">
            <AdminDashboard />
          </PrivateRoute>
        } />
        <Route path="/admin/students" element={
          <PrivateRoute role="ADMIN">
            <StudentManagement />
          </PrivateRoute>
        } />
        <Route path="/admin/teachers" element={
          <PrivateRoute role="ADMIN">
            <TeacherManagement />
          </PrivateRoute>
        } />
        <Route path="/admin/courses" element={
          <PrivateRoute role="ADMIN">
            <CourseManagement />
          </PrivateRoute>
        } />
        <Route path="/admin/subjects" element={
          <PrivateRoute role="ADMIN">
            <SubjectManagement />
          </PrivateRoute>
        } />
        <Route path="/admin/timetable" element={
          <PrivateRoute role="ADMIN">
            <TimetableManagement />
          </PrivateRoute>
        } />
        <Route path="/admin/reports" element={
          <PrivateRoute role="ADMIN">
            <Reports />
          </PrivateRoute>
        } />
        <Route path="/admin/announcements" element={
          <PrivateRoute role="ADMIN">
            <AdminAnnouncements />
          </PrivateRoute>
        } />
        
        {/* Student Routes */}
        <Route path="/student" element={
          <PrivateRoute role="STUDENT">
            <StudentDashboard />
          </PrivateRoute>
        } />
        <Route path="/student/profile" element={
          <PrivateRoute role="STUDENT">
            <StudentProfile />
          </PrivateRoute>
        } />
        <Route path="/student/attendance" element={
          <PrivateRoute role="STUDENT">
            <ViewAttendance />
          </PrivateRoute>
        } />
        <Route path="/student/marks" element={
          <PrivateRoute role="STUDENT">
            <ViewMarks />
          </PrivateRoute>
        } />
        <Route path="/student/timetable" element={
          <PrivateRoute role="STUDENT">
            <ViewTimetable />
          </PrivateRoute>
        } />
        <Route path="/student/fees" element={
          <PrivateRoute role="STUDENT">
            <FeePayment />
          </PrivateRoute>
        } />
        <Route path="/student/results" element={
          <PrivateRoute role="STUDENT">
            <DownloadResults />
          </PrivateRoute>
        } />
        <Route path="/student/announcements" element={
          <PrivateRoute role="STUDENT">
            <StudentAnnouncements />
          </PrivateRoute>
        } />
        
        {/* Teacher Routes */}
        <Route path="/teacher" element={
          <PrivateRoute role="TEACHER">
            <TeacherDashboard />
          </PrivateRoute>
        } />
        <Route path="/teacher/attendance" element={
          <PrivateRoute role="TEACHER">
            <MarkAttendance />
          </PrivateRoute>
        } />
        <Route path="/teacher/marks" element={
          <PrivateRoute role="TEACHER">
            <UploadMarks />
          </PrivateRoute>
        } />
        <Route path="/teacher/students" element={
          <PrivateRoute role="TEACHER">
            <StudentList />
          </PrivateRoute>
        } />
        <Route path="/teacher/assignments" element={
          <PrivateRoute role="TEACHER">
            <UploadAssignments />
          </PrivateRoute>
        } />
        <Route path="/teacher/announcements" element={
          <PrivateRoute role="TEACHER">
            <Announcements />
          </PrivateRoute>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="App">
          <ToastContainer position="top-right" autoClose={3000} />
          <AnimatedRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
