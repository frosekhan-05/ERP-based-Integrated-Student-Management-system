package com.erp.controller;

import com.erp.dto.request.MarksRequest;
import com.erp.dto.response.ApiResponse;
import com.erp.model.Marks;
import com.erp.service.MarksService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/marks")
@RequiredArgsConstructor
public class MarksController {
    
    private final MarksService marksService;
    
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<?> getMarksByStudent(@PathVariable Long studentId) {
        List<Marks> marks = marksService.getMarksByStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Marks retrieved successfully", marks));
    }
    
    @GetMapping("/subject/{subjectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<?> getMarksBySubject(@PathVariable Long subjectId) {
        List<Marks> marks = marksService.getMarksBySubject(subjectId);
        return ResponseEntity.ok(ApiResponse.success("Marks retrieved successfully", marks));
    }
    
    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<?> getMarksByExam(@PathVariable Long examId) {
        List<Marks> marks = marksService.getMarksByExam(examId);
        return ResponseEntity.ok(ApiResponse.success("Marks retrieved successfully", marks));
    }
    
    @PostMapping("/upload")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> uploadMarks(@Valid @RequestBody MarksRequest request) {
        Marks marks = marksService.uploadMarks(request);
        return ResponseEntity.ok(ApiResponse.success("Marks uploaded successfully", marks));
    }
    
    @PostMapping("/bulk")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> uploadBulkMarks(@Valid @RequestBody List<MarksRequest> requests) {
        List<Marks> marksList = marksService.uploadBulkMarks(requests);
        return ResponseEntity.ok(ApiResponse.success("Bulk marks uploaded successfully", marksList));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> updateMarks(@PathVariable Long id, @Valid @RequestBody MarksRequest request) {
        Marks marks = marksService.updateMarks(id, request);
        return ResponseEntity.ok(ApiResponse.success("Marks updated successfully", marks));
    }
    
    @GetMapping("/report/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<?> getStudentReport(@PathVariable Long studentId) {
        Map<String, Object> report = marksService.generateStudentReport(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student report generated", report));
    }
    
    @GetMapping("/report/subject/{subjectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<?> getSubjectReport(@PathVariable Long subjectId) {
        Map<String, Object> report = marksService.generateSubjectReport(subjectId);
        return ResponseEntity.ok(ApiResponse.success("Subject report generated", report));
    }
    
    @GetMapping("/statistics/{subjectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<?> getSubjectStatistics(@PathVariable Long subjectId) {
        Map<String, Object> stats = marksService.getSubjectStatistics(subjectId);
        return ResponseEntity.ok(ApiResponse.success("Subject statistics retrieved", stats));
    }
    
    @GetMapping("/toppers/{courseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getToppers(@PathVariable Long courseId, @RequestParam Integer semester) {
        List<Map<String, Object>> toppers = marksService.getToppers(courseId, semester);
        return ResponseEntity.ok(ApiResponse.success("Toppers list retrieved", toppers));
    }
}
