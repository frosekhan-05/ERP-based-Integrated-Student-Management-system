package com.erp.marks.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MarksResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long subjectId;
    private String subjectName;
    private String examName;
    private Double marksObtained;
    private Integer maxMarks;
    private Double percentage;
    private String grade;
    private Double gpa;
    private String result;
    private LocalDateTime uploadedAt;
    private String remarks;
}
