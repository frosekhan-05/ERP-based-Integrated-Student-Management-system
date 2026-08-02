import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner fullPage />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Redirect based on user role
    switch(user.role) {
        case 'ADMIN':
            return <Navigate to="/admin" />;
        case 'TEACHER':
            return <Navigate to="/teacher" />;
        case 'STUDENT':
            return <Navigate to="/student" />;
        default:
            return <Navigate to="/login" />;
    }
};

export default DashboardPage;