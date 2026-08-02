package com.erp.course.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CourseRequest {
    @NotBlank
    @JsonAlias("code")
    private String courseCode;

    @NotBlank
    @JsonAlias("name")
    private String courseName;

    private String duration;

    private Double totalFees;

    @JsonAlias("department")
    private String description;
}
