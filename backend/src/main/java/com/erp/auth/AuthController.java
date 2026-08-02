package com.erp.auth;

import com.erp.auth.dto.LoginRequest;
import com.erp.auth.dto.RegisterRequest;
import com.erp.common.dto.ApiResponse;
import com.erp.auth.dto.LoginResponse;
import com.erp.student.Student;

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
