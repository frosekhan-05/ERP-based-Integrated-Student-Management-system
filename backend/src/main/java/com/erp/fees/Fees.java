package com.erp.fees;


import com.erp.student.Student;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fees")
@Data
public class Fees {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @Enumerated(EnumType.STRING)
    private FeeType feeType;
    
    private Double totalAmount;
    private Double paidAmount;
    private Double dueAmount;
    private LocalDate dueDate;
    private LocalDate paymentDate;
    
    @Enumerated(EnumType.STRING)
    private PaymentMode paymentMode;
    
    private String transactionId;
    
    @Enumerated(EnumType.STRING)
    private FeeStatus status;
    
    private String receiptNo;
    private String remarks;
    private LocalDateTime createdAt;
    
    public enum FeeType {
        TUITION, HOSTEL, TRANSPORT, LIBRARY, EXAM, OTHER
    }
    
    public enum PaymentMode {
        CASH, CARD, ONLINE, CHEQUE
    }
    
    public enum FeeStatus {
        PAID, PARTIAL, PENDING, OVERDUE
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}