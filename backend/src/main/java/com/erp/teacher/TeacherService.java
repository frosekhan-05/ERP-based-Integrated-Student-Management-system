package com.erp.teacher;

import com.erp.teacher.dto.TeacherRequest;
import com.erp.student.Student;
import com.erp.course.Subject;

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
