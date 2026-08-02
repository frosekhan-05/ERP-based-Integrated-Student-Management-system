package com.erp.service.impl;

import com.erp.service.ReportGenerator;
import org.springframework.stereotype.Service;

@Service
public class ReportGeneratorImpl implements ReportGenerator {
    @Override
    public byte[] generateStudentReport(Long studentId) {
        return new byte[0];
    }
}
