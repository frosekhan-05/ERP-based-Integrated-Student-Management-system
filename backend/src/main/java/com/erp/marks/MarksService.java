package com.erp.marks;

import com.erp.marks.dto.MarksRequest;

import java.util.List;
import java.util.Map;

public interface MarksService {
    Marks uploadMarks(MarksRequest request);
    List<Marks> uploadBulkMarks(List<MarksRequest> requests);
    Marks updateMarks(Long id, MarksRequest request);
    List<Marks> getMarksByStudent(Long studentId);
    List<Marks> getMarksByStudentAndSubject(Long studentId, Long subjectId);
    List<Marks> getMarksBySubject(Long subjectId);
    List<Marks> getMarksByExam(Long examId);
    Map<String, Object> generateStudentReport(Long studentId);
    Map<String, Object> generateSubjectReport(Long subjectId);
    Map<String, Object> getSubjectStatistics(Long subjectId);
    List<Map<String, Object>> getToppers(Long courseId, Integer semester);
}
