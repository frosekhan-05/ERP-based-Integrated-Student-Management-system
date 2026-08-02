package com.erp.service;

import com.erp.dto.request.LoginRequest;
import com.erp.dto.request.RegisterRequest;
import com.erp.dto.response.LoginResponse;
import com.erp.model.Student;
import com.erp.model.User;

public interface UserService {
    LoginResponse authenticate(LoginRequest request);
    User register(User user);
    Student registerStudent(RegisterRequest request);
    User findByUsername(String username);
    User findById(Long id);
    void changePassword(Long userId, String oldPassword, String newPassword);
}
