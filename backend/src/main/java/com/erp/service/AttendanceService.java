package com.erp.service;

import com.erp.dto.request.AttendanceRequest;
import com.erp.model.Attendance;
import java.util.List;
import java.util.Map;

public interface AttendanceService {
    Attendance markAttendance(AttendanceRequest request);
    List<Attendance> markBulkAttendance(List<AttendanceRequest> requests);
    List<Attendance> getAttendanceByStudent(Long studentId);
    List<Attendance> getAttendanceBySubject(Long subjectId);
    List<Attendance> getAttendanceByDate(java.time.LocalDate date);
    Attendance updateAttendance(Long id, AttendanceRequest request);
    Map<String, Object> getAttendanceReport(Long studentId);
    Map<String, Object> getAttendanceReport(Long studentId, java.time.LocalDate startDate, java.time.LocalDate endDate);
    Double getAttendancePercentage(Long studentId, Long subjectId);
    Map<String, Object> getClassAttendanceReport(Long teacherId, Long subjectId, String date);
}
