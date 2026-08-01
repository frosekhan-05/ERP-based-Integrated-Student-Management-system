package com.erp.config;

import com.erp.model.Student;
import com.erp.model.User;
import com.erp.repository.StudentRepository;
import com.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DemoAccountInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Admin and Teacher are plain User entities (no student_id required)
        ensureDemoUser("admin", "admin123", "admin@erp.com", User.Role.ADMIN, "System", "Administrator");
        ensureDemoUser("teacher", "teacher123", "john.doe@erp.com", User.Role.TEACHER, "John", "Doe");

        // Student must be saved as a Student entity (has studentId NOT NULL constraint)
        ensureDemoStudent("student", "student123", "alice.j@student.com", "Alice", "Johnson");
    }

    private void ensureDemoUser(
        String username,
        String password,
        String email,
        User.Role role,
        String firstName,
        String lastName
    ) {
        if (userRepository.findByUsername(username).isEmpty()) {
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(password));
            user.setEmail(email);
            user.setRole(role);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setActive(true);
            userRepository.save(user);
        }
    }

    private void ensureDemoStudent(
        String username,
        String password,
        String email,
        String firstName,
        String lastName
    ) {
        if (userRepository.findByUsername(username).isEmpty()) {
            Student student = new Student();
            student.setUsername(username);
            student.setPassword(passwordEncoder.encode(password));
            student.setEmail(email);
            student.setRole(User.Role.STUDENT);
            student.setFirstName(firstName);
            student.setLastName(lastName);
            student.setActive(true);
            student.setStudentId("STU2024DEMO");
            student.setRollNo("STU2024DEMO");
            student.setEnrollmentDate(LocalDate.now());
            studentRepository.save(student);
        }
    }
}
