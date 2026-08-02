package com.erp.course;

import com.erp.course.dto.CourseRequest;

import java.util.List;

public interface CourseService {
    Course createCourse(CourseRequest request);
    Course updateCourse(Long id, CourseRequest request);
    void deleteCourse(Long id);
    List<Course> getAllCourses();
    long getCourseCount();
}
