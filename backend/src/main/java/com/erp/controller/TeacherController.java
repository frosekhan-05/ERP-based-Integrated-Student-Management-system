package com.erp.controller;

import com.erp.dto.request.AttendanceRequest;
import com.erp.dto.request.MarksRequest;
import com.erp.dto.response.ApiResponse;
import com.erp.model.Attendance;
import com.erp.model.Marks;
import com.erp.model.Student;
import com.erp.model.Subject;
import com.erp.service.TeacherService;
import com.erp.service.AttendanceService;
import com.erp.service.MarksService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher")
@PreAuthorize("hasRole('TEACHER')")
@RequiredArgsConstructor
public class TeacherController {
    
    private final TeacherService teacherService;
    private final AttendanceService attendanceService;
    private final MarksService marksService;
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(Principal principal) {
        Long teacherId = teacherService.getTeacherIdByUsername(principal.getName());
        Map<String, Object> dashboard = teacherService.getDashboardData(teacherId);
        return ResponseEntity.ok(ApiResponse.success("Dashboard data retrieved", dashboard));
    }
    
    @GetMapping("/subjects")
    public ResponseEntity<?> getSubjects(Principal principal) {
        Long teacherId = teacherService.getTeacherIdByUsername(principal.getName());
        List<Subject> subjects = teacherService.getTeacherSubjects(teacherId);
        return ResponseEntity.ok(ApiResponse.success("Subjects retrieved", subjects));
    }
    
    @GetMapping("/students")
    public ResponseEntity<?> getStudents(Principal principal) {
        Long teacherId = teacherService.getTeacherIdByUsername(principal.getName());
        List<Student> students = teacherService.getAssignedStudents(teacherId);
        return ResponseEntity.ok(ApiResponse.success("Students retrieved", students));
    }
    
    @PostMapping("/attendance/mark")
    public ResponseEntity<?> markAttendance(@RequestBody AttendanceRequest request, Principal principal) {
        request.setTeacherId(teacherService.getTeacherIdByUsername(principal.getName()));
        Attendance attendance = attendanceService.markAttendance(request);
        return ResponseEntity.ok(ApiResponse.success("Attendance marked successfully", attendance));
    }
    
    @PostMapping("/attendance/bulk")
    public ResponseEntity<?> markBulkAttendance(@RequestBody List<AttendanceRequest> requests, Principal principal) {
        Long teacherId = teacherService.getTeacherIdByUsername(principal.getName());
        requests.forEach(req -> req.setTeacherId(teacherId));
        List<Attendance> attendances = attendanceService.markBulkAttendance(requests);
        return ResponseEntity.ok(ApiResponse.success("Bulk attendance marked", attendances));
    }
    
    @GetMapping("/attendance/report")
    public ResponseEntity<?> getAttendanceReport(
            @RequestParam Long subjectId,
            @RequestParam String date,
            Principal principal) {
        Long teacherId = teacherService.getTeacherIdByUsername(principal.getName());
        Map<String, Object> report = attendanceService.getClassAttendanceReport(teacherId, subjectId, date);
        return ResponseEntity.ok(ApiResponse.success("Attendance report", report));
    }
    
    @PostMapping("/marks/upload")
    public ResponseEntity<?> uploadMarks(@RequestBody MarksRequest request, Principal principal) {
        Long teacherId = teacherService.getTeacherIdByUsername(principal.getName());
        request.setUploadedBy(teacherId);
        Marks marks = marksService.uploadMarks(request);
        return ResponseEntity.ok(ApiResponse.success("Marks uploaded successfully", marks));
    }
    
    @PostMapping("/marks/bulk")
    public ResponseEntity<?> uploadBulkMarks(@RequestBody List<MarksRequest> requests, Principal principal) {
        Long teacherId = teacherService.getTeacherIdByUsername(principal.getName());
        requests.forEach(req -> req.setUploadedBy(teacherId));
        List<Marks> marksList = marksService.uploadBulkMarks(requests);
        return ResponseEntity.ok(ApiResponse.success("Bulk marks uploaded", marksList));
    }
    
    @PutMapping("/marks/{id}")
    public ResponseEntity<?> updateMarks(@PathVariable Long id, @RequestBody MarksRequest request) {
        Marks marks = marksService.updateMarks(id, request);
        return ResponseEntity.ok(ApiResponse.success("Marks updated successfully", marks));
    }
    
    @GetMapping("/marks/student/{studentId}")
    public ResponseEntity<?> getStudentMarks(@PathVariable Long studentId) {
        List<Marks> marks = marksService.getMarksByStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student marks retrieved", marks));
    }
}
