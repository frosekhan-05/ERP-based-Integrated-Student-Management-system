package com.erp.dto.response;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AttendanceResponse {
    private Long id;
    private Long studentId;
    private Long subjectId;
    private LocalDate date;
    private String status;
}
