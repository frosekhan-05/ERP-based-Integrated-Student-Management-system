import api from './api';

const feesService = {
    getFeesSummaryByStudent: async (studentId) => {
        const response = await api.get(`/fees/student/${studentId}`);
        return response.data;
    }
};

export default feesService;
