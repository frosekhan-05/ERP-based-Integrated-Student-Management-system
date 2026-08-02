export const ROLES = {
    ADMIN: 'ADMIN',
    TEACHER: 'TEACHER',
    STUDENT: 'STUDENT'
};

export const ATTENDANCE_STATUS = {
    PRESENT: 'PRESENT',
    ABSENT: 'ABSENT',
    LATE: 'LATE',
    HOLIDAY: 'HOLIDAY'
};

export const FEE_STATUS = {
    PAID: 'PAID',
    PARTIAL: 'PARTIAL',
    PENDING: 'PENDING',
    OVERDUE: 'OVERDUE'
};

export const PAYMENT_MODE = {
    CASH: 'CASH',
    CARD: 'CARD',
    ONLINE: 'ONLINE',
    CHEQUE: 'CHEQUE'
};

export const EXAM_TYPES = {
    INTERNAL: 'INTERNAL',
    EXTERNAL: 'EXTERNAL',
    SEMESTER: 'SEMESTER',
    PRACTICAL: 'PRACTICAL'
};

export const DAYS = [
    'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'
];

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        CHANGE_PASSWORD: '/auth/change-password',
        FORGOT_PASSWORD: '/auth/forgot-password'
    },
    ADMIN: {
        STUDENTS: '/admin/students',
        TEACHERS: '/admin/teachers',
        COURSES: '/admin/courses',
        SUBJECTS: '/admin/subjects',
        TIMETABLE: '/admin/timetable',
        REPORTS: '/admin/reports',
        DASHBOARD: '/admin/dashboard/stats'
    },
    STUDENT: {
        PROFILE: '/student/profile',
        ATTENDANCE: '/student/attendance',
        MARKS: '/student/marks',
        FEES: '/student/fees',
        TIMETABLE: '/student/timetable',
        RESULTS: '/student/results'
    },
    TEACHER: {
        DASHBOARD: '/teacher/dashboard',
        SUBJECTS: '/teacher/subjects',
        STUDENTS: '/teacher/students',
        ATTENDANCE: '/teacher/attendance',
        MARKS: '/teacher/marks',
        ASSIGNMENTS: '/teacher/assignments',
        ANNOUNCEMENTS: '/teacher/announcements'
    }
};