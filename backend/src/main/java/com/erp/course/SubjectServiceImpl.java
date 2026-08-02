package com.erp.course;

import com.erp.course.dto.SubjectRequest;


import com.erp.teacher.Teacher;


import com.erp.teacher.TeacherRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;

    @Override
    @Transactional
    public Subject createSubject(SubjectRequest request) {
        if (subjectRepository.existsBySubjectCode(request.getSubjectCode())) {
            throw new RuntimeException("Subject with code " + request.getSubjectCode() + " already exists");
        }

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found with id " + request.getCourseId()));
        
        Teacher teacher = null;
        if (request.getTeacherId() != null) {
            teacher = teacherRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new RuntimeException("Teacher not found with id " + request.getTeacherId()));
        }

        Subject subject = new Subject();
        mapRequestToSubject(request, subject, course, teacher);
        return subjectRepository.save(subject);
    }

    @Override
    @Transactional
    public Subject updateSubject(Long id, SubjectRequest request) {
        Subject subject = getSubjectById(id);
        
        if (!subject.getSubjectCode().equals(request.getSubjectCode()) && 
            subjectRepository.existsBySubjectCode(request.getSubjectCode())) {
            throw new RuntimeException("Subject with code " + request.getSubjectCode() + " already exists");
        }

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found with id " + request.getCourseId()));
                
        Teacher teacher = null;
        if (request.getTeacherId() != null) {
            teacher = teacherRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new RuntimeException("Teacher not found with id " + request.getTeacherId()));
        }

        mapRequestToSubject(request, subject, course, teacher);
        return subjectRepository.save(subject);
    }

    @Override
    @Transactional
    public void deleteSubject(Long id) {
        Subject subject = getSubjectById(id);
        subjectRepository.delete(subject);
    }

    @Override
    public Subject getSubjectById(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with id " + id));
    }

    @Override
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }
    
    @Override
    public List<Subject> getSubjectsByCourse(Long courseId) {
        return subjectRepository.findByCourseId(courseId);
    }
    
    private void mapRequestToSubject(SubjectRequest request, Subject subject, Course course, Teacher teacher) {
        subject.setSubjectName(request.getSubjectName());
        subject.setSubjectCode(request.getSubjectCode());
        subject.setCourse(course);
        subject.setTeacher(teacher);
        subject.setSemester(request.getSemester());
        subject.setCredits(request.getCredits());
        subject.setDescription(request.getDescription());
        subject.setSyllabus(request.getSyllabus());
        subject.setTotalClasses(request.getTotalClasses());
        subject.setPracticalHours(request.getPracticalHours());
        subject.setTheoryHours(request.getTheoryHours());
        subject.setIsElective(request.getIsElective());
        subject.setPrerequisite(request.getPrerequisite());
    }
}
