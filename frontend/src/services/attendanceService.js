import api from './api';

const attendanceService = {
    // Get attendance by date
    getAttendanceByDate: async (date) => {
        const response = await api.get(`/attendance/date/${date}`);
        return response.data;
    },

    // Get attendance by student
    getAttendanceByStudent: async (studentId, date = null) => {
        const url = date ? `/attendance/student/${studentId}?date=${date}` : `/attendance/student/${studentId}`;
        const response = await api.get(url);
        return response.data;
    },

    // Get attendance by subject
    getAttendanceBySubject: async (subjectId) => {
        const response = await api.get(`/attendance/subject/${subjectId}`);
        return response.data;
    },

    // Mark single attendance
    markAttendance: async (attendanceData) => {
        const response = await api.post('/attendance/mark', attendanceData);
        return response.data;
    },

    // Mark self attendance
    markSelfAttendance: async (date) => {
        const response = await api.post('/attendance/student/mark', { date });
        return response.data;
    },

    // Mark bulk attendance
    markBulkAttendance: async (attendanceList) => {
        const response = await api.post('/attendance/bulk', attendanceList);
        return response.data;
    },

    // Update attendance
    updateAttendance: async (id, attendanceData) => {
        const response = await api.put(`/attendance/${id}`, attendanceData);
        return response.data;
    },

    // Get attendance report
    getAttendanceReport: async (studentId, startDate, endDate) => {
        const response = await api.get(`/attendance/report/${studentId}`, {
            params: { startDate, endDate }
        });
        return response.data;
    },

    // Get attendance percentage
    getAttendancePercentage: async (studentId, subjectId) => {
        const response = await api.get(`/attendance/percentage/${studentId}/${subjectId}`);
        return response.data;
    },

    // Get today's attendance
    getTodayAttendance: async () => {
        const response = await api.get('/attendance/today');
        return response.data;
    }
};

export default attendanceService;