package com.erp.attendance;

import com.erp.student.Student;
import com.erp.student.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AttendanceScheduler {

    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;

    @Scheduled(cron = "0 59 23 * * ?")
    public void markAbsencesForToday() {
        LocalDate today = LocalDate.now();
        List<Student> allStudents = studentRepository.findAll();
        for (Student student : allStudents) {
            List<Attendance> records = attendanceRepository.findByStudentId(student.getId()).stream()
                .filter(a -> a.getDate().equals(today))
                .toList();
            
            if (records.isEmpty()) {
                Attendance attendance = new Attendance();
                attendance.setStudent(student);
                attendance.setDate(today);
                attendance.setStatus(Attendance.AttendanceStatus.ABSENT);
                attendance.setRemarks("Auto-marked Absent");
                attendanceRepository.save(attendance);
            }
        }
    }
}
