package com.erp.utils;

public class Constants {
    
    // Roles
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_TEACHER = "TEACHER";
    public static final String ROLE_STUDENT = "STUDENT";
    
    // Attendance Status
    public static final String ATTENDANCE_PRESENT = "PRESENT";
    public static final String ATTENDANCE_ABSENT = "ABSENT";
    public static final String ATTENDANCE_LATE = "LATE";
    public static final String ATTENDANCE_HOLIDAY = "HOLIDAY";
    
    // Exam Types
    public static final String EXAM_INTERNAL = "INTERNAL";
    public static final String EXAM_EXTERNAL = "EXTERNAL";
    public static final String EXAM_SEMESTER = "SEMESTER";
    public static final String EXAM_PRACTICAL = "PRACTICAL";
    
    // Fee Types
    public static final String FEE_TUITION = "TUITION";
    public static final String FEE_HOSTEL = "HOSTEL";
    public static final String FEE_TRANSPORT = "TRANSPORT";
    public static final String FEE_LIBRARY = "LIBRARY";
    public static final String FEE_EXAM = "EXAM";
    public static final String FEE_OTHER = "OTHER";
    
    // Fee Status
    public static final String FEE_PAID = "PAID";
    public static final String FEE_PARTIAL = "PARTIAL";
    public static final String FEE_PENDING = "PENDING";
    public static final String FEE_OVERDUE = "OVERDUE";
    
    // Payment Modes
    public static final String PAYMENT_CASH = "CASH";
    public static final String PAYMENT_CARD = "CARD";
    public static final String PAYMENT_ONLINE = "ONLINE";
    public static final String PAYMENT_CHEQUE = "CHEQUE";
    
    // Days
    public static final String[] DAYS = {
        "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"
    };
    
    // Result Status
    public static final String RESULT_PASS = "PASS";
    public static final String RESULT_FAIL = "FAIL";
    public static final String RESULT_ABSENT = "ABSENT";
    
    // Grades
    public static final String GRADE_A_PLUS = "A+";
    public static final String GRADE_A = "A";
    public static final String GRADE_B_PLUS = "B+";
    public static final String GRADE_B = "B";
    public static final String GRADE_C_PLUS = "C+";
    public static final String GRADE_C = "C";
    public static final String GRADE_D = "D";
    public static final String GRADE_F = "F";
    
    // Grade thresholds
    public static final double THRESHOLD_A_PLUS = 90.0;
    public static final double THRESHOLD_A = 80.0;
    public static final double THRESHOLD_B_PLUS = 70.0;
    public static final double THRESHOLD_B = 60.0;
    public static final double THRESHOLD_C_PLUS = 50.0;
    public static final double THRESHOLD_C = 40.0;
    public static final double THRESHOLD_D = 35.0;
    
    // File paths
    public static final String UPLOAD_DIR = "uploads/";
    public static final String REPORT_DIR = "reports/";
    
    // Pagination
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final int MAX_PAGE_SIZE = 100;
    
    // Cache keys
    public static final String CACHE_STUDENTS = "students";
    public static final String CACHE_TEACHERS = "teachers";
    public static final String CACHE_COURSES = "courses";
    public static final String CACHE_SUBJECTS = "subjects";
    
    // API endpoints
    public static final String API_BASE = "/api";
    public static final String API_AUTH = API_BASE + "/auth";
    public static final String API_ADMIN = API_BASE + "/admin";
    public static final String API_STUDENT = API_BASE + "/student";
    public static final String API_TEACHER = API_BASE + "/teacher";
    public static final String API_ATTENDANCE = API_BASE + "/attendance";
    public static final String API_MARKS = API_BASE + "/marks";
    public static final String API_FEES = API_BASE + "/fees";
    public static final String API_REPORTS = API_BASE + "/reports";
}
