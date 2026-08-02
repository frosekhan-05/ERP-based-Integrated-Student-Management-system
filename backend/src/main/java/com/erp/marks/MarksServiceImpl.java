package com.erp.marks;

import com.erp.marks.dto.MarksRequest;

import com.erp.student.Student;
import com.erp.course.Subject;

import com.erp.student.StudentRepository;
import com.erp.course.SubjectRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarksServiceImpl implements MarksService {
    private final MarksRepository marksRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;

    @Override
    public Marks uploadMarks(MarksRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
            .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        Subject subject = subjectRepository.findById(request.getSubjectId())
            .orElseThrow(() -> new IllegalArgumentException("Subject not found"));

        Marks marks = new Marks();
        marks.setStudent(student);
        marks.setSubject(subject);
        Integer max = request.getMaxMarks() != null && request.getMaxMarks() > 0 ? request.getMaxMarks() : 100;
        marks.setMaxMarks(max);
        marks.setMarksObtained(request.getMarksObtained());
        
        if (request.getMarksObtained() != null) {
            double percentage = (request.getMarksObtained() / max) * 100.0;
            marks.setPercentage(percentage);
            marks.setGrade(calculateGrade(percentage));
            marks.setGpa(calculateGPA(percentage));
        }
        
        marks.setResult(determineResult(request.getMarksObtained(), max));
        marks.setRemarks(request.getRemarks());
        marks.setUploadedAt(LocalDateTime.now());

        return marksRepository.save(marks);
    }

    @Override
    public List<Marks> uploadBulkMarks(List<MarksRequest> requests) {
        return requests.stream()
            .map(this::uploadMarks)
            .collect(Collectors.toList());
    }

    @Override
    public Marks updateMarks(Long id, MarksRequest request) {
        Marks marks = marksRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Marks not found"));

        if (request.getStudentId() != null) {
            Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
            marks.setStudent(student);
        }

        if (request.getSubjectId() != null) {
            Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new IllegalArgumentException("Subject not found"));
            marks.setSubject(subject);
        }

        if (request.getMaxMarks() != null && request.getMaxMarks() > 0) {
            marks.setMaxMarks(request.getMaxMarks());
        }
        
        if (request.getMarksObtained() != null) {
            marks.setMarksObtained(request.getMarksObtained());
            Integer max = marks.getMaxMarks() != null && marks.getMaxMarks() > 0 ? marks.getMaxMarks() : 100;
            double percentage = (request.getMarksObtained() / max) * 100.0;
            marks.setPercentage(percentage);
            marks.setGrade(calculateGrade(percentage));
            marks.setGpa(calculateGPA(percentage));
            marks.setResult(determineResult(request.getMarksObtained(), max));
        }

        marks.setRemarks(request.getRemarks());
        marks.setUploadedAt(LocalDateTime.now());

        return marksRepository.save(marks);
    }

    @Override
    public List<Marks> getMarksByStudent(Long studentId) {
        return marksRepository.findByStudentId(studentId);
    }

    @Override
    public List<Marks> getMarksByStudentAndSubject(Long studentId, Long subjectId) {
        return marksRepository.findByStudentAndSubject(studentId, subjectId);
    }

    @Override
    public List<Marks> getMarksBySubject(Long subjectId) {
        return marksRepository.findBySubjectId(subjectId);
    }

    @Override
    public List<Marks> getMarksByExam(Long examId) {
        return marksRepository.findByExamId(examId);
    }

    @Override
    public Map<String, Object> generateStudentReport(Long studentId) {
        List<Marks> records = marksRepository.findByStudentId(studentId);
        double average = records.stream()
            .map(Marks::getMarksObtained)
            .filter(m -> m != null)
            .mapToDouble(Double::doubleValue)
            .average()
            .orElse(0.0);
        double highest = records.stream()
            .map(Marks::getMarksObtained)
            .filter(m -> m != null)
            .mapToDouble(Double::doubleValue)
            .max()
            .orElse(0.0);

        Map<String, Object> report = new java.util.HashMap<>();
        report.put("marks", records);
        report.put("average", average);
        report.put("highest", highest);
        report.put("count", records.size());
        return report;
    }

    @Override
    public Map<String, Object> generateSubjectReport(Long subjectId) {
        List<Marks> records = marksRepository.findBySubjectId(subjectId);
        double average = records.stream()
            .map(Marks::getMarksObtained)
            .filter(m -> m != null)
            .mapToDouble(Double::doubleValue)
            .average()
            .orElse(0.0);
        double highest = records.stream()
            .map(Marks::getMarksObtained)
            .filter(m -> m != null)
            .mapToDouble(Double::doubleValue)
            .max()
            .orElse(0.0);
        double lowest = records.stream()
            .map(Marks::getMarksObtained)
            .filter(m -> m != null)
            .mapToDouble(Double::doubleValue)
            .min()
            .orElse(0.0);

        Map<String, Object> report = new java.util.HashMap<>();
        report.put("marks", records);
        report.put("average", average);
        report.put("highest", highest);
        report.put("lowest", lowest);
        report.put("count", records.size());
        return report;
    }

    @Override
    public Map<String, Object> getSubjectStatistics(Long subjectId) {
        return generateSubjectReport(subjectId);
    }

    @Override
    public List<Map<String, Object>> getToppers(Long courseId, Integer semester) {
        List<Marks> records = marksRepository.findByCourseIdAndSemester(courseId, semester);

        return records.stream()
            .filter(m -> m.getStudent() != null)
            .collect(Collectors.groupingBy(m -> m.getStudent().getId(),
                Collectors.averagingDouble(m -> Optional.ofNullable(m.getMarksObtained()).orElse(0.0))))
            .entrySet().stream()
            .sorted(Map.Entry.<Long, Double>comparingByValue(Comparator.reverseOrder()))
            .map(entry -> {
                Map<String, Object> row = new java.util.HashMap<>();
                row.put("studentId", entry.getKey());
                row.put("averageMarks", entry.getValue());
                return row;
            })
            .collect(Collectors.toList());
    }

    private Marks.ResultStatus determineResult(Double marksObtained, Integer maxMarks) {
        if (marksObtained == null) {
            return Marks.ResultStatus.ABSENT;
        }
        double percentage = (marksObtained / maxMarks) * 100.0;
        return percentage >= 40.0 ? Marks.ResultStatus.PASS : Marks.ResultStatus.FAIL;
    }

    private String calculateGrade(double percentage) {
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B";
        if (percentage >= 60) return "C";
        if (percentage >= 50) return "D";
        if (percentage >= 40) return "E";
        return "F";
    }

    private Double calculateGPA(double percentage) {
        if (percentage >= 90) return 4.0;
        if (percentage >= 80) return 3.5;
        if (percentage >= 70) return 3.0;
        if (percentage >= 60) return 2.5;
        if (percentage >= 50) return 2.0;
        if (percentage >= 40) return 1.0;
        return 0.0;
    }
}
