package com.erp.service.impl;

import com.erp.dto.request.TimetableRequest;
import com.erp.model.Course;
import com.erp.model.Subject;
import com.erp.model.Teacher;
import com.erp.model.Timetable;
import com.erp.repository.CourseRepository;
import com.erp.repository.SubjectRepository;
import com.erp.repository.TeacherRepository;
import com.erp.repository.TimetableRepository;
import com.erp.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TimetableServiceImpl implements TimetableService {
    
    private final TimetableRepository timetableRepository;
    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;

    @Override
    public List<Timetable> getTimetableByCourseAndSemester(Long courseId, Integer semester) {
        return timetableRepository.findByCourseIdAndSemester(courseId, semester);
    }

    @Override
    @Transactional
    public Timetable createTimetable(TimetableRequest request) {
        Timetable timetable = new Timetable();
        mapRequestToTimetable(request, timetable);
        return timetableRepository.save(timetable);
    }

    @Override
    @Transactional
    public Timetable updateTimetable(Long id, TimetableRequest request) {
        Timetable timetable = timetableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Timetable not found with id " + id));
        mapRequestToTimetable(request, timetable);
        return timetableRepository.save(timetable);
    }

    @Override
    public List<Timetable> getAllTimetables() {
        return timetableRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteTimetable(Long id) {
        timetableRepository.deleteById(id);
    }
    
    private void mapRequestToTimetable(TimetableRequest request, Timetable timetable) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found with id " + request.getCourseId()));
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found with id " + request.getSubjectId()));
        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found with id " + request.getTeacherId()));
        
        timetable.setCourse(course);
        timetable.setSubject(subject);
        timetable.setTeacher(teacher);
        timetable.setSemester(request.getSemester());
        timetable.setDayOfWeek(request.getDay());
        timetable.setStartTime(request.getStartTime());
        timetable.setEndTime(request.getEndTime());
        timetable.setRoomNo(request.getRoomNo());
        timetable.setBatch(request.getBatch());
    }
}
