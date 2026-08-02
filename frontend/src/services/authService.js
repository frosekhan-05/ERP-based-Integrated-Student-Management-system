import api from './api';
import { jwtDecode } from 'jwt-decode';

export const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
};

export const logout = async () => {
    try {
        await api.post('/auth/logout');
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        const decoded = jwtDecode(token);
        return decoded;
    } catch (error) {
        return null;
    }
};

export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const changePassword = async (oldPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
        oldPassword,
        newPassword
    });
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

const authService = {
    login,
    logout,
    getCurrentUser,
    register,
    changePassword,
    forgotPassword
};

export default authService;
