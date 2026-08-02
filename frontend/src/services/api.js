import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            if (error.config && error.config.url && !error.config.url.includes('/auth/login')) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                toast.error('Session expired. Please login again.');
            }
        } else if (error.response?.status === 403) {
            toast.error('You do not have permission to perform this action');
        } else if (error.response?.status === 500) {
            toast.error('Server error. Please try again later.');
        }
        return Promise.reject(error);
    }
);

export default api;