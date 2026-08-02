import api from './api';

const teacherService = {
    // Dashboard
    getDashboard: async () => {
        const response = await api.get('/teacher/dashboard');
        return response.data.data;
    },
    
    // Subjects
    getSubjects: async () => {
        const response = await api.get('/teacher/subjects');
        return response.data.data;
    },
    
    // Students
    getStudents: async () => {
        const response = await api.get('/teacher/students');
        return response.data.data;
    },
    
    // Attendance
    markAttendance: async (attendanceData) => {
        const response = await api.post('/teacher/attendance/mark', attendanceData);
        return response.data;
    },
    
    markBulkAttendance: async (attendanceList) => {
        const response = await api.post('/teacher/attendance/bulk', attendanceList);
        return response.data;
    },
    
    getAttendanceReport: async (subjectId, date) => {
        const response = await api.get(`/teacher/attendance/report?subjectId=${subjectId}&date=${date}`);
        return response.data.data;
    },
    
    // Marks
    uploadMarks: async (marksData) => {
        const response = await api.post('/teacher/marks/upload', marksData);
        return response.data;
    },
    
    uploadBulkMarks: async (marksList) => {
        const response = await api.post('/teacher/marks/bulk', marksList);
        return response.data;
    },
    
    updateMarks: async (id, marksData) => {
        const response = await api.put(`/teacher/marks/${id}`, marksData);
        return response.data;
    },
    
    getStudentMarks: async (studentId) => {
        const response = await api.get(`/teacher/marks/student/${studentId}`);
        return response.data.data;
    },
    
    // Assignments
    uploadAssignment: async (assignmentData) => {
        const response = await api.post('/teacher/assignments', assignmentData);
        return response.data;
    },
    
    getAssignments: async () => {
        const response = await api.get('/teacher/assignments');
        return response.data.data;
    },
    
    // Announcements
    // Announcements
    postAnnouncement: async (announcementData) => {
        const response = await api.post('/announcements', announcementData);
        return response.data;
    },
    
    getAnnouncements: async () => {
        const response = await api.get('/announcements');
        return response.data.data;
    },
    
    updateAnnouncement: async (id, announcementData) => {
        const response = await api.put(`/announcements/${id}`, announcementData);
        return response.data;
    },
    
    deleteAnnouncement: async (id) => {
        const response = await api.delete(`/announcements/${id}`);
        return response.data;
    }
};

export default teacherService;