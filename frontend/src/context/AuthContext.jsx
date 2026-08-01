import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../services/authService';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const getStoredUser = () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser);
    } catch (error) {
        localStorage.removeItem('user');
        return null;
    }
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getStoredUser);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            const storedUser = getStoredUser();
            if (storedUser) {
                setUser(storedUser);
                setLoading(false);
                return;
            }

            try {
                const decoded = jwtDecode(token);
                setUser({
                    username: decoded.sub
                });
            } catch (error) {
                console.error('Invalid token', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setToken(null);
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await apiLogin(username, password);
            const loginData = response?.data;

            if (!response?.success || !loginData?.token) {
                throw new Error(response?.message || 'Login failed');
            }

            const userData = {
                id: loginData.id,
                username: loginData.username,
                email: loginData.email,
                role: loginData.role,
                firstName: loginData.firstName,
                lastName: loginData.lastName,
                studentId: loginData.studentId || null,
                teacherId: loginData.teacherId || null
            };
            
            localStorage.setItem('token', loginData.token);
            localStorage.setItem('user', JSON.stringify(userData));
            setToken(loginData.token);
            setUser(userData);
            
            toast.success(response.message || 'Login successful!');
            return { success: true, role: userData.role };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return { success: false };
        }
    };

    const logout = () => {
        apiLogout();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        toast.info('Logged out successfully');
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isTeacher: user?.role === 'TEACHER',
        isStudent: user?.role === 'STUDENT',
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
