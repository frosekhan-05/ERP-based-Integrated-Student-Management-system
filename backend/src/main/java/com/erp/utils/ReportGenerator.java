package com.erp.utils;

import com.erp.model.Attendance;
import com.erp.model.Fees;
import com.erp.model.Marks;
import com.erp.model.Student;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Component
public class ReportGenerator {
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    
    public byte[] generateAttendanceReportPdf(List<Attendance> attendance, String title) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            // Add title
            document.add(new Paragraph(title)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(18)
                .setBold());
            
            document.add(new Paragraph("Generated on: " + LocalDate.now().format(DATE_FORMATTER))
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(10));
            
            document.add(new Paragraph("\n"));
            
            // Create table
            float[] columnWidths = {1, 2, 2, 2, 1, 2};
            Table table = new Table(UnitValue.createPercentArray(columnWidths));
            table.setWidth(UnitValue.createPercentValue(100));
            
            // Add headers
            String[] headers = {"S.No", "Student ID", "Student Name", "Date", "Status", "Subject"};
            for (String header : headers) {
                table.addHeaderCell(new Cell().add(new Paragraph(header).setBold()));
            }
            
            // Add data
            int sno = 1;
            for (Attendance att : attendance) {
                table.addCell(new Cell().add(new Paragraph(String.valueOf(sno++))));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(att.getStudent().getStudentId()))));
                table.addCell(new Cell().add(new Paragraph(
                    att.getStudent().getFirstName() + " " + att.getStudent().getLastName())));
                table.addCell(new Cell().add(new Paragraph(att.getDate().format(DATE_FORMATTER))));
                table.addCell(new Cell().add(new Paragraph(att.getStatus().toString())));
                table.addCell(new Cell().add(new Paragraph(att.getSubject().getSubjectName())));
            }
            
            document.add(table);
            document.close();
            
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF report", e);
        }
    }
    
    public byte[] generateMarksReportPdf(List<Marks> marks, String title) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            // Add title
            document.add(new Paragraph(title)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(18)
                .setBold());
            
            document.add(new Paragraph("Generated on: " + LocalDate.now().format(DATE_FORMATTER))
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(10));
            
            document.add(new Paragraph("\n"));
            
            // Create table
            float[] columnWidths = {1, 2, 2, 2, 1, 1, 1};
            Table table = new Table(UnitValue.createPercentArray(columnWidths));
            table.setWidth(UnitValue.createPercentValue(100));
            
            // Add headers
            String[] headers = {"S.No", "Student ID", "Student Name", "Subject", "Marks", "Max Marks", "Grade"};
            for (String header : headers) {
                table.addHeaderCell(new Cell().add(new Paragraph(header).setBold()));
            }
            
            // Add data
            int sno = 1;
            for (Marks mark : marks) {
                table.addCell(new Cell().add(new Paragraph(String.valueOf(sno++))));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(mark.getStudent().getStudentId()))));
                table.addCell(new Cell().add(new Paragraph(
                    mark.getStudent().getFirstName() + " " + mark.getStudent().getLastName())));
                table.addCell(new Cell().add(new Paragraph(mark.getSubject().getSubjectName())));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(mark.getMarksObtained()))));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(mark.getMaxMarks()))));
                table.addCell(new Cell().add(new Paragraph(mark.getGrade())));
            }
            
            document.add(table);
            document.close();
            
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF report", e);
        }
    }
    
    public byte[] generateFeesReportExcel(List<Fees> fees, String title) {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet("Fees Report");
            
            // Create header style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            
            // Create title row
            Row titleRow = sheet.createRow(0);
            org.apache.poi.ss.usermodel.Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue(title);
            titleCell.setCellStyle(headerStyle);
            
            // Create date row
            Row dateRow = sheet.createRow(1);
            dateRow.createCell(0).setCellValue("Generated on: " + LocalDate.now().format(DATE_FORMATTER));
            
            // Create header row
            String[] headers = {"S.No", "Student ID", "Student Name", "Fee Type", "Total Amount", 
                "Paid Amount", "Due Amount", "Due Date", "Status"};
            
            Row headerRow = sheet.createRow(3);
            for (int i = 0; i < headers.length; i++) {
                org.apache.poi.ss.usermodel.Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Add data
            int rowNum = 4;
            int sno = 1;
            
            for (Fees fee : fees) {
                Row row = sheet.createRow(rowNum++);
                
                row.createCell(0).setCellValue(sno++);
                row.createCell(1).setCellValue(String.valueOf(fee.getStudent().getStudentId()));
                row.createCell(2).setCellValue(
                    fee.getStudent().getFirstName() + " " + fee.getStudent().getLastName());
                row.createCell(3).setCellValue(fee.getFeeType().toString());
                row.createCell(4).setCellValue(fee.getTotalAmount());
                row.createCell(5).setCellValue(fee.getPaidAmount());
                row.createCell(6).setCellValue(fee.getDueAmount());
                row.createCell(7).setCellValue(fee.getDueDate().format(DATE_FORMATTER));
                row.createCell(8).setCellValue(fee.getStatus().toString());
            }
            
            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(baos);
            return baos.toByteArray();
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Excel report", e);
        }
    }
    
    public byte[] generateStudentReportCard(Student student, Map<String, Object> data) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            // Add header
            document.add(new Paragraph("STUDENT REPORT CARD")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(20)
                .setBold());
            
            document.add(new Paragraph("\n"));
            
            // Student information
            document.add(new Paragraph("Student Information:")
                .setFontSize(14)
                .setBold());
            
            document.add(new Paragraph("Name: " + student.getFirstName() + " " + student.getLastName()));
            document.add(new Paragraph("Student ID: " + student.getStudentId()));
            document.add(new Paragraph("Course: " + student.getCourse().getCourseName()));
            document.add(new Paragraph("Semester: " + student.getSemester()));
            
            document.add(new Paragraph("\n"));
            
            // Marks table
            @SuppressWarnings("unchecked")
            List<Marks> marks = (List<Marks>) data.get("marks");
            
            if (marks != null && !marks.isEmpty()) {
                document.add(new Paragraph("Academic Performance:")
                    .setFontSize(14)
                    .setBold());
                
                float[] columnWidths = {2, 3, 1, 1, 1, 1};
                Table table = new Table(UnitValue.createPercentArray(columnWidths));
                table.setWidth(UnitValue.createPercentValue(100));
                
                String[] headers = {"Subject", "Exam", "Marks", "Max Marks", "Percentage", "Grade"};
                for (String header : headers) {
                    table.addHeaderCell(new Cell().add(new Paragraph(header).setBold()));
                }
                
                for (Marks mark : marks) {
                    table.addCell(new Cell().add(new Paragraph(mark.getSubject().getSubjectName())));
                    String examName = mark.getExam() == null ? "-" : mark.getExam().getName();
                    table.addCell(new Cell().add(new Paragraph(examName)));
                    table.addCell(new Cell().add(new Paragraph(String.valueOf(mark.getMarksObtained()))));
                    table.addCell(new Cell().add(new Paragraph(String.valueOf(mark.getMaxMarks()))));
                    Double percentage = mark.getPercentage();
                    String percentageText = percentage == null ? "-" : String.format("%.2f", percentage) + "%";
                    table.addCell(new Cell().add(new Paragraph(percentageText)));
                    table.addCell(new Cell().add(new Paragraph(mark.getGrade())));
                }
                
                document.add(table);
            }
            
            // Summary
            document.add(new Paragraph("\n"));
            document.add(new Paragraph("Summary:")
                .setFontSize(14)
                .setBold());
            
            document.add(new Paragraph("Total Marks: " + data.get("totalMarks")));
            Object percentageObj = data.get("percentage");
            String percentageText = percentageObj == null
                ? "-"
                : String.format("%.2f", percentageObj) + "%";
            document.add(new Paragraph("Percentage: " + percentageText));
            document.add(new Paragraph("Grade: " + data.get("grade")));
            document.add(new Paragraph("Result: " + data.get("result")));
            
            document.close();
            
            return baos.toByteArray();
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate report card", e);
        }
    }
}
