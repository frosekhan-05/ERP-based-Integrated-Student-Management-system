package com.erp.timetable;

import com.erp.timetable.dto.TimetableRequest;
import com.erp.common.dto.ApiResponse;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.format.annotation.DateTimeFormat;
import com.erp.auth.UserRepository;
import com.erp.auth.User;
import java.time.LocalDate;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/timetable")
@RequiredArgsConstructor
public class TimetableController {

    private final TimetableService timetableService;
    private final UserRepository userRepository;

    private void verifyStudentAccess(Long studentId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT"))) {
            User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new AccessDeniedException("User not found"));
            if (!user.getId().equals(studentId)) {
                throw new AccessDeniedException("You can only access your own data");
            }
        }
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<?> getTimetableByStudent(@PathVariable Long studentId) {
        verifyStudentAccess(studentId);
        List<Timetable> timetable = timetableService.getTimetableByStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Timetable retrieved successfully", timetable));
    }

    @GetMapping("/student/{studentId}/today")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<?> getTodayTimetableByStudent(
            @PathVariable Long studentId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        verifyStudentAccess(studentId);
        LocalDate targetDate = date != null ? date : LocalDate.now();
        List<Timetable> timetable = timetableService.getTimetableByStudentAndDate(studentId, targetDate);
        return ResponseEntity.ok(ApiResponse.success("Today's timetable retrieved successfully", timetable));
    }

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
