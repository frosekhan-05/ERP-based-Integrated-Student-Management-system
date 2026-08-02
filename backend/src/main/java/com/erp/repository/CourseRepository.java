package com.erp.repository;

import com.erp.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCourseCodeIgnoreCase(String courseCode);

    Optional<Course> findByCourseNameIgnoreCase(String courseName);
}
