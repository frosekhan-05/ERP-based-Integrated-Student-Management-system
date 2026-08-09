package com.erp.fees.dto;

import com.erp.fees.Fees;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentFeesSummaryResponse {
    private Double totalFees;
    private Double paidAmount;
    private Double dueAmount;
    private List<Fees> history;
}
