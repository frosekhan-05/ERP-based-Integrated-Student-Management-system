package com.erp.controller;

import com.erp.dto.request.FeesRequest;
import com.erp.dto.response.ApiResponse;
import com.erp.model.Fees;
import com.erp.service.FeesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
public class FeesController {
    
    private final FeesService feesService;
    
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<?> getFeesByStudent(@PathVariable Long studentId) {
        List<Fees> fees = feesService.getFeesByStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Fees retrieved successfully", fees));
    }
    
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPendingFees() {
        List<Fees> pendingFees = feesService.getPendingFees();
        return ResponseEntity.ok(ApiResponse.success("Pending fees retrieved", pendingFees));
    }
    
    @GetMapping("/overdue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getOverdueFees() {
        List<Fees> overdueFees = feesService.getOverdueFees();
        return ResponseEntity.ok(ApiResponse.success("Overdue fees retrieved", overdueFees));
    }
    
    @PostMapping("/collect")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> collectFee(@Valid @RequestBody FeesRequest request) {
        Fees fees = feesService.collectFee(request);
        return ResponseEntity.ok(ApiResponse.success("Fee collected successfully", fees));
    }
    
    @GetMapping("/due/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<?> getDueAmount(@PathVariable Long studentId) {
        Double dueAmount = feesService.getTotalDueByStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Due amount retrieved", 
            Map.of("dueAmount", dueAmount)));
    }
    
    @GetMapping("/receipt/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<?> generateReceipt(@PathVariable Long id) {
        byte[] receipt = feesService.generateReceipt(id);
        return ResponseEntity.ok()
            .header("Content-Type", "application/pdf")
            .header("Content-Disposition", "attachment; filename=receipt_" + id + ".pdf")
            .body(receipt);
    }
    
    @GetMapping("/report")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getFeesReport(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        Map<String, Object> report = feesService.generateFeesReport(month, year);
        return ResponseEntity.ok(ApiResponse.success("Fees report generated", report));
    }
    
    @GetMapping("/collection/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getCollectionStats() {
        Map<String, Object> stats = feesService.getCollectionStats();
        return ResponseEntity.ok(ApiResponse.success("Collection statistics retrieved", stats));
    }
}
