package com.erp.marks;


import com.erp.student.Student;
import com.erp.course.Subject;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "marks")
@Data
public class Marks {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;
    
    @ManyToOne
    @JoinColumn(name = "exam_id")
    private Exam exam;
    
    private Double marksObtained;
    private Integer maxMarks;
    private Double percentage;
    private String grade;
    private Double gpa;
    
    @Enumerated(EnumType.STRING)
    private ResultStatus result;
    
    private LocalDateTime uploadedAt;
    private String remarks;
    
    public enum ResultStatus {
        PASS, FAIL, ABSENT
    }
}