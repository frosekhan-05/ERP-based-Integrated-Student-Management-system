package com.erp.attendance;

import com.erp.attendance.dto.AttendanceRequest;

import java.util.List;
import java.util.Map;

public interface AttendanceService {
    Attendance markAttendance(AttendanceRequest request);
    List<Attendance> markBulkAttendance(List<AttendanceRequest> requests);
    Attendance markSelfAttendance(Long studentId, java.time.LocalDate date);
    List<Attendance> getAttendanceByStudent(Long studentId);
    List<Attendance> getAttendanceByStudentAndDate(Long studentId, java.time.LocalDate date);
    List<Attendance> getAttendanceBySubject(Long subjectId);
    List<Attendance> getAttendanceByDate(java.time.LocalDate date);
    Attendance updateAttendance(Long id, AttendanceRequest request);
    Map<String, Object> getAttendanceReport(Long studentId);
    Map<String, Object> getAttendanceReport(Long studentId, java.time.LocalDate startDate, java.time.LocalDate endDate);
    Double getAttendancePercentage(Long studentId, Long subjectId);
    Map<String, Object> getClassAttendanceReport(Long teacherId, Long subjectId, String date);
}
