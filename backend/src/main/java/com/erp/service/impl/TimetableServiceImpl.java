package com.erp.service.impl;

import com.erp.model.Timetable;
import com.erp.repository.TimetableRepository;
import com.erp.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TimetableServiceImpl implements TimetableService {
    
    private final TimetableRepository timetableRepository;

    @Override
    public List<Timetable> getTimetableByCourseAndSemester(Long courseId, Integer semester) {
        return timetableRepository.findByCourseIdAndSemester(courseId, semester);
    }

    @Override
    public Timetable createTimetable(Timetable timetable) {
        return timetableRepository.save(timetable);
    }

    @Override
    public List<Timetable> getAllTimetables() {
        return timetableRepository.findAll();
    }

    @Override
    public void deleteTimetable(Long id) {
        timetableRepository.deleteById(id);
    }
}
