package com.erp.repository;

import com.erp.model.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MarksRepository extends JpaRepository<Marks, Long> {
    
    List<Marks> findByStudentId(Long studentId);
    
    List<Marks> findBySubjectId(Long subjectId);
    
    @Query("SELECT m FROM Marks m WHERE m.student.id = :studentId AND m.subject.id = :subjectId")
    List<Marks> findByStudentAndSubject(@Param("studentId") Long studentId, 
                                        @Param("subjectId") Long subjectId);
    
    @Query("SELECT m FROM Marks m WHERE m.exam.id = :examId")
    List<Marks> findByExamId(@Param("examId") Long examId);
    
    @Query("SELECT m FROM Marks m WHERE m.exam.id = :examId AND m.subject.course.id = :courseId")
    List<Marks> findByExamIdAndCourseId(@Param("examId") Long examId, 
                                         @Param("courseId") Long courseId);
    
    @Query("SELECT m FROM Marks m WHERE m.subject.course.id = :courseId AND m.subject.semester = :semester")
    List<Marks> findByCourseIdAndSemester(@Param("courseId") Long courseId, 
                                           @Param("semester") Integer semester);
    
    @Query("SELECT m FROM Marks m WHERE m.subject.teacher.id = :teacherId AND YEAR(m.uploadedAt) = :year")
    List<Marks> findByTeacherIdAndYear(@Param("teacherId") Long teacherId, 
                                        @Param("year") Integer year);
    
    @Query("SELECT AVG(m.marksObtained) FROM Marks m WHERE m.student.id = :studentId")
    Double getAverageMarksByStudent(@Param("studentId") Long studentId);
    
    @Query("SELECT MAX(m.marksObtained) FROM Marks m WHERE m.exam.id = :examId")
    Double getHighestMarksByExam(@Param("examId") Long examId);
    
    @Query("SELECT MIN(m.marksObtained) FROM Marks m WHERE m.exam.id = :examId")
    Double getLowestMarksByExam(@Param("examId") Long examId);
}
