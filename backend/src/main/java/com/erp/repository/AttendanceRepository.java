package com.erp.repository;

import com.erp.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    List<Attendance> findByStudentId(Long studentId);
    
    List<Attendance> findBySubjectId(Long subjectId);
    
    List<Attendance> findByDate(LocalDate date);
    
    @Query("SELECT a FROM Attendance a WHERE a.date BETWEEN :startDate AND :endDate")
    List<Attendance> findByDateBetween(@Param("startDate") LocalDate startDate, 
                                       @Param("endDate") LocalDate endDate);
    
    @Query("SELECT a FROM Attendance a WHERE a.date BETWEEN :startDate AND :endDate AND a.subject.course.id = :courseId")
    List<Attendance> findByDateRangeAndCourse(@Param("startDate") LocalDate startDate, 
                                              @Param("endDate") LocalDate endDate, 
                                              @Param("courseId") Long courseId);
    
    @Query("SELECT a FROM Attendance a WHERE a.teacher.id = :teacherId AND YEAR(a.date) = :year")
    List<Attendance> findByTeacherIdAndYear(@Param("teacherId") Long teacherId, 
                                            @Param("year") Integer year);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.status = 'PRESENT'")
    Long countPresentByStudent(@Param("studentId") Long studentId);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId")
    Long countTotalByStudent(@Param("studentId") Long studentId);
}
