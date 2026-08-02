package com.erp.marks.dto;

import lombok.Data;

@Data
public class MarksRequest {
    private Long studentId;
    private Long subjectId;
    private Long examId;
    private Double marksObtained;
    private Integer maxMarks;
    private String remarks;
    private Long uploadedBy;
    
    public void setUploadedBy(Long uploadedBy) {
        this.uploadedBy = uploadedBy;
    }
}