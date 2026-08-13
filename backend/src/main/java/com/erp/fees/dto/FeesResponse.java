package com.erp.fees.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class FeesResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String feeType;
    private Double totalAmount;
    private Double paidAmount;
    private Double dueAmount;
    private LocalDate dueDate;
    private LocalDate paymentDate;
    private String paymentMode;
    private String transactionId;
    private String status;
    private String receiptNo;
    private String remarks;
    private LocalDateTime createdAt;
}
