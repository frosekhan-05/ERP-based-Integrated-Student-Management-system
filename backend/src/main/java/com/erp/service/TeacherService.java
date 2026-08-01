package com.erp.service;

import com.erp.dto.request.TeacherRequest;
import com.erp.model.Student;
import com.erp.model.Subject;
import com.erp.model.Teacher;
import java.util.List;
import java.util.Map;

public interface TeacherService {
    Teacher createTeacher(TeacherRequest request);
    Teacher updateTeacher(Long id, TeacherRequest request);
    void deleteTeacher(Long id);
    List<Teacher> getAllTeachers();
    long getTeacherCount();
    Long getTeacherIdByUsername(String username);
    Map<String, Object> getDashboardData(Long teacherId);
    List<Subject> getTeacherSubjects(Long teacherId);
    List<Student> getAssignedStudents(Long teacherId);
}
