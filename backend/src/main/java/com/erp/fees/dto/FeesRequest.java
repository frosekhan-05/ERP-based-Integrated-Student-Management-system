package com.erp.fees.dto;

import lombok.Data;

@Data
public class FeesRequest {
    private Long feeId;
    private Double amount;
    private String paymentMode;
    private String transactionId;
}