package com.erp.dto.request;

import lombok.Data;

@Data
public class FeesRequest {
    private Long feeId;
    private Double amount;
    private String paymentMode;
    private String transactionId;
}