package com.erp.attendance;

import com.erp.attendance.dto.AttendanceRequest;
import com.erp.common.dto.ApiResponse;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    
    private final AttendanceService attendanceService;
    
    @GetMapping("/date/{date}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<?> getAttendanceByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Attendance> attendance = attendanceService.getAttendanceByDate(date);
        return ResponseEntity.ok(ApiResponse.success("Attendance retrieved successfully", attendance));
    }
    
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<?> getAttendanceByStudent(@PathVariable Long studentId) {
        List<Attendance> attendance = attendanceService.getAttendanceByStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Attendance retrieved successfully", attendance));
    }
    
    @GetMapping("/subject/{subjectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<?> getAttendanceBySubject(@PathVariable Long subjectId) {
        List<Attendance> attendance = attendanceService.getAttendanceBySubject(subjectId);
        return ResponseEntity.ok(ApiResponse.success("Attendance retrieved successfully", attendance));
    }
    
    @PostMapping("/mark")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> markAttendance(@Valid @RequestBody AttendanceRequest request) {
        Attendance attendance = attendanceService.markAttendance(request);
        return ResponseEntity.ok(ApiResponse.success("Attendance marked successfully", attendance));
    }
    
    @PostMapping("/bulk")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> markBulkAttendance(@Valid @RequestBody List<AttendanceRequest> requests) {
        List<Attendance> attendances = attendanceService.markBulkAttendance(requests);
        return ResponseEntity.ok(ApiResponse.success("Bulk attendance marked successfully", attendances));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> updateAttendance(@PathVariable Long id, @Valid @RequestBody AttendanceRequest request) {
        Attendance attendance = attendanceService.updateAttendance(id, request);
        return ResponseEntity.ok(ApiResponse.success("Attendance updated successfully", attendance));
    }
    
    @GetMapping("/report/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<?> getAttendanceReport(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Map<String, Object> report = attendanceService.getAttendanceReport(studentId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Attendance report generated", report));
    }
    
    @GetMapping("/percentage/{studentId}/{subjectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<?> getAttendancePercentage(
            @PathVariable Long studentId,
            @PathVariable Long subjectId) {
        Double percentage = attendanceService.getAttendancePercentage(studentId, subjectId);
        return ResponseEntity.ok(ApiResponse.success("Attendance percentage retrieved", 
            Map.of("percentage", percentage)));
    }
    
    @GetMapping("/today")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<?> getTodayAttendance() {
        List<Attendance> attendance = attendanceService.getAttendanceByDate(LocalDate.now());
        return ResponseEntity.ok(ApiResponse.success("Today's attendance retrieved", attendance));
    }
}
