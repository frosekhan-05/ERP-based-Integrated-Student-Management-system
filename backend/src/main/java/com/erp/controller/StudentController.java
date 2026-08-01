package com.erp.controller;

import com.erp.dto.response.StudentResponse;
import com.erp.dto.response.ApiResponse;
import com.erp.model.Course;
import com.erp.model.Student;
import com.erp.model.Attendance;
import com.erp.model.Marks;
import com.erp.model.Fees;
import com.erp.model.Timetable;
import com.erp.service.StudentService;
import com.erp.service.AttendanceService;
import com.erp.service.CourseService;
import com.erp.service.MarksService;
import com.erp.service.FeesService;
import com.erp.service.ReportGenerator;
import com.erp.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT')")
@RequiredArgsConstructor
public class StudentController {
    
    private final StudentService studentService;
    private final CourseService courseService;
    private final AttendanceService attendanceService;
    private final MarksService marksService;
    private final FeesService feesService;
    private final TimetableService timetableService;
    private final ReportGenerator reportGenerator;
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        Student student = studentService.getStudentByUsername(principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", toStudentResponse(student)));
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> updates, Principal principal) {
        Student student = studentService.updateProfile(principal.getName(), updates);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", toStudentResponse(student)));
    }

    @GetMapping("/courses")
    public ResponseEntity<?> getAvailableCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(ApiResponse.success("Courses retrieved successfully", courses));
    }
    
    @GetMapping("/attendance")
    public ResponseEntity<?> getAttendance(Principal principal) {
        Student student = studentService.getStudentByUsername(principal.getName());
        List<Attendance> attendance = attendanceService.getAttendanceByStudent(student.getId());
        return ResponseEntity.ok(ApiResponse.success("Attendance retrieved successfully", attendance));
    }
    
    @GetMapping("/attendance/percentage")
    public ResponseEntity<?> getAttendancePercentage(Principal principal) {
        Student student = studentService.getStudentByUsername(principal.getName());
        Map<String, Object> report = attendanceService.getAttendanceReport(student.getId());
        return ResponseEntity.ok(ApiResponse.success("Attendance percentage retrieved", report));
    }
    
    @GetMapping("/marks")
    public ResponseEntity<?> getMarks(Principal principal) {
        Student student = studentService.getStudentByUsername(principal.getName());
        List<Marks> marks = marksService.getMarksByStudent(student.getId());
        return ResponseEntity.ok(ApiResponse.success("Marks retrieved successfully", marks));
    }
    
    @GetMapping("/marks/subject/{subjectId}")
    public ResponseEntity<?> getMarksBySubject(@PathVariable Long subjectId, Principal principal) {
        Student student = studentService.getStudentByUsername(principal.getName());
        List<Marks> marks = marksService.getMarksByStudentAndSubject(student.getId(), subjectId);
        return ResponseEntity.ok(ApiResponse.success("Marks retrieved successfully", marks));
    }
    
    @GetMapping("/fees")
    public ResponseEntity<?> getFees(Principal principal) {
        Student student = studentService.getStudentByUsername(principal.getName());
        List<Fees> fees = feesService.getFeesByStudent(student.getId());
        return ResponseEntity.ok(ApiResponse.success("Fees details retrieved successfully", fees));
    }
    
    @GetMapping("/fees/due")
    public ResponseEntity<?> getDueFees(Principal principal) {
        Student student = studentService.getStudentByUsername(principal.getName());
        Double dueAmount = feesService.getTotalDueByStudent(student.getId());
        return ResponseEntity.ok(ApiResponse.success("Due fees retrieved", Map.of("dueAmount", dueAmount)));
    }
    
    @GetMapping("/timetable")
    public ResponseEntity<?> getTimetable(Principal principal) {
        Student student = studentService.getStudentByUsername(principal.getName());
        List<Timetable> timetable = timetableService.getTimetableByCourseAndSemester(
            student.getCourse().getId(), student.getSemester());
        return ResponseEntity.ok(ApiResponse.success("Timetable retrieved successfully", timetable));
    }
    
    @GetMapping("/results/download")
    public ResponseEntity<?> downloadResults(Principal principal) {
        Student student = studentService.getStudentByUsername(principal.getName());
        byte[] report = reportGenerator.generateStudentReport(student.getId());
        return ResponseEntity.ok()
            .header("Content-Disposition", "attachment; filename=results.pdf")
            .body(report);
    }

    private StudentResponse toStudentResponse(Student student) {
        StudentResponse response = new StudentResponse();
        response.setId(student.getId());
        response.setStudentId(student.getStudentId());
        response.setUsername(student.getUsername());
        response.setEmail(student.getEmail());
        response.setFirstName(student.getFirstName());
        response.setLastName(student.getLastName());
        response.setPhoneNumber(student.getPhoneNumber());
        response.setActive(student.getActive());
        response.setRole(student.getRole() == null ? null : student.getRole().name());
        response.setDateOfBirth(student.getDateOfBirth());
        response.setGender(student.getGender());
        response.setAddress(student.getAddress());
        response.setCity(student.getCity());
        response.setState(student.getState());
        response.setPincode(student.getPincode());
        response.setBatch(student.getBatch());
        response.setSemester(student.getSemester());
        response.setEnrollmentDate(student.getEnrollmentDate());
        response.setRollNo(student.getRollNo());
        response.setFatherName(student.getFatherName());
        response.setMotherName(student.getMotherName());
        response.setParentPhone(student.getParentPhone());
        response.setBloodGroup(student.getBloodGroup());

        if (student.getCourse() != null) {
            response.setCourseId(student.getCourse().getId());
            response.setCourseCode(student.getCourse().getCourseCode());
            response.setCourseName(student.getCourse().getCourseName());
        }

        return response;
    }
}
