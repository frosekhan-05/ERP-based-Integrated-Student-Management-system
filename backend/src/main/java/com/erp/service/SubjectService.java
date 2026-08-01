package com.erp.service;

import com.erp.dto.request.SubjectRequest;
import com.erp.model.Subject;
import java.util.List;

public interface SubjectService {
    Subject createSubject(SubjectRequest request);
    Subject updateSubject(Long id, SubjectRequest request);
    void deleteSubject(Long id);
    Subject getSubjectById(Long id);
    List<Subject> getAllSubjects();
    List<Subject> getSubjectsByCourse(Long courseId);
}
