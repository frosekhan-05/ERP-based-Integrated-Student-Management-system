package com.erp.timetable;


import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TimetableRepository extends JpaRepository<Timetable, Long> {
    List<Timetable> findByCourseIdAndSemester(Long courseId, Integer semester);
}
