import api from './api';

const timetableService = {
    getTimetableByStudent: async (studentId) => {
        const response = await api.get(`/timetable/student/${studentId}`);
        return response.data;
    },
    getTimetableByStudentAndDate: async (studentId, date) => {
        const response = await api.get(`/timetable/student/${studentId}/today?date=${date}`);
        return response.data;
    }
};

export default timetableService;
