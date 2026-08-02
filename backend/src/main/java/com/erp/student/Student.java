package com.erp.student;


import com.erp.auth.User;
import com.erp.course.Course;
import com.erp.attendance.Attendance;
import com.erp.marks.Marks;
import com.erp.fees.Fees;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "students")
@PrimaryKeyJoinColumn(name = "user_id")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student extends User {
    
    @Column(unique = true, nullable = false)
    private String studentId;
    
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String city;
    private String state;
    private String pincode;
    
    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
    
    private String batch;
    private Integer semester;
    private LocalDate enrollmentDate;
    private String rollNo;
    
    private String fatherName;
    private String motherName;
    private String parentPhone;
    private String bloodGroup;
    
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Attendance> attendances;
    
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Marks> marks;
    
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Fees> fees;
}
