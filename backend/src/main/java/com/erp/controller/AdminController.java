package com.erp.controller;

import com.erp.dto.request.CourseRequest;
import com.erp.dto.request.StudentRequest;
import com.erp.dto.request.TeacherRequest;
import com.erp.dto.response.ApiResponse;
import com.erp.model.Course;
import com.erp.model.Student;
import com.erp.model.Teacher;
import com.erp.service.StudentService;
import com.erp.service.TeacherService;
import com.erp.service.CourseService;
import com.erp.service.SubjectService;
import com.erp.model.Subject;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {
    
    private final StudentService studentService;
    private final TeacherService teacherService;
    private final CourseService courseService;
    private final SubjectService subjectService;
    
    // Student Management
    @PostMapping("/students")
    public ResponseEntity<?> createStudent(@Valid @RequestBody StudentRequest request) {
        Student student = studentService.createStudent(request);
        return ResponseEntity.ok(ApiResponse.success("Student created successfully", student));
    }
    
    @PutMapping("/students/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentRequest request) {
        Student student = studentService.updateStudent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", student));
    }
    
    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully", null));
    }
    
    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(ApiResponse.success("Students retrieved successfully", students));
    }
    
    @GetMapping("/students/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success("Student retrieved successfully", student));
    }
    
    // Teacher Management
    @PostMapping("/teachers")
    public ResponseEntity<?> createTeacher(@Valid @RequestBody TeacherRequest request) {
        Teacher teacher = teacherService.createTeacher(request);
        return ResponseEntity.ok(ApiResponse.success("Teacher created successfully", teacher));
    }
    
    @PutMapping("/teachers/{id}")
    public ResponseEntity<?> updateTeacher(@PathVariable Long id, @Valid @RequestBody TeacherRequest request) {
        Teacher teacher = teacherService.updateTeacher(id, request);
        return ResponseEntity.ok(ApiResponse.success("Teacher updated successfully", teacher));
    }
    
    @DeleteMapping("/teachers/{id}")
    public ResponseEntity<?> deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.ok(ApiResponse.success("Teacher deleted successfully", null));
    }
    
    @GetMapping("/teachers")
    public ResponseEntity<?> getAllTeachers() {
        List<Teacher> teachers = teacherService.getAllTeachers();
        return ResponseEntity.ok(ApiResponse.success("Teachers retrieved successfully", teachers));
    }
    
    // Course Management
    @PostMapping("/courses")
    public ResponseEntity<?> createCourse(@Valid @RequestBody CourseRequest request) {
        Course course = courseService.createCourse(request);
        return ResponseEntity.ok(ApiResponse.success("Course created successfully", course));
    }
    
    @PutMapping("/courses/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @Valid @RequestBody CourseRequest request) {
        Course course = courseService.updateCourse(id, request);
        return ResponseEntity.ok(ApiResponse.success("Course updated successfully", course));
    }
    
    @DeleteMapping("/courses/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Course deleted successfully", null));
    }
    
    @GetMapping("/courses")
    public ResponseEntity<?> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(ApiResponse.success("Courses retrieved successfully", courses));
    }
    
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        long studentCount = studentService.getStudentCount();
        long teacherCount = teacherService.getTeacherCount();
        long courseCount = courseService.getCourseCount();
        
        return ResponseEntity.ok(ApiResponse.success("Stats retrieved successfully", 
            Map.of("students", studentCount, "teachers", teacherCount, "courses", courseCount)));
    }
    
    // Subject Management
    @PostMapping("/subjects")
    public ResponseEntity<?> createSubject(@Valid @RequestBody com.erp.dto.request.SubjectRequest request) {
        Subject subject = subjectService.createSubject(request);
        return ResponseEntity.ok(ApiResponse.success("Subject created successfully", subject));
    }
    
    @PutMapping("/subjects/{id}")
    public ResponseEntity<?> updateSubject(@PathVariable Long id, @Valid @RequestBody com.erp.dto.request.SubjectRequest request) {
        Subject subject = subjectService.updateSubject(id, request);
        return ResponseEntity.ok(ApiResponse.success("Subject updated successfully", subject));
    }
    
    @DeleteMapping("/subjects/{id}")
    public ResponseEntity<?> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.ok(ApiResponse.success("Subject deleted successfully", null));
    }
    
    @GetMapping("/subjects")
    public ResponseEntity<?> getAllSubjects() {
        List<Subject> subjects = subjectService.getAllSubjects();
        return ResponseEntity.ok(ApiResponse.success("Subjects retrieved successfully", subjects));
    }
    
    @GetMapping("/subjects/course/{courseId}")
    public ResponseEntity<?> getSubjectsByCourse(@PathVariable Long courseId) {
        List<Subject> subjects = subjectService.getSubjectsByCourse(courseId);
        return ResponseEntity.ok(ApiResponse.success("Subjects retrieved successfully", subjects));
    }
}
