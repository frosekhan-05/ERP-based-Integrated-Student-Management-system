package com.erp.timetable;

import com.erp.timetable.dto.TimetableRequest;

import java.util.List;

public interface TimetableService {
    List<Timetable> getTimetableByCourseAndSemester(Long courseId, Integer semester);
    List<Timetable> getTimetableByStudent(Long studentId);
    List<Timetable> getTimetableByStudentAndDate(Long studentId, java.time.LocalDate date);
    Timetable createTimetable(TimetableRequest request);
    Timetable updateTimetable(Long id, TimetableRequest request);
    List<Timetable> getAllTimetables();
    void deleteTimetable(Long id);
}
