package com.erp.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Entity
@Table(name = "subjects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subject {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String subjectName;
    
    @Column(unique = true, nullable = false)
    private String subjectCode;
    
    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
    
    private Integer semester;
    private Integer credits;
    private String description;
    private String syllabus;
    private Integer totalClasses;
    private Integer practicalHours;
    private Integer theoryHours;
    private Boolean isElective = false;
    private String prerequisite;
    
    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;
    
    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Attendance> attendances;
    
    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Marks> marks;
}
