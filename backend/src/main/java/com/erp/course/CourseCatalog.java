package com.erp.course;



import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public final class CourseCatalog {
    public static final List<CourseDefinition> DEFAULT_COURSES = List.of(
        new CourseDefinition(
            "Computer Science and Engineering",
            "CSE",
            "4 Years",
            85000.0,
            "B.E. in Computer Science and Engineering"
        ),
        new CourseDefinition(
            "Information Technology",
            "IT",
            "4 Years",
            80000.0,
            "B.Tech in Information Technology"
        ),
        new CourseDefinition(
            "Artificial Intelligence and Machine Learning",
            "AIML",
            "4 Years",
            90000.0,
            "B.Tech in Artificial Intelligence and Machine Learning"
        ),
        new CourseDefinition(
            "Artificial Intelligence and Data Science",
            "AIDS",
            "4 Years",
            90000.0,
            "B.Tech in Artificial Intelligence and Data Science"
        ),
        new CourseDefinition(
            "Electronics and Communication Engineering",
            "ECE",
            "4 Years",
            82000.0,
            "B.E. in Electronics and Communication Engineering"
        ),
        new CourseDefinition(
            "Electrical and Electronics Engineering",
            "EEE",
            "4 Years",
            81000.0,
            "B.E. in Electrical and Electronics Engineering"
        ),
        new CourseDefinition(
            "Biotechnology",
            "BIOTECH",
            "4 Years",
            78000.0,
            "B.Tech in Biotechnology"
        )
    );

    private static final Map<String, Integer> COURSE_ORDER = IntStream.range(0, DEFAULT_COURSES.size())
        .boxed()
        .collect(Collectors.toMap(index -> normalize(DEFAULT_COURSES.get(index).courseCode()), index -> index));

    private CourseCatalog() {
    }

    public static int getDisplayOrder(Course course) {
        if (course == null) {
            return Integer.MAX_VALUE;
        }

        return COURSE_ORDER.getOrDefault(normalize(course.getCourseCode()), Integer.MAX_VALUE);
    }

    public static Optional<CourseDefinition> findDefinition(String courseCode, String courseName) {
        return DEFAULT_COURSES.stream()
            .filter(definition ->
                normalize(definition.courseCode()).equals(normalize(courseCode))
                    || normalize(definition.courseName()).equals(normalize(courseName))
            )
            .findFirst();
    }

    private static String normalize(String value) {
        return value == null ? "" : value.trim().toUpperCase();
    }

    public record CourseDefinition(
        String courseName,
        String courseCode,
        String duration,
        Double totalFees,
        String description
    ) {
    }
}
