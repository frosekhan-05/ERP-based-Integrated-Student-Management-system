// Mock settings service since backend SettingsController doesn't exist yet
const settingsService = {
    getSettings: async () => {
        return new Promise(resolve => {
            setTimeout(() => {
                const saved = localStorage.getItem('erp_settings');
                if (saved) return resolve({ data: JSON.parse(saved) });
                
                resolve({
                    data: {
                        instituteName: 'Global Institute of Technology',
                        academicYear: '2023-2024',
                        currentSemester: 1,
                        emailNotifications: true,
                        smsNotifications: false,
                        theme: 'system'
                    }
                });
            }, 500);
        });
    },
    updateSettings: async (settingsData) => {
        return new Promise(resolve => {
            setTimeout(() => {
                localStorage.setItem('erp_settings', JSON.stringify(settingsData));
                resolve({ data: settingsData, message: 'Settings updated successfully' });
            }, 500);
        });
    }
};

export default settingsService;
