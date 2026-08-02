package com.erp.service;

import com.erp.dto.request.TimetableRequest;
import com.erp.model.Timetable;
import java.util.List;

public interface TimetableService {
    List<Timetable> getTimetableByCourseAndSemester(Long courseId, Integer semester);
    Timetable createTimetable(TimetableRequest request);
    Timetable updateTimetable(Long id, TimetableRequest request);
    List<Timetable> getAllTimetables();
    void deleteTimetable(Long id);
}
