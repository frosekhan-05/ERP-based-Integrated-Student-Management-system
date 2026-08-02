package com.erp.course;


import com.erp.course.dto.CourseRequest;
import com.erp.common.exception.ResourceNotFoundException;



import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {
    private final CourseRepository courseRepository;

    @Override
    public Course createCourse(CourseRequest request) {
        Course course = new Course();
        applyCourseRequest(course, request);
        return courseRepository.save(course);
    }

    @Override
    public Course updateCourse(Long id, CourseRequest request) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        applyCourseRequest(course, request);
        return courseRepository.save(course);
    }

    @Override
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course not found");
        }

        courseRepository.deleteById(id);
    }

    @Override
    public List<Course> getAllCourses() {
        ensureDefaultCourses();

        return courseRepository.findAll().stream()
            .sorted(Comparator.comparingInt(CourseCatalog::getDisplayOrder)
                .thenComparing(Course::getCourseName, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)))
            .toList();
    }

    @Override
    public long getCourseCount() {
        return courseRepository.count();
    }

    private void applyCourseRequest(Course course, CourseRequest request) {
        course.setCourseName(normalize(request.getCourseName()));
        course.setCourseCode(normalize(request.getCourseCode()));
        course.setDuration(normalize(request.getDuration()));
        course.setTotalFees(request.getTotalFees());
        course.setDescription(normalize(request.getDescription()));
    }

    private void ensureDefaultCourses() {
        for (CourseCatalog.CourseDefinition definition : CourseCatalog.DEFAULT_COURSES) {
            boolean exists = courseRepository.findByCourseCodeIgnoreCase(definition.courseCode()).isPresent()
                || courseRepository.findByCourseNameIgnoreCase(definition.courseName()).isPresent();

            if (exists) {
                continue;
            }

            Course course = new Course();
            course.setCourseName(definition.courseName());
            course.setCourseCode(definition.courseCode());
            course.setDuration(definition.duration());
            course.setTotalFees(definition.totalFees());
            course.setDescription(definition.description());
            courseRepository.save(course);
        }
    }

    private String normalize(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }
}
