package com.erp.course.dto;


import com.erp.course.Course;
import com.erp.course.Subject;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubjectRequest {
    
    @NotBlank(message = "Subject name is required")
    private String subjectName;
    
    @NotBlank(message = "Subject code is required")
    private String subjectCode;
    
    @NotNull(message = "Course ID is required")
    private Long courseId;
    
    @NotNull(message = "Semester is required")
    private Integer semester;
    
    private Integer credits;
    private String description;
    private String syllabus;
    private Integer totalClasses;
    private Integer practicalHours;
    private Integer theoryHours;
    private Boolean isElective = false;
    private String prerequisite;
    private Long teacherId;
}
