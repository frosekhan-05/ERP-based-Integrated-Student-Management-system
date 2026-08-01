package com.erp.service;

import com.erp.model.Fees;
import com.erp.dto.request.FeesRequest;
import java.util.List;
import java.util.Map;

public interface FeesService {
    List<Fees> getFeesByStudent(Long studentId);
    List<Fees> getPendingFees();
    List<Fees> getOverdueFees();
    Fees collectFee(FeesRequest request);
    Double getTotalDueByStudent(Long studentId);
    byte[] generateReceipt(Long id);
    Map<String, Object> generateFeesReport(Integer month, Integer year);
    Map<String, Object> getCollectionStats();
}