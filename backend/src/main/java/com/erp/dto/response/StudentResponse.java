package com.erp.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentResponse {
    private Long id;
    private String studentId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Boolean active;
    private String role;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private Long courseId;
    private String courseCode;
    private String courseName;
    private String batch;
    private Integer semester;
    private LocalDate enrollmentDate;
    private String rollNo;
    private String fatherName;
    private String motherName;
    private String parentPhone;
    private String bloodGroup;
}
