package com.erp.timetable;

import com.erp.timetable.dto.TimetableRequest;

import java.util.List;

public interface TimetableService {
    List<Timetable> getTimetableByCourseAndSemester(Long courseId, Integer semester);
    Timetable createTimetable(TimetableRequest request);
    Timetable updateTimetable(Long id, TimetableRequest request);
    List<Timetable> getAllTimetables();
    void deleteTimetable(Long id);
}
