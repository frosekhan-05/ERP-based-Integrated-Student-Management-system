package com.erp.service.impl;

import com.erp.dto.request.TeacherRequest;
import com.erp.exception.ResourceNotFoundException;
import com.erp.model.Attendance;
import com.erp.model.Student;
import com.erp.model.Subject;
import com.erp.model.Teacher;
import com.erp.model.User;
import com.erp.repository.AttendanceRepository;
import com.erp.repository.StudentRepository;
import com.erp.repository.SubjectRepository;
import com.erp.repository.TeacherRepository;
import com.erp.repository.UserRepository;
import com.erp.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Teacher createTeacher(TeacherRequest request) {
        validateUniqueCredentials(request.getUsername(), request.getEmail(), null);

        User user = new User();
        applyUserRequest(user, request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.TEACHER);
        user.setActive(true);

        User savedUser = userRepository.save(user);

        Teacher teacher = new Teacher();
        teacher.setId(savedUser.getId());
        teacher.setActive(true);
        applyTeacherRequest(teacher, request);

        return teacherRepository.save(teacher);
    }

    @Override
    public Teacher updateTeacher(Long id, TeacherRequest request) {
        Teacher teacher = getTeacher(id);
        User user = getTeacherUser(teacher);

        validateUniqueCredentials(request.getUsername(), request.getEmail(), user.getId());

        applyUserRequest(user, request);
        if (hasText(request.getPassword())) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        userRepository.save(user);

        applyTeacherRequest(teacher, request);
        if (teacher.getActive() == null) {
            teacher.setActive(true);
        }

        return teacherRepository.save(teacher);
    }

    @Override
    public void deleteTeacher(Long id) {
        Teacher teacher = getTeacher(id);

        List<Subject> assignedSubjects = getTeacherSubjects(id);
        if (!assignedSubjects.isEmpty()) {
            assignedSubjects.forEach(subject -> subject.setTeacher(null));
            subjectRepository.saveAll(assignedSubjects);
        }

        List<Attendance> attendanceRecords = attendanceRepository.findAll().stream()
            .filter(attendance -> attendance.getTeacher() != null && Objects.equals(attendance.getTeacher().getId(), id))
            .toList();
        if (!attendanceRecords.isEmpty()) {
            attendanceRecords.forEach(attendance -> attendance.setTeacher(null));
            attendanceRepository.saveAll(attendanceRecords);
        }

        teacherRepository.delete(teacher);
        userRepository.delete(getTeacherUser(teacher));
    }

    @Override
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll().stream()
            .sorted(Comparator.comparing(Teacher::getFirstName, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER))
                .thenComparing(Teacher::getLastName, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)))
            .toList();
    }

    @Override
    public long getTeacherCount() {
        return teacherRepository.count();
    }

    @Override
    public Long getTeacherIdByUsername(String username) {
        return teacherRepository.findByUsername(normalize(username))
            .map(Teacher::getId)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
    }

    @Override
    public Map<String, Object> getDashboardData(Long teacherId) {
        Teacher teacher = getTeacher(teacherId);
        List<Subject> subjects = getTeacherSubjects(teacherId);
        List<Student> students = getAssignedStudents(teacherId);

        Map<String, Object> dashboard = new LinkedHashMap<>();
        dashboard.put("teacherName", buildTeacherName(teacher));
        dashboard.put("department", teacher.getDepartment());
        dashboard.put("interestedCourse", teacher.getInterestedCourse());
        dashboard.put("totalStudents", students.size());
        dashboard.put("totalSubjects", subjects.size());
        dashboard.put("classesToday", 0);
        dashboard.put("totalAssignments", 0);
        dashboard.put("todaySchedule", List.of());
        dashboard.put("pendingTasks", List.of());

        return dashboard;
    }

    @Override
    public List<Subject> getTeacherSubjects(Long teacherId) {
        return subjectRepository.findAll().stream()
            .filter(subject -> subject.getTeacher() != null && Objects.equals(subject.getTeacher().getId(), teacherId))
            .toList();
    }

    @Override
    public List<Student> getAssignedStudents(Long teacherId) {
        Set<Long> courseIds = getTeacherSubjects(teacherId).stream()
            .map(Subject::getCourse)
            .filter(Objects::nonNull)
            .map(subjectCourse -> subjectCourse.getId())
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());

        if (courseIds.isEmpty()) {
            return List.of();
        }

        return studentRepository.findAll().stream()
            .filter(student -> student.getCourse() != null && courseIds.contains(student.getCourse().getId()))
            .toList();
    }

    private Teacher getTeacher(Long id) {
        return teacherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
    }

    private User getTeacherUser(Teacher teacher) {
        if (teacher.getId() != null) {
            return userRepository.findById(teacher.getId())
                .or(() -> userRepository.findByUsername(teacher.getUsername()))
                .orElseThrow(() -> new ResourceNotFoundException("Teacher user not found"));
        }

        return userRepository.findByUsername(teacher.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("Teacher user not found"));
    }

    private void applyUserRequest(User user, TeacherRequest request) {
        user.setUsername(normalize(request.getUsername()));
        user.setEmail(normalizeEmail(request.getEmail()));
        user.setFirstName(normalize(request.getFirstName()));
        user.setLastName(normalize(request.getLastName()));
    }

    private void applyTeacherRequest(Teacher teacher, TeacherRequest request) {
        teacher.setUsername(normalize(request.getUsername()));
        teacher.setEmail(normalizeEmail(request.getEmail()));
        teacher.setFirstName(normalize(request.getFirstName()));
        teacher.setLastName(normalize(request.getLastName()));
        teacher.setDepartment(normalize(request.getDepartment()));
        teacher.setInterestedCourse(normalize(request.getInterestedCourse()));
    }

    private void validateUniqueCredentials(String username, String email, Long currentTeacherId) {
        if (hasText(username)) {
            userRepository.findByUsername(username.trim())
                .filter(user -> !Objects.equals(user.getId(), currentTeacherId))
                .ifPresent(user -> {
                    throw new IllegalArgumentException("Username already exists");
                });
        }

        if (hasText(email)) {
            userRepository.findByEmail(email.trim().toLowerCase())
                .filter(user -> !Objects.equals(user.getId(), currentTeacherId))
                .ifPresent(user -> {
                    throw new IllegalArgumentException("Email already exists");
                });
        }
    }

    private String buildTeacherName(Teacher teacher) {
        String firstName = normalize(teacher.getFirstName());
        String lastName = normalize(teacher.getLastName());

        if (!hasText(firstName) && !hasText(lastName)) {
            return normalize(teacher.getUsername());
        }

        return Stream.of(firstName, lastName)
            .filter(this::hasText)
            .collect(Collectors.joining(" "));
    }

    private String normalize(String value) {
        return hasText(value) ? value.trim() : null;
    }

    private String normalizeEmail(String value) {
        return hasText(value) ? value.trim().toLowerCase() : null;
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
