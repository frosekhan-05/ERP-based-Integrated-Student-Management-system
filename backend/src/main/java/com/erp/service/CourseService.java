package com.erp.service;

import com.erp.dto.request.CourseRequest;
import com.erp.model.Course;
import java.util.List;

public interface CourseService {
    Course createCourse(CourseRequest request);
    Course updateCourse(Long id, CourseRequest request);
    void deleteCourse(Long id);
    List<Course> getAllCourses();
    long getCourseCount();
}
