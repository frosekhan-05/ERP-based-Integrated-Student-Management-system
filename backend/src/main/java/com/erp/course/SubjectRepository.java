package com.erp.course;


import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    boolean existsBySubjectCode(String subjectCode);
    List<Subject> findByCourseId(Long courseId);
}
