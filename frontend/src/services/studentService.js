import api from './api';

const studentService = {
    // Profile
    getProfile: async () => {
        const response = await api.get('/student/profile');
        return response.data.data;
    },

    getCourses: async () => {
        const response = await api.get('/student/courses');
        return response.data.data;
    },

    updateProfile: async (profileData) => {
        const response = await api.put('/student/profile', profileData);
        return response.data.data;
    },
    
    // Attendance
    getAttendance: async () => {
        const response = await api.get('/student/attendance');
        return response.data.data;
    },
    
    getAttendancePercentage: async () => {
        const response = await api.get('/student/attendance/percentage');
        return response.data.data;
    },
    
    // Marks
    getMarks: async () => {
        const response = await api.get('/student/marks');
        return response.data.data;
    },
    
    getMarksBySubject: async (subjectId) => {
        const response = await api.get(`/student/marks/subject/${subjectId}`);
        return response.data.data;
    },
    
    // Fees
    getFees: async () => {
        const response = await api.get('/student/fees');
        return response.data.data;
    },
    
    getDueFees: async () => {
        const response = await api.get('/student/fees/due');
        return response.data.data;
    },
    
    payFees: async (paymentData) => {
        const response = await api.post('/student/fees/pay', paymentData);
        return response.data;
    },
    
    // Timetable
    getTimetable: async () => {
        const response = await api.get('/student/timetable');
        return response.data.data;
    },
    
    // Results
    downloadResults: async () => {
        const response = await api.get('/student/results/download', {
            responseType: 'blob'
        });
        return response.data;
    },

    // Announcements
    getAnnouncements: async () => {
        const response = await api.get('/announcements');
        return response.data.data;
    }
};

export default studentService;
