package com.erp.course;

import com.erp.course.dto.SubjectRequest;

import java.util.List;

public interface SubjectService {
    Subject createSubject(SubjectRequest request);
    Subject updateSubject(Long id, SubjectRequest request);
    void deleteSubject(Long id);
    Subject getSubjectById(Long id);
    List<Subject> getAllSubjects();
    List<Subject> getSubjectsByCourse(Long courseId);
}
