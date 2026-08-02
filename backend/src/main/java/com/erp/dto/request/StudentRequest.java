package com.erp.dto.request;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Data
public class StudentRequest {
    @NotBlank
    private String username;
    
    @NotBlank
    private String password;
    
    @Email
    @NotBlank
    private String email;
    
    @NotBlank
    private String firstName;
    
    @NotBlank
    private String lastName;
    
    private String phoneNumber;
    
    // Student specific fields
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private Long courseId;
    private String batch;
    private Integer semester;
    private LocalDate enrollmentDate;
    private String fatherName;
    private String motherName;
    private String parentPhone;
}