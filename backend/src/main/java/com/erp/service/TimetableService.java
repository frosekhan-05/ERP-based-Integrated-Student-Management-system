package com.erp.service;

import com.erp.model.Timetable;
import java.util.List;

public interface TimetableService {
    List<Timetable> getTimetableByCourseAndSemester(Long courseId, Integer semester);
    Timetable createTimetable(Timetable timetable);
    List<Timetable> getAllTimetables();
    void deleteTimetable(Long id);
}
