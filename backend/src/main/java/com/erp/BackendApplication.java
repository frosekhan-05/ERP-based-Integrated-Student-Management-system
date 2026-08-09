package com.erp;


import com.erp.student.Student;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BackendApplication {
    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(BackendApplication.class, args);
        String port = context.getEnvironment().getProperty("server.port", "8081");
        System.out.println("==========================================");
        System.out.println("ERP Student Management System Started!");
        System.out.println("Access at: http://localhost:" + port + "/api");
        System.out.println("==========================================");
    }
}
