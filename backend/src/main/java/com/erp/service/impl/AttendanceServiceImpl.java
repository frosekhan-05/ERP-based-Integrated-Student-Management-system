package com.erp.service.impl;

import com.erp.dto.request.AttendanceRequest;
import com.erp.model.Attendance;
import com.erp.model.Attendance.AttendanceStatus;
import com.erp.model.Student;
import com.erp.model.Subject;
import com.erp.model.Teacher;
import com.erp.repository.AttendanceRepository;
import com.erp.repository.StudentRepository;
import com.erp.repository.SubjectRepository;
import com.erp.repository.TeacherRepository;
import com.erp.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;

    @Override
    public Attendance markAttendance(AttendanceRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
            .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        Subject subject = subjectRepository.findById(request.getSubjectId())
            .orElseThrow(() -> new IllegalArgumentException("Subject not found"));
        Teacher teacher = request.getTeacherId() == null ? null :
            teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new IllegalArgumentException("Teacher not found"));

        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setSubject(subject);
        attendance.setTeacher(teacher);
        attendance.setDate(Optional.ofNullable(request.getDate()).orElse(LocalDate.now()));
        attendance.setStatus(resolveStatus(request.getStatus()));
        attendance.setRemarks(request.getRemarks());
        attendance.setMarkedAt(LocalDateTime.now());

        return attendanceRepository.save(attendance);
    }

    @Override
    public List<Attendance> markBulkAttendance(List<AttendanceRequest> requests) {
        return requests.stream()
            .map(this::markAttendance)
            .collect(Collectors.toList());
    }

    @Override
    public List<Attendance> getAttendanceByStudent(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    @Override
    public Map<String, Object> getAttendanceReport(Long studentId) {
        long present = Optional.ofNullable(attendanceRepository.countPresentByStudent(studentId)).orElse(0L);
        long total = Optional.ofNullable(attendanceRepository.countTotalByStudent(studentId)).orElse(0L);
        double percentage = total == 0 ? 0.0 : (present * 100.0) / total;

        return Map.of(
            "present", present,
            "total", total,
            "percentage", percentage
        );
    }

    @Override
    public Map<String, Object> getClassAttendanceReport(Long teacherId, Long subjectId, String date) {
        LocalDate targetDate = Optional.ofNullable(date)
            .map(LocalDate::parse)
            .orElse(LocalDate.now());

        List<Attendance> records = attendanceRepository.findByDate(targetDate).stream()
            .filter(a -> a.getSubject() != null && a.getSubject().getId().equals(subjectId))
            .filter(a -> a.getTeacher() != null && a.getTeacher().getId().equals(teacherId))
            .toList();

        long present = records.stream()
            .filter(a -> AttendanceStatus.PRESENT.equals(a.getStatus()))
            .count();
        long total = records.size();
        double percentage = total == 0 ? 0.0 : (present * 100.0) / total;

        return Map.of(
            "present", present,
            "total", total,
            "percentage", percentage,
            "records", records
        );
    }

    @Override
    public List<Attendance> getAttendanceBySubject(Long subjectId) {
        return attendanceRepository.findBySubjectId(subjectId);
    }

    @Override
    public List<Attendance> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }

    @Override
    public Attendance updateAttendance(Long id, AttendanceRequest request) {
        Attendance attendance = attendanceRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Attendance not found"));

        if (request.getStudentId() != null) {
            Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
            attendance.setStudent(student);
        }

        if (request.getSubjectId() != null) {
            Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new IllegalArgumentException("Subject not found"));
            attendance.setSubject(subject);
        }

        if (request.getTeacherId() != null) {
            Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new IllegalArgumentException("Teacher not found"));
            attendance.setTeacher(teacher);
        }

        if (request.getDate() != null) {
            attendance.setDate(request.getDate());
        }

        if (request.getStatus() != null) {
            attendance.setStatus(resolveStatus(request.getStatus()));
        }

        attendance.setRemarks(request.getRemarks());
        attendance.setMarkedAt(LocalDateTime.now());

        return attendanceRepository.save(attendance);
    }

    @Override
    public Map<String, Object> getAttendanceReport(Long studentId, LocalDate startDate, LocalDate endDate) {
        List<Attendance> records = attendanceRepository.findByDateBetween(startDate, endDate).stream()
            .filter(a -> a.getStudent() != null && a.getStudent().getId().equals(studentId))
            .toList();

        long present = records.stream()
            .filter(a -> AttendanceStatus.PRESENT.equals(a.getStatus()))
            .count();
        long total = records.size();
        double percentage = total == 0 ? 0.0 : (present * 100.0) / total;

        return Map.of(
            "present", present,
            "total", total,
            "percentage", percentage,
            "records", records
        );
    }

    @Override
    public Double getAttendancePercentage(Long studentId, Long subjectId) {
        List<Attendance> records = attendanceRepository.findByStudentId(studentId).stream()
            .filter(a -> a.getSubject() != null && a.getSubject().getId().equals(subjectId))
            .toList();

        long present = records.stream()
            .filter(a -> AttendanceStatus.PRESENT.equals(a.getStatus()))
            .count();
        long total = records.size();
        return total == 0 ? 0.0 : (present * 100.0) / total;
    }

    private AttendanceStatus resolveStatus(String status) {
        if (status == null) {
            return AttendanceStatus.PRESENT;
        }
        try {
            return AttendanceStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException ex) {
            return AttendanceStatus.PRESENT;
        }
    }
}
