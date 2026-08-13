package com.erp.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByCourseId(Long courseId);
    
    // ADD THIS METHOD
    @Query("SELECT s FROM Subject s WHERE s.course.id = :courseId AND s.semester = :semester")
    List<Subject> findByCourseIdAndSemester(@Param("courseId") Long courseId, 
                                            @Param("semester") Integer semester);
    
    boolean existsBySubjectCode(String subjectCode);
}
