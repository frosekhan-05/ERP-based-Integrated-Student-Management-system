package com.erp.common.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class DateUtils {
    
    // Formatters
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");
    private static final DateTimeFormatter ISO_DATE_FORMATTER = DateTimeFormatter.ISO_DATE;
    private static final DateTimeFormatter ISO_DATE_TIME_FORMATTER = DateTimeFormatter.ISO_DATE_TIME;
    private static final DateTimeFormatter MONTH_YEAR_FORMATTER = DateTimeFormatter.ofPattern("MMMM yyyy");
    private static final DateTimeFormatter YEAR_MONTH_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM");
    
    /**
     * Format LocalDate to string (dd/MM/yyyy)
     */
    public static String formatDate(LocalDate date) {
        return date != null ? date.format(DATE_FORMATTER) : "";
    }
    
    /**
     * Format LocalDateTime to string (dd/MM/yyyy HH:mm:ss)
     */
    public static String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(DATE_TIME_FORMATTER) : "";
    }
    
    /**
     * Format LocalDateTime to time string (HH:mm:ss)
     */
    public static String formatTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(TIME_FORMATTER) : "";
    }
    
    /**
     * Format LocalDate to ISO format (yyyy-MM-dd)
     */
    public static String formatToIsoDate(LocalDate date) {
        return date != null ? date.format(ISO_DATE_FORMATTER) : "";
    }
    
    /**
     * Format LocalDateTime to ISO format
     */
    public static String formatToIsoDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(ISO_DATE_TIME_FORMATTER) : "";
    }
    
    /**
     * Parse string to LocalDate (dd/MM/yyyy)
     */
    public static LocalDate parseDate(String dateStr) {
        try {
            return dateStr != null && !dateStr.isEmpty() ? 
                LocalDate.parse(dateStr, DATE_FORMATTER) : null;
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format. Expected dd/MM/yyyy", e);
        }
    }
    
    /**
     * Parse string to LocalDateTime (dd/MM/yyyy HH:mm:ss)
     */
    public static LocalDateTime parseDateTime(String dateTimeStr) {
        try {
            return dateTimeStr != null && !dateTimeStr.isEmpty() ? 
                LocalDateTime.parse(dateTimeStr, DATE_TIME_FORMATTER) : null;
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid datetime format. Expected dd/MM/yyyy HH:mm:ss", e);
        }
    }
    
    /**
     * Parse ISO date string to LocalDate
     */
    public static LocalDate parseIsoDate(String isoDateStr) {
        try {
            return isoDateStr != null && !isoDateStr.isEmpty() ? 
                LocalDate.parse(isoDateStr) : null;
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid ISO date format. Expected yyyy-MM-dd", e);
        }
    }
    
    /**
     * Calculate days between two dates
     */
    public static long daysBetween(LocalDate start, LocalDate end) {
        if (start == null || end == null) return 0;
        return ChronoUnit.DAYS.between(start, end);
    }
    
    /**
     * Calculate months between two dates
     */
    public static long monthsBetween(LocalDate start, LocalDate end) {
        if (start == null || end == null) return 0;
        return ChronoUnit.MONTHS.between(start.withDayOfMonth(1), end.withDayOfMonth(1));
    }
    
    /**
     * Calculate years between two dates
     */
    public static long yearsBetween(LocalDate start, LocalDate end) {
        if (start == null || end == null) return 0;
        return ChronoUnit.YEARS.between(start, end);
    }
    
    /**
     * Calculate hours between two times
     */
    public static long hoursBetween(LocalTime start, LocalTime end) {
        if (start == null || end == null) return 0;
        return ChronoUnit.HOURS.between(start, end);
    }
    
    /**
     * Check if date is weekend (Saturday or Sunday)
     */
    public static boolean isWeekend(LocalDate date) {
        if (date == null) return false;
        return date.getDayOfWeek().getValue() >= 6;
    }
    
    /**
     * Check if date is future
     */
    public static boolean isFutureDate(LocalDate date) {
        if (date == null) return false;
        return date.isAfter(LocalDate.now());
    }
    
    /**
     * Check if date is past
     */
    public static boolean isPastDate(LocalDate date) {
        if (date == null) return false;
        return date.isBefore(LocalDate.now());
    }
    
    /**
     * Check if date is today
     */
    public static boolean isToday(LocalDate date) {
        if (date == null) return false;
        return date.equals(LocalDate.now());
    }
    
    /**
     * Check if date is within range
     */
    public static boolean isWithinRange(LocalDate date, LocalDate start, LocalDate end) {
        if (date == null || start == null || end == null) return false;
        return !date.isBefore(start) && !date.isAfter(end);
    }
    
    /**
     * Get first day of month
     */
    public static LocalDate getFirstDayOfMonth(LocalDate date) {
        return date != null ? date.with(TemporalAdjusters.firstDayOfMonth()) : null;
    }
    
    /**
     * Get last day of month
     */
    public static LocalDate getLastDayOfMonth(LocalDate date) {
        return date != null ? date.with(TemporalAdjusters.lastDayOfMonth()) : null;
    }
    
    /**
     * Get first day of year
     */
    public static LocalDate getFirstDayOfYear(int year) {
        return LocalDate.of(year, 1, 1);
    }
    
    /**
     * Get last day of year
     */
    public static LocalDate getLastDayOfYear(int year) {
        return LocalDate.of(year, 12, 31);
    }
    
    /**
     * Get first day of current month
     */
    public static LocalDate getFirstDayOfCurrentMonth() {
        return LocalDate.now().with(TemporalAdjusters.firstDayOfMonth());
    }
    
    /**
     * Get last day of current month
     */
    public static LocalDate getLastDayOfCurrentMonth() {
        return LocalDate.now().with(TemporalAdjusters.lastDayOfMonth());
    }
    
    /**
     * Get list of dates between start and end (inclusive)
     */
    public static List<LocalDate> getDatesBetween(LocalDate start, LocalDate end) {
        List<LocalDate> dates = new ArrayList<>();
        if (start == null || end == null) return dates;
        
        LocalDate current = start;
        while (!current.isAfter(end)) {
            dates.add(current);
            current = current.plusDays(1);
        }
        return dates;
    }
    
    /**
     * Get working days between two dates (excluding weekends)
     */
    public static List<LocalDate> getWorkingDaysBetween(LocalDate start, LocalDate end) {
        List<LocalDate> workingDays = new ArrayList<>();
        if (start == null || end == null) return workingDays;
        
        LocalDate current = start;
        while (!current.isAfter(end)) {
            if (!isWeekend(current)) {
                workingDays.add(current);
            }
            current = current.plusDays(1);
        }
        return workingDays;
    }
    
    /**
     * Calculate age from birth date
     */
    public static int getAge(LocalDate birthDate) {
        if (birthDate == null) return 0;
        return (int) ChronoUnit.YEARS.between(birthDate, LocalDate.now());
    }
    
    /**
     * Get current academic year (e.g., 2024-2025)
     */
    public static String getCurrentAcademicYear() {
        LocalDate now = LocalDate.now();
        int year = now.getYear();
        int month = now.getMonthValue();
        
        // Academic year starts in July
        if (month >= 7) {
            return year + "-" + (year + 1);
        } else {
            return (year - 1) + "-" + year;
        }
    }
    
    /**
     * Get academic year from date
     */
    public static String getAcademicYear(LocalDate date) {
        if (date == null) return "";
        
        int year = date.getYear();
        int month = date.getMonthValue();
        
        if (month >= 7) {
            return year + "-" + (year + 1);
        } else {
            return (year - 1) + "-" + year;
        }
    }
    
    /**
     * Calculate current semester from enrollment date
     */
    public static int getCurrentSemester(LocalDate enrollmentDate) {
        if (enrollmentDate == null) return 1;
        
        long months = monthsBetween(enrollmentDate, LocalDate.now());
        int semester = (int) (months / 6) + 1;
        
        return Math.max(1, Math.min(semester, 8)); // Assuming max 8 semesters
    }
    
    /**
     * Check if date is within current academic year
     */
    public static boolean isWithinCurrentAcademicYear(LocalDate date) {
        if (date == null) return false;
        
        String academicYear = getCurrentAcademicYear();
        String[] years = academicYear.split("-");
        int startYear = Integer.parseInt(years[0]);
        int endYear = Integer.parseInt(years[1]);
        
        LocalDate start = LocalDate.of(startYear, 7, 1);
        LocalDate end = LocalDate.of(endYear, 6, 30);
        
        return !date.isBefore(start) && !date.isAfter(end);
    }
    
    /**
     * Get semester start date
     */
    public static LocalDate getSemesterStartDate(int year, int semester) {
        if (semester == 1) {
            return LocalDate.of(year, 7, 1); // Odd semester starts in July
        } else {
            return LocalDate.of(year, 1, 1); // Even semester starts in January
        }
    }
    
    /**
     * Get semester end date
     */
    public static LocalDate getSemesterEndDate(int year, int semester) {
        if (semester == 1) {
            return LocalDate.of(year, 12, 31);
        } else {
            return LocalDate.of(year, 6, 30);
        }
    }
    
    /**
     * Add days to date
     */
    public static LocalDate addDays(LocalDate date, int days) {
        return date != null ? date.plusDays(days) : null;
    }
    
    /**
     * Add months to date
     */
    public static LocalDate addMonths(LocalDate date, int months) {
        return date != null ? date.plusMonths(months) : null;
    }
    
    /**
     * Add years to date
     */
    public static LocalDate addYears(LocalDate date, int years) {
        return date != null ? date.plusYears(years) : null;
    }
    
    /**
     * Subtract days from date
     */
    public static LocalDate subtractDays(LocalDate date, int days) {
        return date != null ? date.minusDays(days) : null;
    }
    
    /**
     * Subtract months from date
     */
    public static LocalDate subtractMonths(LocalDate date, int months) {
        return date != null ? date.minusMonths(months) : null;
    }
    
    /**
     * Subtract years from date
     */
    public static LocalDate subtractYears(LocalDate date, int years) {
        return date != null ? date.minusYears(years) : null;
    }
    
    /**
     * Get maximum of two dates
     */
    public static LocalDate max(LocalDate date1, LocalDate date2) {
        if (date1 == null) return date2;
        if (date2 == null) return date1;
        return date1.isAfter(date2) ? date1 : date2;
    }
    
    /**
     * Get minimum of two dates
     */
    public static LocalDate min(LocalDate date1, LocalDate date2) {
        if (date1 == null) return date2;
        if (date2 == null) return date1;
        return date1.isBefore(date2) ? date1 : date2;
    }
    
    /**
     * Convert milliseconds to days
     */
    public static long millisToDays(long millis) {
        return TimeUnit.MILLISECONDS.toDays(millis);
    }
    
    /**
     * Convert days to milliseconds
     */
    public static long daysToMillis(long days) {
        return TimeUnit.DAYS.toMillis(days);
    }
    
    /**
     * Get month name
     */
    public static String getMonthName(LocalDate date) {
        return date != null ? date.format(DateTimeFormatter.ofPattern("MMMM")) : "";
    }
    
    /**
     * Get day name
     */
    public static String getDayName(LocalDate date) {
        return date != null ? date.format(DateTimeFormatter.ofPattern("EEEE")) : "";
    }
    
    /**
     * Check if year is leap year
     */
    public static boolean isLeapYear(int year) {
        return LocalDate.of(year, 1, 1).isLeapYear();
    }
    
    /**
     * Get days in month
     */
    public static int getDaysInMonth(int year, int month) {
        return LocalDate.of(year, month, 1).lengthOfMonth();
    }
    
    /**
     * Validate date string
     */
    public static boolean isValidDate(String dateStr) {
        try {
            if (dateStr == null || dateStr.isEmpty()) return false;
            LocalDate.parse(dateStr, DATE_FORMATTER);
            return true;
        } catch (DateTimeParseException e) {
            return false;
        }
    }
    
    /**
     * Validate time string
     */
    public static boolean isValidTime(String timeStr) {
        try {
            if (timeStr == null || timeStr.isEmpty()) return false;
            LocalTime.parse(timeStr, TIME_FORMATTER);
            return true;
        } catch (DateTimeParseException e) {
            return false;
        }
    }
    
    /**
     * Get current timestamp as string
     */
    public static String getCurrentTimestamp() {
        return formatDateTime(LocalDateTime.now());
    }
    
    /**
     * Get current date as string
     */
    public static String getCurrentDate() {
        return formatDate(LocalDate.now());
    }
    
    /**
     * Get relative time description
     */
    public static String getRelativeTimeDescription(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        
        LocalDateTime now = LocalDateTime.now();
        long minutes = ChronoUnit.MINUTES.between(dateTime, now);
        long hours = ChronoUnit.HOURS.between(dateTime, now);
        long days = ChronoUnit.DAYS.between(dateTime.toLocalDate(), now.toLocalDate());
        
        if (minutes < 1) return "just now";
        if (minutes < 60) return minutes + " minutes ago";
        if (hours < 24) return hours + " hours ago";
        if (days == 1) return "yesterday";
        if (days < 7) return days + " days ago";
        if (days < 30) return (days / 7) + " weeks ago";
        if (days < 365) return (days / 30) + " months ago";
        return (days / 365) + " years ago";
    }
}
