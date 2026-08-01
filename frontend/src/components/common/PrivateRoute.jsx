import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = ({ children, role }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (role && user?.role !== role) {
        // Redirect to appropriate dashboard based on role
        if (user?.role === 'ADMIN') return <Navigate to="/admin" />;
        if (user?.role === 'TEACHER') return <Navigate to="/teacher" />;
        if (user?.role === 'STUDENT') return <Navigate to="/student" />;
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default PrivateRoute;