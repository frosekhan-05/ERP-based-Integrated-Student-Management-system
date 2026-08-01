package com.erp.controller;

import com.erp.dto.response.ApiResponse;
import com.erp.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class ReportController {
    
    private final ReportService reportService;
    
    @GetMapping("/attendance")
    public ResponseEntity<?> getAttendanceReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long courseId) {
        Map<String, Object> report = reportService.generateAttendanceReport(startDate, endDate, courseId);
        return ResponseEntity.ok(ApiResponse.success("Attendance report generated", report));
    }
    
    @GetMapping("/marks")
    public ResponseEntity<?> getMarksReport(
            @RequestParam Long examId,
            @RequestParam(required = false) Long courseId) {
        Map<String, Object> report = reportService.generateMarksReport(examId, courseId);
        return ResponseEntity.ok(ApiResponse.success("Marks report generated", report));
    }
    
    @GetMapping("/fees")
    public ResponseEntity<?> getFeesReport(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Long courseId) {
        Map<String, Object> report = reportService.generateFeesReport(month, year, courseId);
        return ResponseEntity.ok(ApiResponse.success("Fees report generated", report));
    }
    
    @GetMapping("/student-performance")
    public ResponseEntity<?> getStudentPerformanceReport(
            @RequestParam Long courseId,
            @RequestParam Integer semester) {
        Map<String, Object> report = reportService.generateStudentPerformanceReport(courseId, semester);
        return ResponseEntity.ok(ApiResponse.success("Student performance report generated", report));
    }
    
    @GetMapping("/teacher-performance")
    public ResponseEntity<?> getTeacherPerformanceReport(
            @RequestParam(required = false) Long teacherId,
            @RequestParam(required = false) Integer year) {
        Map<String, Object> report = reportService.generateTeacherPerformanceReport(teacherId, year);
        return ResponseEntity.ok(ApiResponse.success("Teacher performance report generated", report));
    }
    
    @GetMapping("/institution-summary")
    public ResponseEntity<?> getInstitutionSummary() {
        Map<String, Object> summary = reportService.generateInstitutionSummary();
        return ResponseEntity.ok(ApiResponse.success("Institution summary generated", summary));
    }
    
    @GetMapping("/export/{reportType}")
    public ResponseEntity<?> exportReport(
            @PathVariable String reportType,
            @RequestParam String format,
            @RequestParam Map<String, String> params) {
        byte[] report = reportService.exportReport(reportType, format, params);
        String contentType = format.equals("pdf") ? "application/pdf" : "application/vnd.ms-excel";
        return ResponseEntity.ok()
            .header("Content-Type", contentType)
            .header("Content-Disposition", "attachment; filename=" + reportType + "_report." + format)
            .body(report);
    }
}
