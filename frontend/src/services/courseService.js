import api from './api';

const courseService = {
    // Course Management
    getAllCourses: async () => {
        const response = await api.get('/admin/courses');
        return response.data;
    },
    getCourseById: async (id) => {
        const response = await api.get(`/admin/courses/${id}`);
        return response.data;
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
        return response.data;
    },
    getSubjectsByCourse: async (courseId) => {
        const response = await api.get(`/admin/subjects/course/${courseId}`);
        return response.data;
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
    }
};

export default courseService;
