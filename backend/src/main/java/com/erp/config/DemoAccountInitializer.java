package com.erp.config;


import com.erp.auth.Role;
import com.erp.teacher.Teacher;
import com.erp.student.Student;
import com.erp.auth.User;
import com.erp.student.StudentRepository;
import com.erp.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.erp.attendance.Attendance;
import com.erp.attendance.Attendance.AttendanceStatus;
import com.erp.attendance.AttendanceRepository;
import com.erp.course.Subject;
import com.erp.course.SubjectRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DemoAccountInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AttendanceRepository attendanceRepository;
    private final SubjectRepository subjectRepository;

    @Override
    public void run(String... args) {
        // Admin and Teacher are plain User entities (no student_id required)
        ensureDemoUser("admin", "admin123", "admin@erp.com", User.Role.ADMIN, "System", "Administrator");
        ensureDemoUser("teacher", "teacher123", "john.doe@erp.com", User.Role.TEACHER, "John", "Doe");

        // Student must be saved as a Student entity (has studentId NOT NULL constraint)
        ensureDemoStudent("student", "student123", "alice.j@student.com", "Alice", "Johnson");

        generateDemoAttendance();
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

    private void generateDemoAttendance() {
        studentRepository.findByUsername("student").ifPresent(student -> {
            List<Attendance> existing = attendanceRepository.findByStudentId(student.getId());
            if (existing.isEmpty()) {
                LocalDate today = LocalDate.now();
                for (int i = 0; i < 30; i++) {
                    LocalDate date = today.minusDays(i);
                    // Skip weekends
                    if (date.getDayOfWeek().getValue() > 5) {
                        continue;
                    }

                    Attendance attendance = new Attendance();
                    attendance.setStudent(student);
                    attendance.setDate(date);
                    attendance.setMarkedAt(LocalDateTime.of(date, java.time.LocalTime.of(8, 30)));
                    
                    // Assign a subject to avoid NOT NULL constraint errors
                    List<Subject> subjects = subjectRepository.findAll();
                    Subject subject;
                    if (subjects.isEmpty()) {
                        subject = new Subject();
                        subject.setSubjectName("General Attendance");
                        subject.setSubjectCode("GEN-ATT-101");
                        subject = subjectRepository.save(subject);
                    } else {
                        subject = subjects.get(0);
                    }
                    attendance.setSubject(subject);
                    
                    // Random status but mostly PRESENT
                    double rand = Math.random();
                    if (rand < 0.8) {
                        attendance.setStatus(AttendanceStatus.PRESENT);
                    } else if (rand < 0.9) {
                        attendance.setStatus(AttendanceStatus.LATE);
                    } else {
                        attendance.setStatus(AttendanceStatus.ABSENT);
                    }
                    
                    attendance.setRemarks("Demo data");
                    attendanceRepository.save(attendance);
                }
            }
        });
    }
}
