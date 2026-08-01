package com.erp.service.impl;

import com.erp.config.CourseCatalog;
import com.erp.dto.request.StudentRequest;
import com.erp.exception.ResourceNotFoundException;
import com.erp.model.Course;
import com.erp.model.Student;
import com.erp.model.User;
import com.erp.repository.CourseRepository;
import com.erp.repository.StudentRepository;
import com.erp.repository.UserRepository;
import com.erp.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Student createStudent(StudentRequest request) {
        validateUniqueCredentials(request.getUsername(), request.getEmail(), null);

        Student student = new Student();
        applyStudentRequest(student, request, true);
        student.setRole(User.Role.STUDENT);
        student.setActive(true);
        student.setStudentId(generateStudentId());
        student.setRollNo(student.getStudentId());
        if (student.getEnrollmentDate() == null) {
            student.setEnrollmentDate(LocalDate.now());
        }

        return studentRepository.save(student);
    }

    @Override
    public Student updateStudent(Long id, StudentRequest request) {
        Student student = getStudentById(id);
        validateUniqueCredentials(request.getUsername(), request.getEmail(), id);
        applyStudentRequest(student, request, false);
        return studentRepository.save(student);
    }

    @Override
    public void deleteStudent(Long id) {
        Student student = getStudentById(id);
        studentRepository.delete(student);
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
    }

    @Override
    public long getStudentCount() {
        return studentRepository.count();
    }

    @Override
    public Student getStudentByUsername(String username) {
        return studentRepository.findProfileByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
    }

    @Override
    public Student updateProfile(String username, Map<String, Object> updates) {
        Student student = getStudentByUsername(username);

        if (updates.containsKey("firstName")) {
            student.setFirstName(asString(updates.get("firstName")));
        }
        if (updates.containsKey("lastName")) {
            student.setLastName(asString(updates.get("lastName")));
        }
        if (updates.containsKey("phoneNumber")) {
            student.setPhoneNumber(asString(updates.get("phoneNumber")));
        }
        if (updates.containsKey("dateOfBirth")) {
            student.setDateOfBirth(parseLocalDate(updates.get("dateOfBirth"), "dateOfBirth"));
        }
        if (updates.containsKey("gender")) {
            student.setGender(asString(updates.get("gender")));
        }
        if (updates.containsKey("address")) {
            student.setAddress(asString(updates.get("address")));
        }
        if (updates.containsKey("city")) {
            student.setCity(asString(updates.get("city")));
        }
        if (updates.containsKey("state")) {
            student.setState(asString(updates.get("state")));
        }
        if (updates.containsKey("pincode")) {
            student.setPincode(asString(updates.get("pincode")));
        }
        if (updates.containsKey("courseId") || updates.containsKey("courseCode") || updates.containsKey("courseName")) {
            student.setCourse(resolveCourseSelection(updates));
        }
        if (updates.containsKey("batch")) {
            student.setBatch(asString(updates.get("batch")));
        }
        if (updates.containsKey("semester")) {
            student.setSemester(parseInteger(updates.get("semester"), "semester"));
        }
        if (updates.containsKey("enrollmentDate")) {
            student.setEnrollmentDate(parseLocalDate(updates.get("enrollmentDate"), "enrollmentDate"));
        }
        if (updates.containsKey("fatherName")) {
            student.setFatherName(asString(updates.get("fatherName")));
        }
        if (updates.containsKey("motherName")) {
            student.setMotherName(asString(updates.get("motherName")));
        }
        if (updates.containsKey("parentPhone")) {
            student.setParentPhone(asString(updates.get("parentPhone")));
        }
        if (updates.containsKey("bloodGroup")) {
            student.setBloodGroup(asString(updates.get("bloodGroup")));
        }

        if (updates.containsKey("email")) {
            String email = asString(updates.get("email"));
            if (email != null && !email.equalsIgnoreCase(student.getEmail())) {
                validateUniqueCredentials(student.getUsername(), email, student.getId());
                student.setEmail(email.toLowerCase());
            }
        }

        return studentRepository.save(student);
    }

    private void applyStudentRequest(Student student, StudentRequest request, boolean creating) {
        student.setUsername(normalize(request.getUsername()));
        student.setEmail(normalizeEmail(request.getEmail()));
        student.setFirstName(normalize(request.getFirstName()));
        student.setLastName(normalize(request.getLastName()));
        student.setPhoneNumber(normalize(request.getPhoneNumber()));
        student.setDateOfBirth(request.getDateOfBirth());
        student.setGender(normalize(request.getGender()));
        student.setAddress(normalize(request.getAddress()));
        student.setCity(normalize(request.getCity()));
        student.setState(normalize(request.getState()));
        student.setPincode(normalize(request.getPincode()));
        student.setBatch(normalize(request.getBatch()));
        student.setSemester(request.getSemester());
        student.setEnrollmentDate(request.getEnrollmentDate());
        student.setFatherName(normalize(request.getFatherName()));
        student.setMotherName(normalize(request.getMotherName()));
        student.setParentPhone(normalize(request.getParentPhone()));

        if (request.getCourseId() != null) {
            student.setCourse(resolveCourse(request.getCourseId()));
        } else if (creating) {
            student.setCourse(null);
        }

        if (creating || hasText(request.getPassword())) {
            student.setPassword(passwordEncoder.encode(request.getPassword()));
        }
    }

    private Course resolveCourse(Long courseId) {
        return courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
    }

    private Course resolveCourseSelection(Map<String, Object> updates) {
        String courseIdValue = asString(updates.get("courseId"));
        String courseCode = asString(updates.get("courseCode"));
        String courseName = asString(updates.get("courseName"));

        if (!hasText(courseIdValue) && !hasText(courseCode) && !hasText(courseName)) {
            return null;
        }

        if (hasText(courseIdValue) && courseIdValue.chars().allMatch(Character::isDigit)) {
            return resolveCourse(Long.valueOf(courseIdValue));
        }

        String resolvedCode = hasText(courseCode) ? courseCode : courseIdValue;

        return courseRepository.findByCourseCodeIgnoreCase(resolvedCode)
            .or(() -> courseRepository.findByCourseNameIgnoreCase(courseName))
            .orElseGet(() -> createCatalogCourse(resolvedCode, courseName));
    }

    private Course createCatalogCourse(String courseCode, String courseName) {
        return CourseCatalog.findDefinition(courseCode, courseName)
            .map(definition -> {
                Course course = new Course();
                course.setCourseName(definition.courseName());
                course.setCourseCode(definition.courseCode());
                course.setDuration(definition.duration());
                course.setTotalFees(definition.totalFees());
                course.setDescription(definition.description());
                return courseRepository.save(course);
            })
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
    }

    private void validateUniqueCredentials(String username, String email, Long currentStudentId) {
        if (hasText(username)) {
            userRepository.findByUsername(username.trim())
                .filter(user -> !user.getId().equals(currentStudentId))
                .ifPresent(user -> {
                    throw new IllegalArgumentException("Username already exists");
                });
        }

        if (hasText(email)) {
            userRepository.findByEmail(email.trim().toLowerCase())
                .filter(user -> !user.getId().equals(currentStudentId))
                .ifPresent(user -> {
                    throw new IllegalArgumentException("Email already exists");
                });
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

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private String normalize(String value) {
        return hasText(value) ? value.trim() : null;
    }

    private String normalizeEmail(String value) {
        return hasText(value) ? value.trim().toLowerCase() : null;
    }

    private LocalDate parseLocalDate(Object value, String fieldName) {
        String parsedValue = asString(value);

        if (!hasText(parsedValue)) {
            return null;
        }

        try {
            return LocalDate.parse(parsedValue);
        } catch (RuntimeException exception) {
            throw new IllegalArgumentException("Invalid " + fieldName);
        }
    }

    private Integer parseInteger(Object value, String fieldName) {
        String parsedValue = asString(value);

        if (!hasText(parsedValue)) {
            return null;
        }

        try {
            return Integer.valueOf(parsedValue);
        } catch (NumberFormatException exception) {
            throw new IllegalArgumentException("Invalid " + fieldName);
        }
    }

    private Long parseLong(Object value, String fieldName) {
        String parsedValue = asString(value);

        if (!hasText(parsedValue)) {
            return null;
        }

        try {
            return Long.valueOf(parsedValue);
        } catch (NumberFormatException exception) {
            throw new IllegalArgumentException("Invalid " + fieldName);
        }
    }

    private String asString(Object value) {
        return value == null ? null : String.valueOf(value).trim();
    }
}
