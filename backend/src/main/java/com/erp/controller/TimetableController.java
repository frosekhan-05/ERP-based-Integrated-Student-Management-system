package com.erp.controller;

import com.erp.dto.request.TimetableRequest;
import com.erp.dto.response.ApiResponse;
import com.erp.model.Timetable;
import com.erp.service.TimetableService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timetable")
@RequiredArgsConstructor
public class TimetableController {

    private final TimetableService timetableService;

    @GetMapping
    public ResponseEntity<?> getAllTimetables() {
        List<Timetable> timetables = timetableService.getAllTimetables();
        return ResponseEntity.ok(ApiResponse.success("Timetables retrieved successfully", timetables));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTimetable(@Valid @RequestBody TimetableRequest request) {
        Timetable savedTimetable = timetableService.createTimetable(request);
        return ResponseEntity.ok(ApiResponse.success("Timetable created successfully", savedTimetable));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateTimetable(@PathVariable Long id, @Valid @RequestBody TimetableRequest request) {
        Timetable updatedTimetable = timetableService.updateTimetable(id, request);
        return ResponseEntity.ok(ApiResponse.success("Timetable updated successfully", updatedTimetable));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTimetable(@PathVariable Long id) {
        timetableService.deleteTimetable(id);
        return ResponseEntity.ok(ApiResponse.success("Timetable deleted successfully", null));
    }
}
