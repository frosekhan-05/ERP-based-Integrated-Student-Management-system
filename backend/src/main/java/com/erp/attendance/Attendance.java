package com.erp.attendance;

import com.erp.student.Student;
import com.erp.teacher.Teacher;
import com.erp.course.Subject;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
@Data
public class Attendance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;
    
    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;
    
    @Column(nullable = false)
    private LocalDate date;
    
    @Enumerated(EnumType.STRING)
    private AttendanceStatus status;
    
    private LocalDateTime markedAt;
    private String remarks;
    
    public enum AttendanceStatus {
        PRESENT, ABSENT, LATE, HOLIDAY
    }
}