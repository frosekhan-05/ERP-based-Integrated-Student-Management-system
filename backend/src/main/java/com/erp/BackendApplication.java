package com.erp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
        System.out.println("==========================================");
        System.out.println("ERP Student Management System Started!");
        System.out.println("Access at: http://localhost:8081/api");
        System.out.println("==========================================");
    }
}
