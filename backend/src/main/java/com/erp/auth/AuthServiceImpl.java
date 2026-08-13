package com.erp.auth;

import com.erp.auth.dto.RegisterRequest;

import com.erp.student.Student;
import com.erp.student.StudentRepository;

import com.erp.teacher.Teacher;
import com.erp.teacher.TeacherRepository;

import com.erp.auth.dto.LoginRequest;
import com.erp.auth.dto.LoginResponse;
import com.erp.security.JwtUtils;
import com.erp.common.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public LoginResponse authenticate(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(),
                loginRequest.getPassword()
            )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        User user = userRepository.findByUsername(loginRequest.getUsername())
            .orElseThrow(() -> new UnauthorizedException("User not found"));
        
        LoginResponse response = new LoginResponse();
        response.setToken(jwt);
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());

        if (user.getRole() == User.Role.STUDENT) {
            String studentId = studentRepository.findByUsername(user.getUsername())
                .map(Student::getStudentId)
                .orElse(null);
            response.setStudentId(studentId);
        }

        if (user.getRole() == User.Role.TEACHER) {
            response.setTeacherId(generateTeacherId(user.getId()));
        }
        
        return response;
    }
    
    @Override
    public User register(User user) {
        validateUniqueCredentials(user.getUsername(), user.getEmail());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public Student registerStudent(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        validateUniqueCredentials(request.getUsername(), request.getEmail());

        Student student = new Student();
        student.setFirstName(request.getFirstName().trim());
        student.setLastName(request.getLastName().trim());
        student.setEmail(request.getEmail().trim().toLowerCase());
        student.setPhoneNumber(request.getPhoneNumber());
        student.setUsername(request.getUsername().trim());
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        student.setRole(User.Role.STUDENT);
        student.setActive(true);
        student.setStudentId(generateStudentId());
        student.setRollNo(student.getStudentId());
        student.setEnrollmentDate(LocalDate.now());

        return studentRepository.save(student);
    }

    @Override
    public Teacher registerTeacher(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        validateUniqueCredentials(request.getUsername(), request.getEmail());

        Teacher teacher = new Teacher();
        teacher.setFirstName(request.getFirstName().trim());
        teacher.setLastName(request.getLastName().trim());
        teacher.setEmail(request.getEmail().trim().toLowerCase());
        teacher.setPhoneNumber(request.getPhoneNumber());
        teacher.setUsername(request.getUsername().trim());
        teacher.setPassword(passwordEncoder.encode(request.getPassword()));
        teacher.setRole(User.Role.TEACHER);
        teacher.setActive(true);
        teacher.setJoinDate(LocalDate.now());

        return teacherRepository.save(teacher);
    }
    
    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    @Override
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    @Override
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = findById(userId);
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private void validateUniqueCredentials(String username, String email) {
        if (username != null && userRepository.existsByUsername(username.trim())) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (email != null && userRepository.existsByEmail(email.trim().toLowerCase())) {
            throw new IllegalArgumentException("Email already exists");
        }
    }

    private String generateStudentId() {
        String studentId;

        do {
            studentId = "STU" + UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 8)
                .toUpperCase();
        } while (studentRepository.findByStudentId(studentId).isPresent());

        return studentId;
    }

    private String generateTeacherId(Long userId) {
        if (userId == null) {
            return null;
        }

        return String.format("TCH%06d", userId);
    }
}
