package com.erp.repository;

import com.erp.model.Fees;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeesRepository extends JpaRepository<Fees, Long> {
    
    List<Fees> findByStudentId(Long studentId);
    
    @Query("SELECT f FROM Fees f WHERE f.status = 'PENDING' OR f.status = 'OVERDUE'")
    List<Fees> findPendingFees();
    
    @Query("SELECT f FROM Fees f WHERE f.dueDate < CURRENT_DATE AND f.status != 'PAID'")
    List<Fees> findOverdueFees();
    
    @Query("SELECT SUM(f.dueAmount) FROM Fees f WHERE f.student.id = :studentId")
    Double getTotalDueByStudent(@Param("studentId") Long studentId);
    
    @Query("SELECT f FROM Fees f WHERE MONTH(f.paymentDate) = :month AND YEAR(f.paymentDate) = :year " +
           "AND (:courseId IS NULL OR f.student.course.id = :courseId)")
    List<Fees> findByMonthAndYear(@Param("month") Integer month, 
                                   @Param("year") Integer year, 
                                   @Param("courseId") Long courseId);
    
    @Query("SELECT COALESCE(SUM(f.paidAmount), 0) FROM Fees f")
    Double getTotalCollected();
    
    @Query("SELECT COALESCE(SUM(f.dueAmount), 0) FROM Fees f WHERE f.status != 'PAID'")
    Double getTotalPending();
    
    @Query("SELECT COUNT(f) FROM Fees f WHERE f.status = 'PAID'")
    Long countPaidFees();
    
    @Query("SELECT COUNT(f) FROM Fees f WHERE f.status = 'PENDING'")
    Long countPendingFees();
}