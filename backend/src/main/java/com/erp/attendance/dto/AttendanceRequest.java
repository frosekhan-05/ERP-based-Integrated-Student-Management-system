package com.erp.attendance.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AttendanceRequest {
    private Long studentId;
    private Long subjectId;
    private Long teacherId;
    private LocalDate date;
    private String status;
    private String remarks;
    
    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }
}