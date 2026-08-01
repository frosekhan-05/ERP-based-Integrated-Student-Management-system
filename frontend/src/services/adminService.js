import api from './api';

const adminService = {
    // Dashboard
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard/stats');
        return response.data.data;
    },
    
    getRecentActivities: async () => {
        const response = await api.get('/admin/activities/recent');
        return response.data.data;
    },
    
    // Student Management
    getAllStudents: async () => {
        const response = await api.get('/admin/students');
        return response.data.data;
    },
    
    getStudentById: async (id) => {
        const response = await api.get(`/admin/students/${id}`);
        return response.data.data;
    },
    
    createStudent: async (studentData) => {
        const response = await api.post('/admin/students', studentData);
        return response.data;
    },
    
    updateStudent: async (id, studentData) => {
        const response = await api.put(`/admin/students/${id}`, studentData);
        return response.data;
    },
    
    deleteStudent: async (id) => {
        const response = await api.delete(`/admin/students/${id}`);
        return response.data;
    },
    
    // Teacher Management
    getAllTeachers: async () => {
        const response = await api.get('/admin/teachers');
        return response.data.data;
    },
    
    createTeacher: async (teacherData) => {
        const response = await api.post('/admin/teachers', teacherData);
        return response.data;
    },
    
    updateTeacher: async (id, teacherData) => {
        const response = await api.put(`/admin/teachers/${id}`, teacherData);
        return response.data;
    },
    
    deleteTeacher: async (id) => {
        const response = await api.delete(`/admin/teachers/${id}`);
        return response.data;
    },
    
    // Course Management
    getAllCourses: async () => {
        const response = await api.get('/admin/courses');
        return response.data.data;
    },
    
    createCourse: async (courseData) => {
        const response = await api.post('/admin/courses', courseData);
        return response.data;
    },
    
    updateCourse: async (id, courseData) => {
        const response = await api.put(`/admin/courses/${id}`, courseData);
        return response.data;
    },
    
    deleteCourse: async (id) => {
        const response = await api.delete(`/admin/courses/${id}`);
        return response.data;
    },
    
    // Subject Management
    getAllSubjects: async () => {
        const response = await api.get('/admin/subjects');
        return response.data.data;
    },
    
    createSubject: async (subjectData) => {
        const response = await api.post('/admin/subjects', subjectData);
        return response.data;
    },
    
    updateSubject: async (id, subjectData) => {
        const response = await api.put(`/admin/subjects/${id}`, subjectData);
        return response.data;
    },
    
    deleteSubject: async (id) => {
        const response = await api.delete(`/admin/subjects/${id}`);
        return response.data;
    },
    
    getSubjectsByCourse: async (courseId) => {
        const response = await api.get(`/admin/subjects/course/${courseId}`);
        return response.data.data;
    },
    
    // Timetable Management
    getTimetable: async () => {
        const response = await api.get('/timetable');
        return response.data.data;
    },
    
    createTimetable: async (timetableData) => {
        const response = await api.post('/timetable', timetableData);
        return response.data;
    },
    
    updateTimetable: async (id, timetableData) => {
        const response = await api.put(`/timetable/${id}`, timetableData);
        return response.data;
    },
    
    deleteTimetable: async (id) => {
        const response = await api.delete(`/timetable/${id}`);
        return response.data;
    },
    
    // Reports
    generateReport: async (reportType, params) => {
        const response = await api.get(`/admin/reports/${reportType}`, { params });
        return response.data;
    },

    // Announcements
    getAnnouncements: async () => {
        const response = await api.get('/announcements');
        return response.data.data;
    },
    
    postAnnouncement: async (announcementData) => {
        const response = await api.post('/announcements', announcementData);
        return response.data;
    },
    
    deleteAnnouncement: async (id) => {
        const response = await api.delete(`/announcements/${id}`);
        return response.data;
    }
};

export default adminService;