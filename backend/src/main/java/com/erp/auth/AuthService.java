package com.erp.auth;

import com.erp.auth.dto.LoginRequest;
import com.erp.auth.dto.RegisterRequest;
import com.erp.auth.dto.LoginResponse;
import com.erp.student.Student;
import com.erp.teacher.Teacher;


public interface AuthService {
    LoginResponse authenticate(LoginRequest request);
    User register(User user);
    Student registerStudent(RegisterRequest request);
    Teacher registerTeacher(RegisterRequest request);
    User findByUsername(String username);
    User findById(Long id);
    void changePassword(Long userId, String oldPassword, String newPassword);
}
