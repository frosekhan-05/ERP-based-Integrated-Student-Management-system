package com.erp.service.impl;

import com.erp.model.Fees;
import com.erp.model.Student;
import com.erp.repository.FeesRepository;
import com.erp.repository.StudentRepository;
import com.erp.service.FeesService;
import com.erp.dto.request.FeesRequest;
import com.erp.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class FeesServiceImpl implements FeesService {
    
    private final FeesRepository feesRepository;
    private final StudentRepository studentRepository;
    
    @Override
    public List<Fees> getFeesByStudent(Long studentId) {
        return feesRepository.findByStudentId(studentId);
    }
    
    @Override
    public List<Fees> getPendingFees() {
        return feesRepository.findPendingFees();
    }
    
    @Override
    public List<Fees> getOverdueFees() {
        return feesRepository.findOverdueFees();
    }
    
    @Override
    public Fees collectFee(FeesRequest request) {
        Fees fee = feesRepository.findById(request.getFeeId())
            .orElseThrow(() -> new ResourceNotFoundException("Fee record not found"));
        
        fee.setPaidAmount(fee.getPaidAmount() + request.getAmount());
        fee.setDueAmount(fee.getTotalAmount() - fee.getPaidAmount());
        fee.setPaymentDate(LocalDate.now());
        fee.setPaymentMode(Fees.PaymentMode.valueOf(request.getPaymentMode()));
        fee.setTransactionId(request.getTransactionId());
        fee.setReceiptNo("RCP" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        
        if (fee.getDueAmount() <= 0) {
            fee.setStatus(Fees.FeeStatus.PAID);
        } else if (fee.getPaidAmount() > 0) {
            fee.setStatus(Fees.FeeStatus.PARTIAL);
        }
        
        return feesRepository.save(fee);
    }
    
    @Override
    public Double getTotalDueByStudent(Long studentId) {
        return feesRepository.getTotalDueByStudent(studentId);
    }
    
    @Override
    public byte[] generateReceipt(Long id) {
        Fees fee = feesRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Fee record not found"));
        // Implement receipt generation logic
        return new byte[0];
    }
    
    @Override
    public Map<String, Object> generateFeesReport(Integer month, Integer year) {
        Map<String, Object> report = new HashMap<>();
        List<Fees> fees = feesRepository.findByMonthAndYear(month, year, null);
        
        double totalCollected = fees.stream()
            .mapToDouble(Fees::getPaidAmount)
            .sum();
        
        double totalPending = fees.stream()
            .mapToDouble(Fees::getDueAmount)
            .sum();
        
        long paidCount = fees.stream()
            .filter(f -> f.getStatus() == Fees.FeeStatus.PAID)
            .count();
        
        long pendingCount = fees.stream()
            .filter(f -> f.getStatus() == Fees.FeeStatus.PENDING || f.getStatus() == Fees.FeeStatus.OVERDUE)
            .count();
        
        report.put("totalCollected", totalCollected);
        report.put("totalPending", totalPending);
        report.put("paidCount", paidCount);
        report.put("pendingCount", pendingCount);
        report.put("data", fees);
        
        return report;
    }
    
    @Override
    public Map<String, Object> getCollectionStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCollected", feesRepository.getTotalCollected());
        stats.put("totalPending", feesRepository.getTotalPending());
        stats.put("paidCount", feesRepository.countPaidFees());
        stats.put("pendingCount", feesRepository.countPendingFees());
        return stats;
    }
}