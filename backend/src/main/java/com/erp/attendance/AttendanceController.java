package com.erp.attendance;

import com.erp.attendance.dto.AttendanceRequest;
import com.erp.attendance.dto.AttendanceResponse;
import com.erp.common.dto.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.erp.auth.UserRepository;
import com.erp.auth.User;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    
    private final AttendanceService attendanceService;
    private final UserRepository userRepository;

    private AttendanceResponse mapToResponse(Attendance attendance) {
        AttendanceResponse response = new AttendanceResponse();
        response.setId(attendance.getId());
        
        if (attendance.getStudent() != null) {
            response.setStudentId(attendance.getStudent().getId());
            response.setStudentName(attendance.getStudent().getFirstName() + " " + attendance.getStudent().getLastName());
        }
        
        if (attendance.getSubject() != null) {
            response.setSubjectId(attendance.getSubject().getId());
            response.setSubjectName(attendance.getSubject().getSubjectName());
        }
        
        response.setDate(attendance.getDate());
        response.setStatus(attendance.getStatus() != null ? attendance.getStatus().name() : null);
        response.setMarkedAt(attendance.getMarkedAt());
        response.setRemarks(attendance.getRemarks());
        
        return response;
    }

    private void verifyStudentAccess(Long studentId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("DEBUG: verifyStudentAccess called with studentId=" + studentId);
        System.out.println("DEBUG: auth.getAuthorities()=" + auth.getAuthorities());
        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT"))) {
            User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new AccessDeniedException("User not found"));
            System.out.println("DEBUG: Found user=" + user.getUsername() + ", user.getId()=" + user.getId());
            if (!user.getId().equals(studentId)) {
                System.out.println("DEBUG: Mismatch! user.getId()=" + user.getId() + " != studentId=" + studentId);
                throw new AccessDeniedException("You can only access your own data");
            }
        }
    }
    
    @GetMapping("/date/{date}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<?> getAttendanceByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<AttendanceResponse> attendance = attendanceService.getAttendanceByDate(date)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Attendance retrieved successfully", attendance));
    }
    
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<?> getAttendanceByStudent(
            @PathVariable Long studentId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        verifyStudentAccess(studentId);
        List<AttendanceResponse> attendance;
        if (date != null) {
            attendance = attendanceService.getAttendanceByStudentAndDate(studentId, date)
                    .stream().map(this::mapToResponse).collect(Collectors.toList());
        } else {
            attendance = attendanceService.getAttendanceByStudent(studentId)
                    .stream().map(this::mapToResponse).collect(Collectors.toList());
        }
        return ResponseEntity.ok(ApiResponse.success("Attendance retrieved successfully", attendance));
    }
    
    @GetMapping("/subject/{subjectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<?> getAttendanceBySubject(@PathVariable Long subjectId) {
        List<AttendanceResponse> attendance = attendanceService.getAttendanceBySubject(subjectId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Attendance retrieved successfully", attendance));
    }
    
    @PostMapping("/student/mark")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> markSelfAttendance(@RequestBody Map<String, String> request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new AccessDeniedException("User not found"));
            
            LocalDate date = request.containsKey("date") ? 
                LocalDate.parse(request.get("date")) : LocalDate.now();
            
            Attendance attendance = attendanceService.markSelfAttendance(user.getId(), date);
            return ResponseEntity.ok(ApiResponse.success("Attendance marked successfully", mapToResponse(attendance)));
            
        } catch (IllegalStateException e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.CONFLICT)
                .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to mark attendance: " + e.getMessage()));
        }
    }

    @PostMapping("/mark")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> markAttendance(@Valid @RequestBody AttendanceRequest request) {
        Attendance attendance = attendanceService.markAttendance(request);
        return ResponseEntity.ok(ApiResponse.success("Attendance marked successfully", mapToResponse(attendance)));
    }
    
    @PostMapping("/bulk")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> markBulkAttendance(@Valid @RequestBody List<AttendanceRequest> requests) {
        List<AttendanceResponse> attendances = attendanceService.markBulkAttendance(requests)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Bulk attendance marked successfully", attendances));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> updateAttendance(@PathVariable Long id, @Valid @RequestBody AttendanceRequest request) {
        Attendance attendance = attendanceService.updateAttendance(id, request);
        return ResponseEntity.ok(ApiResponse.success("Attendance updated successfully", mapToResponse(attendance)));
    }
    
    @GetMapping("/report/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<?> getAttendanceReport(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Map<String, Object> report = attendanceService.getAttendanceReport(studentId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Attendance report generated", report));
    }
    
    @GetMapping("/percentage/{studentId}/{subjectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<?> getAttendancePercentage(
            @PathVariable Long studentId,
            @PathVariable Long subjectId) {
        Double percentage = attendanceService.getAttendancePercentage(studentId, subjectId);
        return ResponseEntity.ok(ApiResponse.success("Attendance percentage retrieved", 
            Map.of("percentage", percentage)));
    }
    
    @GetMapping("/today")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<?> getTodayAttendance() {
        List<AttendanceResponse> attendance = attendanceService.getAttendanceByDate(LocalDate.now())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Today's attendance retrieved", attendance));
    }
}
