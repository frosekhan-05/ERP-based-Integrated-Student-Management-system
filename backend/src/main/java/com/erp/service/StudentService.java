package com.erp.service;

import com.erp.dto.request.StudentRequest;
import com.erp.model.Student;
import java.util.List;
import java.util.Map;

public interface StudentService {
    Student createStudent(StudentRequest request);
    Student updateStudent(Long id, StudentRequest request);
    void deleteStudent(Long id);
    List<Student> getAllStudents();
    Student getStudentById(Long id);
    long getStudentCount();
    Student getStudentByUsername(String username);
    Student updateProfile(String username, Map<String, Object> updates);
}
