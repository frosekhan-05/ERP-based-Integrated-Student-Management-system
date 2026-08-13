package com.erp.auth;

import com.erp.auth.dto.LoginRequest;
import com.erp.auth.dto.RegisterRequest;
import com.erp.common.dto.ApiResponse;
import com.erp.auth.dto.LoginResponse;
import com.erp.student.Student;
import com.erp.teacher.Teacher;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.authenticate(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        String role = registerRequest.getRole();
        
        if ("ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Admin registration is not allowed"));
        }
        
        if ("TEACHER".equalsIgnoreCase(role)) {
            Teacher teacher = authService.registerTeacher(registerRequest);
            return ResponseEntity.ok(ApiResponse.success("Registration successful", Map.of(
                "id", teacher.getId(),
                "teacherId", teacher.getTeacherId(),
                "username", teacher.getUsername(),
                "email", teacher.getEmail(),
                "role", teacher.getRole().name()
            )));
        }

        // Default to student
        Student student = authService.registerStudent(registerRequest);
        return ResponseEntity.ok(ApiResponse.success("Registration successful", Map.of(
            "id", student.getId(),
            "studentId", student.getStudentId(),
            "username", student.getUsername(),
            "email", student.getEmail(),
            "role", student.getRole().name()
        )));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
    }
}
