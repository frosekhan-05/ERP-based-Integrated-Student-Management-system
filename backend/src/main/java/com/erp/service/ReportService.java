package com.erp.service;

import java.time.LocalDate;
import java.util.Map;

public interface ReportService {
    Map<String, Object> generateAttendanceReport(LocalDate startDate, LocalDate endDate, Long courseId);
    Map<String, Object> generateMarksReport(Long examId, Long courseId);
    Map<String, Object> generateFeesReport(Integer month, Integer year, Long courseId);
    Map<String, Object> generateStudentPerformanceReport(Long courseId, Integer semester);
    Map<String, Object> generateTeacherPerformanceReport(Long teacherId, Integer year);
    Map<String, Object> generateInstitutionSummary();
    byte[] exportReport(String reportType, String format, Map<String, String> params);
}
