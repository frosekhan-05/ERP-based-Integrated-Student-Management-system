package com.erp.student;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    Optional<Student> findByStudentId(String studentId);
    
    Optional<Student> findByEmail(String email);
    
    Optional<Student> findByUsername(String username);

    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.course WHERE s.username = :username")
    Optional<Student> findProfileByUsername(@Param("username") String username);
    
    List<Student> findByCourseId(Long courseId);
    
    List<Student> findByBatch(String batch);
    
    List<Student> findBySemester(Integer semester);
    
    @Query("SELECT s FROM Student s WHERE s.course.id = :courseId AND s.semester = :semester")
    List<Student> findByCourseIdAndSemester(@Param("courseId") Long courseId, 
                                             @Param("semester") Integer semester);
    
    @Query("SELECT COUNT(s) FROM Student s WHERE s.course.id = :courseId")
    Long countByCourseId(@Param("courseId") Long courseId);
    
    @Query("SELECT s FROM Student s WHERE s.firstName LIKE %:name% OR s.lastName LIKE %:name%")
    List<Student> findByNameContaining(@Param("name") String name);
    
    @Query("SELECT s FROM Student s WHERE s.active = true")
    List<Student> findAllActive();
    
    @Query("SELECT COUNT(s) FROM Student s WHERE s.active = true")
    Long countActiveStudents();
}
