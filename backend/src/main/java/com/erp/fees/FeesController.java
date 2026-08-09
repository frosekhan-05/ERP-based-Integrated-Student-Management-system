package com.erp.fees;

import com.erp.fees.dto.FeesRequest;
import com.erp.common.dto.ApiResponse;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.erp.auth.UserRepository;
import com.erp.auth.User;
import com.erp.fees.dto.StudentFeesSummaryResponse;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
public class FeesController {
    
    private final FeesService feesService;
    private final UserRepository userRepository;

    private void verifyStudentAccess(Long studentId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT"))) {
            User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new AccessDeniedException("User not found"));
            if (!user.getId().equals(studentId)) {
                throw new AccessDeniedException("You can only access your own data");
            }
        }
    }
    
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<?> getFeesByStudent(@PathVariable Long studentId) {
        verifyStudentAccess(studentId);
        StudentFeesSummaryResponse response = feesService.getFeesSummaryByStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Fees retrieved successfully", response));
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
