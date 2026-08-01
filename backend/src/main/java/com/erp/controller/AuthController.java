package com.erp.controller;

import com.erp.dto.request.LoginRequest;
import com.erp.dto.request.RegisterRequest;
import com.erp.dto.response.ApiResponse;
import com.erp.dto.response.LoginResponse;
import com.erp.model.Student;
import com.erp.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = userService.authenticate(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        Student student = userService.registerStudent(registerRequest);

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
