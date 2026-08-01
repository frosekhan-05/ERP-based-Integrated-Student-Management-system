package com.erp.config;

import com.erp.model.Course;
import com.erp.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CourseCatalogInitializer implements CommandLineRunner {
    private final CourseRepository courseRepository;

    @Override
    public void run(String... args) {
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
}
