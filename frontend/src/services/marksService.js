import api from './api';

const marksService = {
    getMarksByStudent: async (studentId) => {
        const response = await api.get(`/marks/student/${studentId}`);
        return response.data;
    },
    getMarksBySubject: async (subjectId) => {
        const response = await api.get(`/marks/subject/${subjectId}`);
        return response.data;
    },
    getMarksByExam: async (examId) => {
        const response = await api.get(`/marks/exam/${examId}`);
        return response.data;
    },
    uploadMarks: async (marksData) => {
        const response = await api.post('/marks/upload', marksData);
        return response.data;
    },
    uploadBulkMarks: async (marksList) => {
        const response = await api.post('/marks/bulk', marksList);
        return response.data;
    },
    updateMarks: async (id, marksData) => {
        const response = await api.put(`/marks/${id}`, marksData);
        return response.data;
    },
    getStudentReport: async (studentId) => {
        const response = await api.get(`/marks/report/student/${studentId}`);
        return response.data;
    },
    getSubjectReport: async (subjectId) => {
        const response = await api.get(`/marks/report/subject/${subjectId}`);
        return response.data;
    },
    getSubjectStatistics: async (subjectId) => {
        const response = await api.get(`/marks/statistics/${subjectId}`);
        return response.data;
    },
    getToppers: async (courseId, semester) => {
        const response = await api.get(`/marks/toppers/${courseId}?semester=${semester}`);
        return response.data;
    }
};

export default marksService;
